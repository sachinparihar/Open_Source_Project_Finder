package services

import (
    "math"
    "sachinparihar/Open_Source_Project_Finder/models"
    "sort"
    "strings"
    "time"
)

type ProjectScore struct {
    Project     models.Project
    TotalScore  float64
    Breakdown   ScoreBreakdown
}

type ScoreBreakdown struct {
    LanguageMatch      float64 `json:"language_match"`
    TopicMatch         float64 `json:"topic_match"`
    ExperienceMatch    float64 `json:"experience_match"`
    ActivityScore      float64 `json:"activity_score"`
    CommunityScore     float64 `json:"community_score"`
    PersonalizationScore float64 `json:"personalization_score"`
    TrendingBonus      float64 `json:"trending_bonus"`
    ContributorFriendly float64 `json:"contributor_friendly"`
}

// Enhanced scoring algorithm
func ScoreProject(user *models.User, project *models.Project) (float64, ScoreBreakdown) {
    var breakdown ScoreBreakdown
    
    // 1. Language Match (25% weight)
    breakdown.LanguageMatch = calculateLanguageMatch(user, project) * 0.25
    
    // 2. Topic Match (20% weight)
    breakdown.TopicMatch = calculateTopicMatch(user, project) * 0.20
    
    // 3. Experience Level Match (15% weight)
    breakdown.ExperienceMatch = calculateExperienceMatch(user, project) * 0.15
    
    // 4. Project Activity (15% weight)
    breakdown.ActivityScore = calculateActivityScore(project) * 0.15
    
    // 5. Community Health (10% weight)
    breakdown.CommunityScore = calculateCommunityScore(project) * 0.10
    
    // 6. Personalization (10% weight)
    breakdown.PersonalizationScore = calculatePersonalizationScore(user, project) * 0.10
    
    // 7. Trending/Popularity Bonus (3% weight)
    breakdown.TrendingBonus = calculateTrendingBonus(project) * 0.03
    
    // 8. Contributor Friendliness (2% weight)
    breakdown.ContributorFriendly = calculateContributorFriendliness(project) * 0.02
    
    totalScore := breakdown.LanguageMatch + breakdown.TopicMatch + 
        breakdown.ExperienceMatch + breakdown.ActivityScore + 
        breakdown.CommunityScore + breakdown.PersonalizationScore + 
        breakdown.TrendingBonus + breakdown.ContributorFriendly
    
    return totalScore, breakdown
}

func calculateLanguageMatch(user *models.User, project *models.Project) float64 {
    if len(user.Languages) == 0 || len(project.Languages) == 0 {
        return 0.0
    }
    
    userLangMap := make(map[string]bool)
    for _, lang := range user.Languages {
        userLangMap[strings.ToLower(strings.TrimSpace(lang))] = true
    }
    
    matches := 0
    primaryLangBonus := 0.0
    
    for _, projLang := range project.Languages {
        cleanLang := strings.ToLower(strings.TrimSpace(projLang))
        if userLangMap[cleanLang] {
            matches++
            // Give extra points if it matches the primary language
            if cleanLang == strings.ToLower(project.PrimaryLanguage) {
                primaryLangBonus = 30.0
            }
        }
    }
    
    baseScore := float64(matches) / float64(len(user.Languages)) * 70.0
    return math.Min(100.0, baseScore + primaryLangBonus)
}

func calculateTopicMatch(user *models.User, project *models.Project) float64 {
    if len(user.Topics) == 0 || len(project.Topics) == 0 {
        return 0.0
    }
    
    userTopicMap := make(map[string]bool)
    for _, topic := range user.Topics {
        userTopicMap[strings.ToLower(strings.TrimSpace(topic))] = true
    }
    
    matches := 0
    for _, projTopic := range project.Topics {
        if userTopicMap[strings.ToLower(strings.TrimSpace(projTopic))] {
            matches++
        }
    }
    
    return float64(matches) / float64(len(user.Topics)) * 100.0
}

