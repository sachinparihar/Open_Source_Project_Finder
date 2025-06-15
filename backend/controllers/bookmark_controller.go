package controllers

import (
	"context"
	"encoding/json"
	"net/http"

	"sachinparihar/Open_Source_Project_Finder/database"
	"sachinparihar/Open_Source_Project_Finder/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddBookmark(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	coll := database.MongoDB.Collection("bookmarks")

	var bm models.Bookmark
	if err := json.NewDecoder(r.Body).Decode(&bm); err != nil {
		http.Error(w, `{"error":"invalid payload"}`, http.StatusBadRequest)
		return
	}
	bm.ID = primitive.NewObjectID()

	// Check if bookmark already exists
	existingCount, _ := coll.CountDocuments(context.Background(), bson.M{
		"user_id":    bm.UserID,
		"project_id": bm.ProjectID,
	})

	if existingCount > 0 {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"bookmark already exists"}`))
		return
	}

	if _, err := coll.InsertOne(context.Background(), bm); err != nil {
		http.Error(w, `{"error":"could not add bookmark"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":     "bookmark added",
		"bookmark_id": bm.ID.Hex(),
	})
}

func GetBookmarks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userID := r.URL.Query().Get("user_id")

	if userID == "" {
		http.Error(w, `{"error":"user_id is required"}`, http.StatusBadRequest)
		return
	}

	coll := database.MongoDB.Collection("bookmarks")

	cursor, err := coll.Find(context.Background(), bson.M{"user_id": userID})
	if err != nil {
		http.Error(w, `{"error":"could not retrieve bookmarks"}`, http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var bms []models.Bookmark
	if err := cursor.All(context.Background(), &bms); err != nil {
		http.Error(w, `{"error":"decoding failed"}`, http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(bms)
}

func RemoveBookmark(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	userID := r.URL.Query().Get("user_id")
	projID := r.URL.Query().Get("project_id")

	if userID == "" || projID == "" {
		http.Error(w, `{"error":"user_id and project_id are required"}`, http.StatusBadRequest)
		return
	}

	coll := database.MongoDB.Collection("bookmarks")

	result, err := coll.DeleteOne(context.Background(), bson.M{
		"user_id":    userID,
		"project_id": projID,
	})

	if err != nil {
		http.Error(w, `{"error":"could not delete bookmark"}`, http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, `{"error":"bookmark not found"}`, http.StatusNotFound)
		return
	}

	w.Write([]byte(`{"message":"bookmark removed"}`))
}
