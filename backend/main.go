package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"sachinparihar/Open_Source_Project_Finder/config"
	"sachinparihar/Open_Source_Project_Finder/database"
	"sachinparihar/Open_Source_Project_Finder/routes"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	config.LoadEnv()
	database.InitMongoDB()

	r := mux.NewRouter()
	routes.RegisterRoutes(r)

	// CORS
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	server := &http.Server{
		Addr:    ":" + port,
		Handler: corsHandler,
	}

	// Graceful shutdown
	idleConnsClosed := make(chan struct{})
	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
		<-sig
		log.Println("Shutting down server...")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		server.Shutdown(ctx)
		close(idleConnsClosed)
	}()

	log.Printf("Server listening on :%s", port)
	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("Server error: %v", err)
	}
	<-idleConnsClosed
}
