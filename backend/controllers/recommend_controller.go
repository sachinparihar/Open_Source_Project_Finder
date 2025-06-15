package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"sachinparihar/Open_Source_Project_Finder/database"
	"sachinparihar/Open_Source_Project_Finder/models"
	"sachinparihar/Open_Source_Project_Finder/services"

	"go.mongodb.org/mongo-driver/bson"
)

type EnhancedRecommendation struct {
	models.Project
	Score      float64                 `json:"score"`
	Breakdown  services.ScoreBreakdown `json:"score_breakdown"`
	BookmarkID string                  `json:"bookmark_id,omitempty"`
	Reasoning  string                  `json:"reasoning"`
}

func RecommendHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, `{"error":"Invalid user profile"}`, http.StatusBadRequest)
		return
	}

	// Get user_id for bookmark status
	userID := r.URL.Query().Get("user_id")

	// Fetch projects from MongoDB with better filtering
	filter := bson.M{}

	// Filter by minimum quality criteria
	filter["stars"] = bson.M{"$gte": 5}                   // At least 5 stars
	filter["last_updated"] = bson.M{"$gte": "2023-01-01"} // Updated within last 2 years

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

	// Get enhanced recommendations
	recommendations := services.RecommendProjects(&user, projects)

	// Add bookmark status if user_id provided
	var enhancedRecommendations []EnhancedRecommendation

	// Get user's bookmarks if userID provided
	bookmarkMap := make(map[string]string)
	if userID != "" {
		bookmarkCursor, err := database.MongoDB.Collection("bookmarks").Find(
			context.Background(),
			bson.M{"user_id": userID},
		)
		if err == nil {
			defer bookmarkCursor.Close(context.Background())
			for bookmarkCursor.Next(context.Background()) {
				var bookmark models.Bookmark
				if err := bookmarkCursor.Decode(&bookmark); err == nil {
					bookmarkMap[bookmark.ProjectID] = bookmark.ID.Hex()
				}
			}
		}
	}

	// Create enhanced recommendations with reasoning
	for _, scored := range recommendations {
		reasoning := generateReasoning(scored.Breakdown, &user, &scored.Project)

		enhanced := EnhancedRecommendation{
			Project:   scored.Project,
			Score:     scored.TotalScore,
			Breakdown: scored.Breakdown,
			Reasoning: reasoning,
		}

		// Add bookmark status
		if bookmarkID, exists := bookmarkMap[scored.Project.ID]; exists {
			enhanced.BookmarkID = bookmarkID
		} else if bookmarkID, exists := bookmarkMap[scored.Project.URL]; exists {
			enhanced.BookmarkID = bookmarkID
		}

		enhancedRecommendations = append(enhancedRecommendations, enhanced)
	}

	json.NewEncoder(w).Encode(enhancedRecommendations)
}

func generateReasoning(breakdown services.ScoreBreakdown, user *models.User, project *models.Project) string {
	reasons := []string{}

	if breakdown.LanguageMatch > 50 {
		reasons = append(reasons, "matches your preferred programming languages")
	}
	if breakdown.TopicMatch > 50 {
		reasons = append(reasons, "aligns with your interests")
	}
	if breakdown.ExperienceMatch > 70 {
		reasons = append(reasons, "suitable for your experience level")
	}
	if breakdown.ActivityScore > 60 {
		reasons = append(reasons, "actively maintained")
	}
	if breakdown.CommunityScore > 70 {
		reasons = append(reasons, "has a strong community")
	}
	if breakdown.ContributorFriendly > 60 {
		reasons = append(reasons, "welcoming to new contributors")
	}
	if project.HasGoodFirstIssues {
		reasons = append(reasons, "has good first issues")
	}

	if len(reasons) == 0 {
		return "Recommended based on your profile"
	}

	result := "Recommended because it "
	for i, reason := range reasons {
		if i == len(reasons)-1 && len(reasons) > 1 {
			result += " and " + reason
		} else if i > 0 {
			result += ", " + reason
		} else {
			result += reason
		}
	}

	return result
}
