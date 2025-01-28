package auth

import (
	"net/http"

	"github.com/sachinparihar/Open_Source_Project_Finder/config"
)

func NewRouter(cfg *config.Config) *http.ServeMux {
	mux := http.NewServeMux()

	// GitHub routes
	RegisterGitHubRoutes(mux, cfg)

	// Google routes
	RegisterGoogleRoutes(mux, cfg)

	// Default routes
	mux.HandleFunc("/", profileHandler)
	mux.HandleFunc("/logout", logoutHandler)

	return mux
}
