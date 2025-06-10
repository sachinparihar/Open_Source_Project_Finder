package models

import "gorm.io/gorm"

type Project struct {
	gorm.Model
	Title       string
	Description string
	RepoURL     string
	Tags        string
}
