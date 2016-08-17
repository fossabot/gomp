package main

import (
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"gopkg.in/unrolled/render.v1"
)

type uiRouter struct {
	uiMux *httprouter.Router
	*render.Render
}

func newUIRouter(renderer *render.Render) *uiRouter {
	r := uiRouter{
		Render: renderer,
	}

	r.uiMux = httprouter.New()
	r.uiMux.GET("/", r.home)
	r.uiMux.GET("/login", r.login)
	r.uiMux.GET("/new", r.createRecipe)
	r.uiMux.GET("/recipes", r.listRecipes)
	r.uiMux.GET("/recipes/:id", r.getRecipe)
	r.uiMux.GET("/recipes/:id/edit", r.editRecipe)
	r.uiMux.NotFound = http.HandlerFunc(r.notFound)

	return &r
}

func (r uiRouter) ServeHTTP(resp http.ResponseWriter, req *http.Request, next http.HandlerFunc) {
	r.uiMux.ServeHTTP(resp, req)
	next(resp, req)
}

func (r uiRouter) login(resp http.ResponseWriter, req *http.Request, p httprouter.Params) {
	r.HTML(resp, http.StatusOK, "user/login", nil)
}

func (r uiRouter) home(resp http.ResponseWriter, req *http.Request, p httprouter.Params) {
	r.HTML(resp, http.StatusOK, "home", nil)
}

func (r uiRouter) getRecipe(resp http.ResponseWriter, req *http.Request, p httprouter.Params) {
	r.HTML(resp, http.StatusOK, "recipe/view", nil)
}

func (r uiRouter) listRecipes(resp http.ResponseWriter, req *http.Request, p httprouter.Params) {
	r.HTML(resp, http.StatusOK, "recipe/list", nil)
}

func (r uiRouter) createRecipe(resp http.ResponseWriter, req *http.Request, p httprouter.Params) {
	r.HTML(resp, http.StatusOK, "recipe/edit", nil)
}

func (r uiRouter) editRecipe(resp http.ResponseWriter, req *http.Request, p httprouter.Params) {
	r.HTML(resp, http.StatusOK, "recipe/edit", nil)
}

func (r uiRouter) notFound(resp http.ResponseWriter, req *http.Request) {
	r.showError(resp, http.StatusNotFound)
}

func (r uiRouter) showError(resp http.ResponseWriter, status int) {
	r.HTML(resp, status, fmt.Sprintf("status/%d", status), nil)
}