func calculateExperienceMatch(user *models.User, project *models.Project) float64 {
    experienceMap := map[string]int{
        "beginner":     1,
        "intermediate": 2,
        "advanced":     3,
    }
    
    userLevel := experienceMap[user.ExperienceLevel]
    projectLevel := experienceMap[project.Difficulty]
    
    if userLevel == 0 || projectLevel == 0 {
        return 50.0 // neutral score if unknown
    }
    
    diff := math.Abs(float64(userLevel - projectLevel))
    
    switch diff {
    case 0:
        return 100.0 // perfect match
    case 1:
        return 70.0  // close match
    case 2:
        return 30.0  // far match
    default:
        return 10.0
    }
}

func calculateActivityScore(project *models.Project) float64 {
    score := 0.0
    
    // Recent activity (last 30 days commits)
    if project.RecentCommits > 10 {
        score += 40.0
    } else if project.RecentCommits > 5 {
        score += 25.0
    } else if project.RecentCommits > 0 {
        score += 10.0
    }
    
    // Last updated (within last 3 months)
    if lastUpdated, err := time.Parse(time.RFC3339, project.LastUpdated); err == nil {
        daysSince := time.Since(lastUpdated).Hours() / 24
        if daysSince <= 30 {
            score += 30.0
        } else if daysSince <= 90 {
            score += 20.0
        } else if daysSince <= 180 {
            score += 10.0
        }
    }
    
    // Issue resolution time
    if project.AvgIssueCloseTime > 0 {
        if project.AvgIssueCloseTime <= 7 {
            score += 30.0
        } else if project.AvgIssueCloseTime <= 30 {
            score += 20.0
        } else if project.AvgIssueCloseTime <= 90 {
            score += 10.0
        }
    }
    
    return math.Min(100.0, score)
}

func calculateCommunityScore(project *models.Project) float64 {
    score := 0.0
    
    // Stars (popularity indicator)
    if project.Stars >= 10000 {
        score += 30.0
    } else if project.Stars >= 1000 {
        score += 25.0
    } else if project.Stars >= 100 {
        score += 20.0
    } else if project.Stars >= 10 {
        score += 10.0
    }
    
    // Contributors (community size)
    if project.Contributors >= 100 {
        score += 25.0
    } else if project.Contributors >= 50 {
        score += 20.0
    } else if project.Contributors >= 10 {
        score += 15.0
    } else if project.Contributors >= 5 {
        score += 10.0
    }
    
    // Fork ratio (engagement)
    if project.Stars > 0 {
        forkRatio := float64(project.Forks) / float64(project.Stars)
        if forkRatio >= 0.1 {
            score += 20.0
        } else if forkRatio >= 0.05 {
            score += 15.0
        } else if forkRatio >= 0.02 {
            score += 10.0
        }
    }
    
    // Issue management
    if project.Issues > 0 {
        if project.Issues < 50 {
            score += 15.0 // manageable issues
        } else if project.Issues < 200 {
            score += 10.0
        }
    }
    
    // Project governance
    if project.HasCodeOfConduct {
        score += 5.0
    }
    if project.HasContributingGuide {
        score += 5.0
    }
    
    return math.Min(100.0, score)
}

func calculatePersonalizationScore(user *models.User, project *models.Project) float64 {
    score := 0.0
    
    // Avoid already bookmarked projects (diversity)
    isBookmarked := false
    for _, bookmarked := range user.BookmarkedProjects {
        if bookmarked == project.ID || bookmarked == project.URL {
            isBookmarked = true
            break
        }
    }
    if isBookmarked {
        score -= 20.0 // reduce score for already bookmarked
    }
    
    // Project size preference
    if user.ProjectSize != "" && project.Size != "" {
        if user.ProjectSize == project.Size {
            score += 30.0
        }
    }
    
    // License preference
    if len(user.PreferredLicense) > 0 && project.License != "" {
        for _, prefLicense := range user.PreferredLicense {
            if strings.EqualFold(prefLicense, project.License) {
                score += 20.0
                break
            }
        }
    }
    
    // Stars threshold
    if project.Stars >= user.MinStars {
        score += 25.0
    }
    
    // Contribution type match
    if len(user.ContributionType) > 0 {
        if contains(user.ContributionType, "documentation") && 
           strings.Contains(strings.ToLower(project.Description), "documentation") {
            score += 15.0
        }
        if contains(user.ContributionType, "bug-fixes") && project.Issues > 0 {
            score += 15.0
        }
        if contains(user.ContributionType, "features") && project.Issues > 0 {
            score += 10.0
        }
        if contains(user.ContributionType, "translations") && 
           (strings.Contains(strings.ToLower(project.Description), "i18n") ||
            strings.Contains(strings.ToLower(project.Description), "translation")) {
            score += 20.0
        }
    }
    
    return score
}

