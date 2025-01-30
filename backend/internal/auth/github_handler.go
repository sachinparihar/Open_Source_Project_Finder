package auth

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dghubble/gologin/v2"
	"github.com/dghubble/gologin/v2/github"
	"github.com/sachinparihar/Open_Source_Project_Finder/config"
	"github.com/sachinparihar/Open_Source_Project_Finder/sessions"
	"golang.org/x/oauth2"
	githubOAuth2 "golang.org/x/oauth2/github"
)

// RegisterGitHubRoutes registers the GitHub login and callback routes
func RegisterGitHubRoutes(mux *http.ServeMux, cfg *config.Config) {
	oauth2Config := &oauth2.Config{
		ClientID:     cfg.GithubClientID,
		ClientSecret: cfg.GithubClientSecret,
		RedirectURL:  "http://localhost:8080/github/callback",
		Endpoint:     githubOAuth2.Endpoint,
	}

	stateConfig := gologin.DebugOnlyCookieConfig
	mux.Handle("/github/login", github.StateHandler(stateConfig, github.LoginHandler(oauth2Config, nil)))
	mux.Handle("/github/callback", github.StateHandler(stateConfig, github.CallbackHandler(oauth2Config, issueGitHubSession(), nil)))
}

// githubProfileHandler shows a personal profile or a login button (unauthenticated)
func profileHandler(w http.ResponseWriter, req *http.Request) {
	session, err := sessions.Store.Get(req, "example-github-app")
	if err != nil || session == nil {
		log.Printf("Error retrieving session: %v", err)
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}

	username := session.Get("username")
	if username == nil {
		log.Printf("No username in session")
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}

	fmt.Fprintf(w, `{"username": "%s"}`, username)
}

// logoutHandler destroys the session on POSTs and redirects to the home page
func logoutHandler(w http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodPost {
		sessions.Store.Destroy(w, sessions.SessionName)
	}
	http.Redirect(w, req, "/", http.StatusFound)
}

// issueGitHubSession creates a session after a successful GitHub login
func issueGitHubSession() http.Handler {
	fn := func(w http.ResponseWriter, req *http.Request) {
		ctx := req.Context()
		githubUser, err := github.UserFromContext(ctx)
		if err != nil {
			http.Error(w, "Failed to get user from GitHub", http.StatusInternalServerError)
			log.Printf("Error getting user from GitHub: %v", err)
			return
		}

		// Create and save the session
		session := sessions.Store.New("example-github-app")
		session.Set("githubID", *githubUser.ID)
		session.Set("username", *githubUser.Login)
		if err := session.Save(w); err != nil {
			http.Error(w, "Failed to save session", http.StatusInternalServerError)
			log.Printf("Error saving session: %v", err)
			return
		}

		// Log session details for debugging
		log.Printf("Session saved: %v", session)

		// Redirect to the frontend root URL
		http.Redirect(w, req, "http://localhost:5173/", http.StatusFound)
		log.Printf("Redirecting to frontend: http://localhost:5173/")
	}
	return http.HandlerFunc(fn)
}
