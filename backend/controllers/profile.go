package controllers

import (
	"encoding/json"
	"net/http"
)

type UserProfile struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Skills   string `json:"skills"`
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	user := UserProfile{
		ID:       "user123",
		Username: "sachin",
		Skills:   "Go, Kubernetes, DevOps",
	}
	json.NewEncoder(w).Encode(user)
}

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	// Parse JSON and simulate update
	var user UserProfile
	json.NewDecoder(r.Body).Decode(&user)

	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated"})
}

