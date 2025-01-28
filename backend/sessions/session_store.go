package sessions

import (
	"github.com/dghubble/sessions"
)

const (
	SessionName     = "open-source-app"
	SessionSecret   = "your-secure-cookie-secret"
	SessionUserKey  = "userID"
	SessionUsername = "username"
)

var Store = sessions.NewCookieStore[any](sessions.DebugCookieConfig, []byte(SessionSecret), nil)
