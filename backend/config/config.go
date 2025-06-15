package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

var (
	GithubToken    string
	IndexLanguages []string
	IndexTopics    []string
)

func LoadEnv() {
	// load .env into environment
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env")
	}
	// required GitHub token
	GithubToken = os.Getenv("GITHUB_TOKEN")
	if GithubToken == "" {
		log.Fatal("GITHUB_TOKEN is required")
	}
	// languages to index
	langs := os.Getenv("INDEX_LANGUAGES")
	if langs == "" {
		langs = "Go,Python,JavaScript"
	}
	IndexLanguages = splitAndTrim(langs)
	// topics to index
	topics := os.Getenv("INDEX_TOPICS")
	if topics == "" {
		topics = "cloud,web,cli"
	}
	IndexTopics = splitAndTrim(topics)
}

func splitAndTrim(s string) []string {
	parts := strings.Split(s, ",")
	var out []string
	for _, p := range parts {
		if t := strings.TrimSpace(p); t != "" {
			out = append(out, t)
		}
	}
	return out
}
