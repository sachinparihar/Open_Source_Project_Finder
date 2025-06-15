package routes

import (
	"sachinparihar/Open_Source_Project_Finder/controllers"

	"github.com/gorilla/mux"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/projects", controllers.SearchProjectsHandler).Methods("GET")
	r.HandleFunc("/api/recommend", controllers.RecommendHandler).Methods("POST")
	r.HandleFunc("/api/github/fetch", controllers.FetchGitHubProjectsHandler).Methods("POST")
	r.HandleFunc("/api/github/sync", controllers.SyncTrendingHandler).Methods("POST")

	// Fixed bookmark routes
	r.HandleFunc("/api/bookmarks", controllers.GetBookmarks).Methods("GET")
	r.HandleFunc("/api/bookmarks", controllers.AddBookmark).Methods("POST")
	r.HandleFunc("/api/bookmarks", controllers.RemoveBookmark).Methods("DELETE")
}
