package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"sachinparihar/Open_Source_Project_Finder/database"
	"sachinparihar/Open_Source_Project_Finder/services"
)

type FetchRequest struct {
	Username string `json:"username"`
}

func FetchGitHubProjectsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var req FetchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Username == "" {
		http.Error(w, `{"error":"Missing or invalid username"}`, http.StatusBadRequest)
		return
	}
	log.Printf("Fetching GitHub projects for user/org: %s", req.Username)
	if err := services.FetchPublicGitHubProjects(context.Background(), req.Username, database.MongoDB); err != nil {
		log.Printf("Failed to fetch projects: %v", err)
		http.Error(w, `{"error":"Failed to fetch projects"}`, http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "User repos fetched"})
}
