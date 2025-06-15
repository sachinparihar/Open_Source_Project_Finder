package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Bookmark struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    string             `bson:"user_id" json:"user_id"`
	ProjectID string             `bson:"project_id" json:"project_id"`
	Project   Project            `bson:"project" json:"project"`
}
