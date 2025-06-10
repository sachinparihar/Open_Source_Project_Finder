package database

import (
    "context"
    "crypto/tls"
    "log"
    "os"
    "time"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func ConnectDatabase() {
    uri := os.Getenv("DATABASE_URL")
    if uri == "" {
        log.Fatal("DATABASE_URL environment variable not set")
    }

    clientOpts := options.Client().ApplyURI(uri).SetTLSConfig(&tls.Config{
        MinVersion: tls.VersionTLS12,
    })

    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    client, err := mongo.Connect(ctx, clientOpts)
    if err != nil {
        log.Fatal("Failed to connect to MongoDB: ", err)
    }

    if err := client.Ping(ctx, nil); err != nil {
        log.Fatal("Failed to ping MongoDB: ", err)
    }

    log.Println("MongoDB connected")
    MongoClient = client
}