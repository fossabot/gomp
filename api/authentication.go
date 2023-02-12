package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/chadweimer/gomp/db"
	"github.com/chadweimer/gomp/models"
	"github.com/golang-jwt/jwt/v4"
	"github.com/rs/zerolog/log"
)

type gompClaims struct {
	jwt.RegisteredClaims

	Scopes jwt.ClaimStrings `json:"scopes"`
}

func (h apiHandler) Authenticate(ctx context.Context, request AuthenticateRequestObject) (AuthenticateResponseObject, error) {
	credentials := request.Body
	user, err := h.db.Users().Authenticate(credentials.Username, credentials.Password)
	if err != nil {
		h.LogError(ctx, err)
		return Authenticate401Response{}, nil
	}

	tokenStr, err := h.createToken(user)
	if err != nil {
		return nil, err
	}

	return Authenticate200JSONResponse{Token: tokenStr, User: *user}, nil
}

func (h apiHandler) RefreshToken(ctx context.Context, _ RefreshTokenRequestObject) (RefreshTokenResponseObject, error) {
	return withCurrentUser[RefreshTokenResponseObject](ctx, h, RefreshToken401Response{}, func(userId int64) (RefreshTokenResponseObject, error) {
		user, err := h.db.Users().Read(userId)
		if err != nil {
			h.LogError(ctx, err)
			return RefreshToken401Response{}, nil
		}

		tokenStr, err := h.createToken(&user.User)
		if err != nil {
			return nil, err
		}

		return RefreshToken200JSONResponse{Token: tokenStr, User: user.User}, nil
	})
}

func (h apiHandler) createToken(user *models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, gompClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().AddDate(0, 0, 14)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   strconv.FormatInt(*user.Id, 10),
		},
		Scopes: jwt.ClaimStrings(getScopes(user)),
	})

	// Always sign using the 0'th key
	tokenStr, err := token.SignedString([]byte(h.secureKeys[0]))
	if err != nil {
		return "", err
	}
	return tokenStr, nil
}

func (h apiHandler) checkScopes(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		routeScopes, ok := r.Context().Value(BearerScopes).([]string)
		if ok {
			user, claims, err := h.isAuthenticated(r)
			if err != nil {
				h.Error(w, r, http.StatusUnauthorized, err)
				return
			}

			// If the route requires scopes, check them
			if len(routeScopes) > 0 && (len(routeScopes) != 1 || routeScopes[0] != "") {
				// If the user has been modified since issuing the token,
				// we need to check if the scopes are still the same
				if claims.IssuedAt.Time.Before(*user.ModifiedAt) {
					// If the scopes of the token don't match the latest scopes of the user,
					// don't proceed. The client should refresh the token and try again.
					userScopes := getScopes(user)
					if !reflect.DeepEqual(userScopes, []string(claims.Scopes)) {
						h.Error(w, r, http.StatusForbidden, errors.New("user scopes have changed"))
						return
					}
				}

				for _, scope := range routeScopes {
					if err := hasScope(scope, claims); err != nil {
						err := fmt.Errorf("endpoint '%s' requires '%s' scope: %w", r.URL.Path, scope, err)
						h.Error(w, r, http.StatusForbidden, err)
						return
					}
				}
			}
		}

		next.ServeHTTP(w, r)
	})
}

func (h apiHandler) isAuthenticated(r *http.Request) (*models.User, *gompClaims, error) {
	token, err := h.getAuthTokenFromRequest(r)
	if err != nil {
		return nil, nil, err
	}

	claims := token.Claims.(*gompClaims)
	if len(claims.Scopes) == 0 {
		return nil, nil, errors.New("token had no scopes")
	}

	userId, err := h.getUserIdFromToken(token)
	if err != nil {
		return nil, nil, err
	}

	user, err := h.verifyUserExists(userId)
	if err != nil {
		if errors.Is(err, db.ErrNotFound) {
			return nil, nil, errors.New("invalid user")
		}

		return nil, nil, err
	}

	// Add the user's ID and token to the list of params
	ctx := r.Context()
	ctx = context.WithValue(ctx, currentUserIdCtxKey, user.Id)
	ctx = context.WithValue(ctx, currentUserTokenCtxKey, token)
	*r = *r.WithContext(ctx)

	return user, claims, nil
}

func getScopes(user *models.User) []string {
	var scopes []string

	scopes = append(scopes, string(models.Viewer))
	switch user.AccessLevel {
	case models.Admin:
		scopes = append(scopes, string(models.Admin))
		scopes = append(scopes, string(models.Editor))
	case models.Editor:
		scopes = append(scopes, string(models.Editor))
	}

	return scopes
}

func hasScope(required string, claims *gompClaims) error {
	for _, scope := range claims.Scopes {
		if required == scope {
			return nil
		}
	}
	return errors.New("missing scope")
}

func (h apiHandler) getAuthTokenFromRequest(r *http.Request) (*jwt.Token, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return nil, errors.New("authorization header missing")
	}

	authHeaderParts := strings.Split(authHeader, " ")
	if len(authHeaderParts) != 2 || strings.ToLower(authHeaderParts[0]) != "bearer" {
		return nil, errors.New("authorization header must be in the form 'Bearer {token}'")
	}

	tokenStr := authHeaderParts[1]

	// Try each key when validating the token
	for i, key := range h.secureKeys {
		token, err := jwt.ParseWithClaims(tokenStr, &gompClaims{}, func(token *jwt.Token) (interface{}, error) {
			if token.Method != jwt.SigningMethodHS256 {
				return nil, errors.New("incorrect signing method")
			}

			return []byte(key), nil
		})
		if err != nil {
			log.Err(err).Int("key-index", i).Msg("Failed parsing JWT token")
			if i < (len(h.secureKeys) + 1) {
				log.Debug().Msg("Will try again with next key")
			}
		} else if token.Valid {
			return token, nil
		}
	}

	return nil, errors.New("invalid token")
}

func (apiHandler) getUserIdFromToken(token *jwt.Token) (int64, error) {
	claims := token.Claims.(*gompClaims)
	userId, err := strconv.ParseInt(claims.Subject, 10, 64)
	if err != nil {
		log.Err(err).Msg("Invalid claims")
		return -1, errors.New("invalid claims")
	}

	return userId, nil
}

func (h apiHandler) verifyUserExists(userId int64) (*models.User, error) {
	// Verify this is a valid user in the DB
	user, err := h.db.Users().Read(userId)
	if err != nil {
		if errors.Is(err, db.ErrNotFound) {
			return nil, err
		}

		log.Err(err).Msg("Error retrieving user info")
		return nil, errors.New("error retrieving user info")
	}

	return &user.User, nil
}

func withCurrentUser[TResponse interface{}](ctx context.Context, h apiHandler, invalidUserResponse TResponse, do func(userId int64) (TResponse, error)) (TResponse, error) {
	userId, err := getResourceIdFromCtx(ctx, currentUserIdCtxKey)
	if err != nil {
		h.LogError(ctx, err)
		return invalidUserResponse, nil
	}

	return do(userId)
}
