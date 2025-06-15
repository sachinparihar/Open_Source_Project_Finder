package database

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client
var MongoDB *mongo.Database

func InitMongoDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	uri := os.Getenv("DATABASE_URL")
	if uri == "" {
		log.Fatal("DATABASE_URL is required")
	}
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("MongoDB connection error: %v", err)
	}
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("MongoDB ping error: %v", err)
	}
	dbName := os.Getenv("DATABASE_NAME")
	if dbName == "" {
		dbName = "open_source_finder"
	}
	MongoClient = client
	MongoDB = client.Database(dbName)
	log.Println("MongoDB connected:", dbName)

	// ensure indexes
	coll := MongoDB.Collection("projects")
	coll.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys: bson.D{{Key: "name", Value: "text"}, {Key: "description", Value: "text"}},
	})
	coll.Indexes().CreateOne(ctx, mongo.IndexModel{Keys: bson.D{{Key: "languages", Value: 1}}})
	coll.Indexes().CreateOne(ctx, mongo.IndexModel{Keys: bson.D{{Key: "topics", Value: 1}}})
	coll.Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "url", Value: 1}},
		Options: options.Index().SetUnique(true),
	})
}
