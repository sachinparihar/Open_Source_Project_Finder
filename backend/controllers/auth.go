package controllers

import (
	"encoding/json"
	"net/http"
)

type AuthResponse struct {
	Message string `json:"message"`
	Token   string `json:"token,omitempty"` // If you plan to issue a custom token
}

func AzureLogin(w http.ResponseWriter, r *http.Request) {
	// Frontend handles Azure AD login; backend validates token via middleware
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(AuthResponse{Message: "Azure AD token verified"})
}
