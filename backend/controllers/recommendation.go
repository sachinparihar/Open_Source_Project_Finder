package controllers

import (
	"encoding/json"
	"net/http"
)

// GetRecommendations handles GET /projects/recommend requests
func GetRecommendations(w http.ResponseWriter, r *http.Request) {
	// Example static recommendations; replace with real logic as needed
	recommendations := []string{"kubernetes", "azure-sdk-for-go", "prometheus"}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(recommendations)
}
