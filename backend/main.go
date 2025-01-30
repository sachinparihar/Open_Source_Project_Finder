package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/sachinparihar/Open_Source_Project_Finder/config"
	"github.com/sachinparihar/Open_Source_Project_Finder/internal/auth"
)

const address = "localhost:8080"

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	config := &config.Config{
		GithubClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		GithubClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
	}

	clientID := flag.String("google-client-id", "", "Google Client ID")
	clientSecret := flag.String("google-client-secret", "", "Google Client Secret")
	flag.Parse()

	if *clientID != "" {
		config.GoogleClientID = *clientID
	}
	if *clientSecret != "" {
		config.GoogleClientSecret = *clientSecret
	}

	if config.GithubClientID == "" || config.GithubClientSecret == "" ||
		config.GoogleClientID == "" || config.GoogleClientSecret == "" {
		log.Fatal("Missing OAuth credentials for GitHub or Google")
	}

	log.Printf("Server running on %s\n", address)
	err = http.ListenAndServe(address, auth.NewServer(config))
	if err != nil {
		log.Fatal("Error starting server:", err)
	}
}
