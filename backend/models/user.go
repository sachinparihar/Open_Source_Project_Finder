package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
    ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Auth0ID           string             `bson:"auth0_id" json:"auth0_id"`
    Name              string             `bson:"name" json:"name"`
    Email             string             `bson:"email" json:"email"`
    GitHubUsername    string             `bson:"github_username" json:"github_username"`
    
    // Enhanced preference fields
    Languages         []string           `bson:"languages" json:"languages"`           // Primary languages
    Topics            []string           `bson:"topics" json:"topics"`                 // Interests/topics
    ExperienceLevel   string             `bson:"experience_level" json:"experience_level"` // beginner, intermediate, advanced
    ContributionType  []string           `bson:"contribution_type" json:"contribution_type"` // documentation, bug-fixes, features, translations
    ProjectSize       string             `bson:"project_size" json:"project_size"`     // small, medium, large
    MinStars          int                `bson:"min_stars" json:"min_stars"`           // Minimum stars preference
    PreferredLicense  []string           `bson:"preferred_license" json:"preferred_license"` // MIT, Apache, GPL, etc.
    
    // Behavioral data
    BookmarkedProjects []string          `bson:"bookmarked_projects" json:"bookmarked_projects"`
    ViewedProjects     []string          `bson:"viewed_projects" json:"viewed_projects"`
    SearchHistory      []string          `bson:"search_history" json:"search_history"`
    
    CreatedAt         string             `bson:"created_at" json:"created_at"`
    UpdatedAt         string             `bson:"updated_at" json:"updated_at"`
}