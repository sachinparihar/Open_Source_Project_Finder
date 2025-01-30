package auth

import (
	"fmt"
	"log"
	"net/http"

	"github.com/dghubble/gologin/v2"
	"github.com/dghubble/gologin/v2/google"
	"github.com/dghubble/sessions"
	"github.com/sachinparihar/Open_Source_Project_Finder/config"
	"golang.org/x/oauth2"
	googleOAuth2 "golang.org/x/oauth2/google"
)

// Session Store
var sessionStore = sessions.NewCookieStore[any](
	&sessions.CookieConfig{
		Path:     "/",
		HTTPOnly: true,
		Secure:   false, // Change to `true` in production (requires HTTPS)
	},
	[]byte("your-secure-cookie-secret"), // Replace with a strong secret key
	nil,
)

// Issue session after successful login
func issueSession() http.Handler {
	fn := func(w http.ResponseWriter, req *http.Request) {
		ctx := req.Context()
		user, err := google.UserFromContext(ctx)
		if err != nil {
			http.Error(w, "Failed to get user from Google", http.StatusInternalServerError)
			log.Printf("Error getting user from Google: %v", err)
			return
		}

		session := sessionStore.New("example-google-app")
		session.Set("googleID", user.Id)
		session.Set("email", user.Email)
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

// googleProfileHandler shows a personal profile or a login button (unauthenticated)
func googleProfileHandler(w http.ResponseWriter, req *http.Request) {
	session, err := sessionStore.Get(req, "example-google-app")
	if err != nil || session == nil {
		log.Printf("Error retrieving session: %v", err)
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}

	email := session.Get("email")
	if email == nil {
		log.Printf("No email in session")
		http.Error(w, "Not authenticated", http.StatusUnauthorized)
		return
	}

	fmt.Fprintf(w, `{"email": "%s"}`, email)
}

// Register Google Routes
func RegisterGoogleRoutes(mux *http.ServeMux, cfg *config.Config) {
	oauth2Config := &oauth2.Config{
		ClientID:     cfg.GoogleClientID,
		ClientSecret: cfg.GoogleClientSecret,
		RedirectURL:  "http://localhost:8080/google/callback",
		Endpoint:     googleOAuth2.Endpoint,
		Scopes:       []string{"profile", "email"},
	}

	stateConfig := gologin.DebugOnlyCookieConfig
	mux.Handle("/google/login", google.StateHandler(stateConfig, google.LoginHandler(oauth2Config, nil)))
	mux.Handle("/google/callback", google.StateHandler(stateConfig, google.CallbackHandler(oauth2Config, issueSession(), nil)))
	mux.HandleFunc("/google/profile", googleProfileHandler)
}
