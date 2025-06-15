package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"sachinparihar/Open_Source_Project_Finder/database"
	"sachinparihar/Open_Source_Project_Finder/services"
)

func SyncTrendingHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	log.Println("Starting GitHub trending sync")
	if err := services.FetchTrendingRepos(context.Background(), database.MongoDB); err != nil {
		log.Printf("Sync error: %v", err)
		http.Error(w, `{"error":"Sync failed"}`, http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "Trending repos synced"})
}
