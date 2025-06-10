package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"sachinparihar/Open_Source_Project_Finder/config"
	"sachinparihar/Open_Source_Project_Finder/routes"

	"github.com/gorilla/mux"
)

func main() {
	// Load environment variables and config
	err := config.LoadEnv()
	if err != nil {
		log.Fatalf("Error loading environment: %v", err)
	}

	// Initialize DB
	db := config.ConnectDatabase()
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	// Setup router
	r := mux.NewRouter()

	// Public routes (search etc.)
	routes.RegisterPublicRoutes(r)

	// Auth and protected routes
	protected := r.PathPrefix("/api").Subrouter()
	routes.RegisterAuthRoutes(protected)
	routes.RegisterProfileRoutes(protected)
	routes.RegisterBookmarkRoutes(protected)
	routes.RegisterRecommendationRoutes(protected)

	// Middleware: Add JWT verification
	protected.Use(config.JWTMiddleware)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	fmt.Printf("Server running at http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
