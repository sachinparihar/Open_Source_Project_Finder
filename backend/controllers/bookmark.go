package controllers

import (
	"encoding/json"
	"net/http"
)

type Bookmark struct {
	UserID    string `json:"user_id"`
	ProjectID string `json:"project_id"`
}

func SaveBookmark(w http.ResponseWriter, r *http.Request) {
	var bm Bookmark
	json.NewDecoder(r.Body).Decode(&bm)
	json.NewEncoder(w).Encode(map[string]string{"message": "Project bookmarked"})
}

func GetBookmarks(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "Missing user_id", http.StatusBadRequest)
		return
	}

	// Sample response
	bookmarked := []string{"kubernetes", "karmada"}
	json.NewEncoder(w).Encode(bookmarked)
}
