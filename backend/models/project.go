package models

type Project struct {
    ID              string   `bson:"_id,omitempty" json:"id"`
    Name            string   `bson:"name" json:"name"`
    Description     string   `bson:"description" json:"description"`
    URL             string   `bson:"url" json:"url"`
    Platform        string   `bson:"platform" json:"platform"`
    Owner           string   `bson:"owner" json:"owner"`
    
    // Enhanced metadata
    Languages       []string `bson:"languages" json:"languages"`
    PrimaryLanguage string   `bson:"primary_language" json:"primary_language"`
    Topics          []string `bson:"topics" json:"topics"`
    Stars           int      `bson:"stars" json:"stars"`
    Forks           int      `bson:"forks" json:"forks"`
    Issues          int      `bson:"open_issues" json:"open_issues"`
    
    // Project characteristics
    License         string   `bson:"license" json:"license"`
    Size            string   `bson:"size" json:"size"` // small, medium, large based on lines of code
    Difficulty      string   `bson:"difficulty" json:"difficulty"` // beginner, intermediate, advanced
    ActivityLevel   string   `bson:"activity_level" json:"activity_level"` // high, medium, low
    
    // Good first issue indicators
    HasGoodFirstIssues     bool     `bson:"has_good_first_issues" json:"has_good_first_issues"`
    GoodFirstIssueLabels   []string `bson:"good_first_issue_labels" json:"good_first_issue_labels"`
    ContributorFriendly    bool     `bson:"contributor_friendly" json:"contributor_friendly"`
    HasContributingGuide   bool     `bson:"has_contributing_guide" json:"has_contributing_guide"`
    HasCodeOfConduct       bool     `bson:"has_code_of_conduct" json:"has_code_of_conduct"`
    
    // Temporal data
    LastUpdated     string   `bson:"last_updated" json:"last_updated"`
    CreatedAt       string   `bson:"created_at" json:"created_at"`
    LastCommit      string   `bson:"last_commit" json:"last_commit"`
    
    // Community metrics
    Contributors    int      `bson:"contributors" json:"contributors"`
    RecentCommits   int      `bson:"recent_commits" json:"recent_commits"` // commits in last 30 days
    AvgIssueCloseTime int    `bson:"avg_issue_close_time" json:"avg_issue_close_time"` // in days
}