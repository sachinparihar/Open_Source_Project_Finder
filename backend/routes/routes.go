package routes

import (
	"sachinparihar/Open_Source_Project_Finder/controllers"

	"github.com/gorilla/mux"
)

// Register all public routes (accessible without login)
func RegisterPublicRoutes(r *mux.Router) {
	r.HandleFunc("/api/projects", controllers.GetPublicProjects).Methods("GET")
}

// Register auth-related routes (if any custom auth endpoints needed)
func RegisterAuthRoutes(r *mux.Router) {
	// For Azure AD based auth, usually handled via middleware, so no routes here for now
}

// Register user profile management routes (requires auth)
func RegisterProfileRoutes(r *mux.Router) {
	r.HandleFunc("/profile", controllers.GetProfile).Methods("GET")
	r.HandleFunc("/profile", controllers.UpdateProfile).Methods("PUT")
}

// Register project bookmark routes (requires auth)
func RegisterBookmarkRoutes(r *mux.Router) {
	r.HandleFunc("/projects/bookmark", controllers.SaveBookmark).Methods("POST")
	r.HandleFunc("/projects/bookmarks", controllers.GetBookmarks).Methods("GET")
}

// Register AI recommendation routes (requires auth)
func RegisterRecommendationRoutes(r *mux.Router) {
	r.HandleFunc("/projects/recommend", controllers.GetRecommendations).Methods("GET")
}
