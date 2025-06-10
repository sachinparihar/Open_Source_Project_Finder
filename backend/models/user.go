package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	AzureID   string `gorm:"uniqueIndex"`
	Name      string
	Email     string `gorm:"uniqueIndex"`
	Bookmarks []Bookmark
}
