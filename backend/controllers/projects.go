package controllers

import (
	"encoding/json"
	"net/http"
)

type Project struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	URL         string `json:"url"`
	Description string `json:"description"`
}

func GetPublicProjects(w http.ResponseWriter, r *http.Request) {
	// This would call the GitHub/GitLab API integration (services layer)
	sample := []Project{
		{ID: "1", Name: "Kubernetes", URL: "https://github.com/kubernetes/kubernetes", Description: "Container orchestration system"},
		{ID: "2", Name: "Karmada", URL: "https://github.com/karmada-io/karmada", Description: "Multi-cluster Kubernetes controller"},
	}
	json.NewEncoder(w).Encode(sample)
}
