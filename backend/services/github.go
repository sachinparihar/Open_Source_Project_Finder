package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"sync"
	"time"

	"sachinparihar/Open_Source_Project_Finder/config"
	"sachinparihar/Open_Source_Project_Finder/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// SearchResult models the GitHub Search API response.
type SearchResult struct {
	Items []struct {
		Name        string `json:"name"`
		HTMLURL     string `json:"html_url"`
		Description string `json:"description"`
		Language    string `json:"language"`
		Stargazers  int    `json:"stargazers_count"`
		UpdatedAt   string `json:"updated_at"`
		Owner       struct {
			Login string `json:"login"`
		} `json:"owner"`
	} `json:"items"`
}

func FetchTrendingRepos(ctx context.Context, db *mongo.Database) error {
	client := &http.Client{Timeout: 15 * time.Second}
	coll := db.Collection("projects")

	for _, lang := range config.IndexLanguages {
		page := 1
		for {
			// build URL with proper encoding
			u := url.URL{
				Scheme: "https",
				Host:   "api.github.com",
				Path:   "/search/repositories",
			}
			q := u.Query()
			q.Set("q", fmt.Sprintf("stars:>100 language:%s", lang))
			q.Set("sort", "stars")
			q.Set("order", "desc")
			q.Set("per_page", "100")
			q.Set("page", strconv.Itoa(page))
			u.RawQuery = q.Encode()

			req, _ := http.NewRequestWithContext(ctx, "GET", u.String(), nil)
			req.Header.Set("Authorization", "token "+config.GithubToken)
			resp, err := client.Do(req)
			if err != nil {
				return err
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				body, _ := io.ReadAll(resp.Body)
				log.Printf("GitHub search error: %s\nURL: %s", string(body), u.String())
				return fmt.Errorf("search failed: %d", resp.StatusCode)
			}

			var sr SearchResult
			if err := json.NewDecoder(resp.Body).Decode(&sr); err != nil {
				return err
			}
			if len(sr.Items) == 0 {
				break
			}

			var writes []mongo.WriteModel
			for _, repo := range sr.Items {
				topics, langs := fetchMeta(ctx, client, repo.Owner.Login, repo.Name)
				proj := models.Project{
					Name:        repo.Name,
					Description: repo.Description,
					URL:         repo.HTMLURL,
					Platform:    "github",
					Languages:   langs,
					Topics:      topics,
					Stars:       repo.Stargazers,
					LastUpdated: repo.UpdatedAt,
				}
				filter := bson.M{"url": repo.HTMLURL}
				update := bson.M{"$set": proj}
				writes = append(writes,
					mongo.NewUpdateOneModel().
						SetFilter(filter).
						SetUpdate(update).
						SetUpsert(true),
				)
			}

			if _, err := coll.BulkWrite(ctx, writes, options.BulkWrite().SetOrdered(false)); err != nil {
				log.Printf("bulk upsert error for %s: %v", lang, err)
			}

			page++
			if remain := resp.Header.Get("X-RateLimit-Remaining"); remain == "0" {
				resetTs, _ := strconv.ParseInt(resp.Header.Get("X-RateLimit-Reset"), 10, 64)
				wait := time.Until(time.Unix(resetTs, 0))
				log.Printf("rate limit hit, sleeping %v", wait)
				time.Sleep(wait)
			}
		}
	}
	return nil
}

// fetchMeta concurrently fetches topics and languages.
func fetchMeta(ctx context.Context, client *http.Client, owner, repo string) ([]string, []string) {
	var (
		topics, langs []string
		wg            = &sync.WaitGroup{}
	)
	wg.Add(2)
	go func() {
		defer wg.Done()
		topics = fetchGitHubTopics(ctx, client, owner, repo)
	}()
	go func() {
		defer wg.Done()
		langs = fetchGitHubLanguages(ctx, client, owner, repo)
	}()
	wg.Wait()
	return topics, langs
}
