package services

import (
	"fmt"
	"net/http"
	"strings"
)

// ExtractBearerToken extracts the Bearer token from the Authorization header.
// Returns the token string or an error if not found.
func ExtractBearerToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		return "", fmt.Errorf("no Bearer token found")
	}
	return strings.TrimPrefix(authHeader, "Bearer "), nil
}
