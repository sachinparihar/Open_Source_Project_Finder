package services

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"sachinparihar/Open_Source_Project_Finder/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// FetchPublicGitHubProjects fetches all public repos for a user/org and upserts them.
func FetchPublicGitHubProjects(ctx context.Context, username string, db *mongo.Database) error {
	client := &http.Client{Timeout: 15 * time.Second}
	coll := db.Collection("projects")
	page := 1

	for {
		url := fmt.Sprintf("https://api.github.com/users/%s/repos?per_page=100&page=%d", username, page)
		req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
		if err != nil {
			return err
		}
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			return fmt.Errorf("fetch repos failed: status %d", resp.StatusCode)
		}

		var repos []struct {
			Name        string `json:"name"`
			HTMLURL     string `json:"html_url"`
			Description string `json:"description"`
			Language    string `json:"language"`
			Stargazers  int    `json:"stargazers_count"`
			UpdatedAt   string `json:"updated_at"`
			Owner       struct {
				Login string `json:"login"`
			} `json:"owner"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&repos); err != nil {
			return err
		}
		if len(repos) == 0 {
			break
		}

		for _, r := range repos {
			topics := fetchGitHubTopics(ctx, client, r.Owner.Login, r.Name)
			langs := fetchGitHubLanguages(ctx, client, r.Owner.Login, r.Name)
			proj := models.Project{
				Name:        r.Name,
				Description: r.Description,
				URL:         r.HTMLURL,
				Platform:    "github",
				Languages:   langs,
				Topics:      topics,
				Stars:       r.Stargazers,
				LastUpdated: r.UpdatedAt,
			}
			filter := bson.M{"url": r.HTMLURL}
			update := bson.M{"$set": proj}
			_, err := coll.UpdateOne(ctx, filter, update, options.Update().SetUpsert(true))
			if err != nil {
				return err
			}
		}
		page++
	}
	return nil
}

func fetchGitHubTopics(ctx context.Context, client *http.Client, owner, repo string) []string {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/topics", owner, repo)
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	req.Header.Set("Accept", "application/vnd.github.mercy-preview+json")
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		if resp != nil {
			resp.Body.Close()
		}
		return nil
	}
	defer resp.Body.Close()
	var data struct {
		Names []string `json:"names"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil
	}
	return data.Names
}

func fetchGitHubLanguages(ctx context.Context, client *http.Client, owner, repo string) []string {
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/languages", owner, repo)
	req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		if resp != nil {
			resp.Body.Close()
		}
		return nil
	}
	defer resp.Body.Close()
	var langMap map[string]int
	if err := json.NewDecoder(resp.Body).Decode(&langMap); err != nil {
		return nil
	}
	langs := make([]string, 0, len(langMap))
	for lang := range langMap {
		langs = append(langs, lang)
	}
	return langs
}
