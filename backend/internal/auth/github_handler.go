package auth

import (
	"fmt"
	"net/http"
	"os"

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

// profileHandler shows a personal profile or a login button (unauthenticated)
func profileHandler(w http.ResponseWriter, req *http.Request) {
	session, err := sessions.Store.Get(req, sessions.SessionName)
	if err != nil || session == nil {
		// Show welcome page with login button
		page, _ := os.ReadFile("static/home.html")
		fmt.Fprint(w, string(page))
		return
	}

	// Authenticated user profile
	username := session.Get(sessions.SessionUsername)
	if username == nil {
		http.Redirect(w, req, "/github/login", http.StatusFound)
		return
	}
	fmt.Fprintf(w, `<p>You are logged in as %s!</p><form action="/logout" method="post"><input type="submit" value="Logout"></form>`, username)
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
			return
		}

		// Create and save the session
		session := sessions.Store.New(sessions.SessionName)
		session.Set(sessions.SessionUserKey, *githubUser.ID)
		session.Set(sessions.SessionUsername, *githubUser.Login)
		if err := session.Save(w); err != nil {
			http.Error(w, "Failed to save session", http.StatusInternalServerError)
			return
		}

		http.Redirect(w, req, "/profile", http.StatusFound)
	}
	return http.HandlerFunc(fn)
}
