package auth

import (
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
			return
		}

		session := sessionStore.New("example-google-app")
		session.Set("googleID", user.Id)
		session.Set("email", user.Email)
		err = session.Save(w)
		if err != nil {
			http.Error(w, "Failed to save session", http.StatusInternalServerError)
			return
		}
		http.Redirect(w, req, "/", http.StatusFound)
	}
	return http.HandlerFunc(fn)
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
}
