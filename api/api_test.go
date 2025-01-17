package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"testing"

	"github.com/chadweimer/gomp/db"
)

func Test_getStatusFromError(t *testing.T) {
	type getStatusFromErrorTest struct {
		err            error
		fallbackStatus int
		expectedStatus int
	}

	// Arrange
	tests := []getStatusFromErrorTest{
		{db.ErrNotFound, http.StatusNotFound, http.StatusNotFound},
		{db.ErrNotFound, http.StatusForbidden, http.StatusNotFound},
		{db.ErrNotFound, http.StatusConflict, http.StatusNotFound},
		{fmt.Errorf("some error: %w", db.ErrNotFound), http.StatusNotFound, http.StatusNotFound},
		{fmt.Errorf("some error: %w", db.ErrNotFound), http.StatusForbidden, http.StatusNotFound},
		{fmt.Errorf("some error: %w", db.ErrNotFound), http.StatusConflict, http.StatusNotFound},
		{errMismatchedId, http.StatusBadRequest, http.StatusBadRequest},
		{errMismatchedId, http.StatusForbidden, http.StatusBadRequest},
		{errMismatchedId, http.StatusConflict, http.StatusBadRequest},
		{fmt.Errorf("some error: %w", errMismatchedId), http.StatusBadRequest, http.StatusBadRequest},
		{fmt.Errorf("some error: %w", errMismatchedId), http.StatusForbidden, http.StatusBadRequest},
		{fmt.Errorf("some error: %w", errMismatchedId), http.StatusConflict, http.StatusBadRequest},
		{errors.New("some error"), http.StatusForbidden, http.StatusForbidden},
		{errors.New("some error"), http.StatusBadRequest, http.StatusBadRequest},
		{errors.New("some error"), http.StatusInternalServerError, http.StatusInternalServerError},
	}

	for i, test := range tests {
		t.Run(fmt.Sprint(i), func(t *testing.T) {
			// Act
			if actualStatus := getStatusFromError(test.err, test.fallbackStatus); actualStatus != test.expectedStatus {
				// Assert
				t.Errorf("actual '%s' not equal to expected '%s'. err: %v, fallback: %s",
					http.StatusText(actualStatus),
					http.StatusText(test.expectedStatus),
					test.err,
					http.StatusText(test.fallbackStatus))
			}
		})
	}
}

func Test_getResourceIdFromCtx(t *testing.T) {
	type getResourceIdFromCtxTest struct {
		key    contextKey
		val    int64
		usePtr bool
	}

	// Arrange
	tests := []getResourceIdFromCtxTest{
		{contextKey("the-item"), 10, false},
		{contextKey("the-item"), 10, true},
		{contextKey("the-item"), -1, false},
	}

	for i, test := range tests {
		t.Run(fmt.Sprint(i), func(t *testing.T) {
			ctx := context.Background()
			// Treat non-positive as not adding to context
			if test.val > 0 {
				if test.usePtr {
					ctx = context.WithValue(ctx, test.key, &test.val)
				} else {
					ctx = context.WithValue(ctx, test.key, test.val)
				}
			}

			// Act
			id, err := getResourceIdFromCtx(ctx, test.key)

			// Assert
			if err != nil && test.val > 0 {
				t.Errorf("received err: %v", err)
			} else if err == nil {
				if id != test.val {
					t.Errorf("actual: %d, expected: %d", id, test.val)
				}
			}
		})
	}
}
