package config

import (
	"github.com/joho/godotenv"
	"log"
)

func LoadEnv() error {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Warning: .env file not found, relying on environment variables")
	}
	return nil
}
