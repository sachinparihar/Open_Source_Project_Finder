package auth

import (
    "net/http"
    "path/filepath"

    "github.com/sachinparihar/Open_Source_Project_Finder/config"
)

func NewRouter(cfg *config.Config) *http.ServeMux {
    mux := http.NewServeMux()

    // GitHub routes
    RegisterGitHubRoutes(mux, cfg)

    // Google routes
    RegisterGoogleRoutes(mux, cfg)

    // Default routes
    mux.HandleFunc("/profile", profileHandler)
    mux.HandleFunc("/logout", logoutHandler)

    // Serve static files
    mux.Handle("/", http.FileServer(http.Dir(filepath.Join("frontend", "build"))))

    return mux
}

func NewServer(cfg *config.Config) http.Handler {
    router := NewRouter(cfg)
    return CORS(router)
}