package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"sachinparihar/Open_Source_Project_Finder/database"
	"sachinparihar/Open_Source_Project_Finder/models"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
)

// ProjectWithBookmark extends Project with bookmark information
type ProjectWithBookmark struct {
	models.Project
	BookmarkID string `json:"bookmark_id,omitempty"`
}

func SearchProjectsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	query := strings.TrimSpace(r.URL.Query().Get("q"))
	language := strings.TrimSpace(r.URL.Query().Get("language"))
	topic := strings.TrimSpace(r.URL.Query().Get("topic"))
	userID := strings.TrimSpace(r.URL.Query().Get("user_id")) // Add user_id parameter

	filter := bson.M{}
	var orFilters []bson.M

	if query != "" {
		orFilters = append(orFilters,
			bson.M{"name": bson.M{"$regex": query, "$options": "i"}},
			bson.M{"description": bson.M{"$regex": query, "$options": "i"}},
		)
	}
	if len(orFilters) > 0 {
		filter["$or"] = orFilters
	}
	if language != "" {
		filter["languages"] = bson.M{
			"$elemMatch": bson.M{
				"$regex":   language,
				"$options": "i",
			},
		}
	}
	if topic != "" {
		filter["topics"] = bson.M{
			"$elemMatch": bson.M{
				"$regex":   topic,
				"$options": "i",
			},
		}
	}

	cursor, err := database.MongoDB.Collection("projects").Find(context.Background(), filter)
	if err != nil {
		http.Error(w, `{"error":"Failed to fetch projects"}`, http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var projects []models.Project
	for cursor.Next(context.Background()) {
		var project models.Project
		if err := cursor.Decode(&project); err == nil {
			projects = append(projects, project)
		}
	}

	// If user_id is provided, check bookmark status for each project
	if userID != "" {
		var projectsWithBookmarks []ProjectWithBookmark

		// Get user's bookmarks
		bookmarkCursor, err := database.MongoDB.Collection("bookmarks").Find(
			context.Background(),
			bson.M{"user_id": userID},
		)
		if err == nil {
			defer bookmarkCursor.Close(context.Background())

			// Create a map of bookmarked projects
			bookmarkMap := make(map[string]string) // project_id -> bookmark_id
			for bookmarkCursor.Next(context.Background()) {
				var bookmark models.Bookmark
				if err := bookmarkCursor.Decode(&bookmark); err == nil {
					bookmarkMap[bookmark.ProjectID] = bookmark.ID.Hex()
				}
			}

			// Add bookmark info to projects
			for _, project := range projects {
				projectWithBookmark := ProjectWithBookmark{
					Project: project,
				}
				// Check if project is bookmarked (using project.ID or project.URL)
				if bookmarkID, exists := bookmarkMap[project.ID]; exists {
					projectWithBookmark.BookmarkID = bookmarkID
				} else if bookmarkID, exists := bookmarkMap[project.URL]; exists {
					projectWithBookmark.BookmarkID = bookmarkID
				}
				projectsWithBookmarks = append(projectsWithBookmarks, projectWithBookmark)
			}

			json.NewEncoder(w).Encode(projectsWithBookmarks)
			return
		}
	}

	// Fallback: return projects without bookmark info
	json.NewEncoder(w).Encode(projects)
}