func calculateTrendingBonus(project *models.Project) float64 {
    score := 0.0
    
    // Recent popularity growth
    if project.RecentCommits >= 20 {
        score += 50.0
    } else if project.RecentCommits >= 10 {
        score += 30.0
    }
    
    // High engagement ratio
    if project.Stars > 0 && project.Contributors > 0 {
        engagementRatio := float64(project.Contributors) / float64(project.Stars) * 1000
        if engagementRatio >= 5.0 {
            score += 30.0
        } else if engagementRatio >= 2.0 {
            score += 20.0
        }
    }
    
    // New and promising projects
    if createdAt, err := time.Parse(time.RFC3339, project.CreatedAt); err == nil {
        daysSinceCreation := time.Since(createdAt).Hours() / 24
        if daysSinceCreation <= 365 && project.Stars >= 100 { // less than 1 year old but popular
            score += 20.0
        }
    }
    
    return math.Min(100.0, score)
}

func calculateContributorFriendliness(project *models.Project) float64 {
    score := 0.0
    
    if project.HasGoodFirstIssues {
        score += 40.0
    }
    
    if project.ContributorFriendly {
        score += 30.0
    }
    
    if project.HasContributingGuide {
        score += 15.0
    }
    
    if project.HasCodeOfConduct {
        score += 15.0
    }
    
    return math.Min(100.0, score)
}

// Enhanced recommendation function
func RecommendProjects(user *models.User, projects []models.Project) []ProjectScore {
    var scoredProjects []ProjectScore
    
    // Score all projects
    for _, project := range projects {
        score, breakdown := ScoreProject(user, &project)
        if score > 0 { // Only include projects with positive scores
            scoredProjects = append(scoredProjects, ProjectScore{
                Project:    project,
                TotalScore: score,
                Breakdown:  breakdown,
            })
        }
    }
    
    // Sort by score (descending)
    sort.Slice(scoredProjects, func(i, j int) bool {
        return scoredProjects[i].TotalScore > scoredProjects[j].TotalScore
    })
    
    // Apply diversity filter to avoid similar projects
    diverseProjects := applyDiversityFilter(scoredProjects, user)
    
    // Return top 20 recommendations
    if len(diverseProjects) > 20 {
        return diverseProjects[:20]
    }
    
    return diverseProjects
}

func applyDiversityFilter(projects []ProjectScore, user *models.User) []ProjectScore {
    if len(projects) == 0 {
        return projects
    }
    
    var result []ProjectScore
    languageCount := make(map[string]int)
    topicCount := make(map[string]int)
    maxPerLanguage := 5 // Max projects per language
    maxPerTopic := 7    // Max projects per topic
    
    for _, scored := range projects {
        project := scored.Project
        
        // Check language diversity
        primaryLang := strings.ToLower(project.PrimaryLanguage)
        if primaryLang != "" && languageCount[primaryLang] >= maxPerLanguage {
            continue
        }
        
        // Check topic diversity
        skip := false
        for _, topic := range project.Topics {
            cleanTopic := strings.ToLower(topic)
            if topicCount[cleanTopic] >= maxPerTopic {
                skip = true
                break
            }
        }
        if skip {
            continue
        }
        
        // Add to result
        result = append(result, scored)
        
        // Update counters
        if primaryLang != "" {
            languageCount[primaryLang]++
        }
        for _, topic := range project.Topics {
            topicCount[strings.ToLower(topic)]++
        }
    }
    
    return result
}

// Helper function
func contains(slice []string, item string) bool {
    for _, s := range slice {
        if strings.EqualFold(s, item) {
            return true
        }
    }
    return false
}