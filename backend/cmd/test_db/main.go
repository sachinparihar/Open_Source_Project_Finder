package main

import (
	"context"
	"log"
	"os"
	"time"

	"sachinparihar/Open_Source_Project_Finder/config"
	"sachinparihar/Open_Source_Project_Finder/database"

	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	// Load environment variables
	config.LoadEnv()

	// Initialize database connection
	database.InitMongoDB()

	// Test connection by inserting a test document
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Test collection
	testColl := database.MongoDB.Collection("test_connection")

	// Insert a test document
	testDoc := bson.M{
		"message":   "Database connection successful",
		"timestamp": time.Now(),
		"test":      true,
	}

	_, err := testColl.InsertOne(ctx, testDoc)
	if err != nil {
		log.Fatalf("Failed to insert test document: %v", err)
	}

	log.Println("✅ Database connection test successful!")
	log.Printf("Connected to database: %s", os.Getenv("DATABASE_NAME"))

	// Clean up test document
	testColl.DeleteOne(ctx, bson.M{"test": true})
	log.Println("✅ Test document cleaned up")
}
