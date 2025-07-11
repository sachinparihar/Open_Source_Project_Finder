// Seed script for Open Source Project Finder
// Run this script to populate the database with sample data

db = db.getSiblingDB('open_source_finder');

// Clear existing data
db.projects.drop();
db.users.drop();
db.bookmarks.drop();

// Sample projects data
const sampleProjects = [
  {
    name: "Kubernetes",
    description: "Production-Grade Container Scheduling and Management",
    url: "https://github.com/kubernetes/kubernetes",
    platform: "github",
    owner: "kubernetes",
    languages: ["Go", "Shell", "Python"],
    primary_language: "Go",
    topics: ["cloud", "containers", "orchestration", "devops"],
    stars: 100000,
    forks: 40000,
    open_issues: 3000,
    license: "Apache-2.0",
    size: "large",
    difficulty: "advanced",
    activity_level: "high",
    has_good_first_issues: true,
    good_first_issue_labels: ["good first issue", "help wanted"],
    contributor_friendly: true,
    has_contributing_guide: true,
    has_code_of_conduct: true,
    last_updated: "2024-01-15T10:30:00Z",
    created_at: "2014-06-07T00:00:00Z",
    last_commit: "2024-01-15T10:30:00Z",
    recent_commits: 150,
    avg_issue_close_time: 7
  },
  {
    name: "React",
    description: "A JavaScript library for building user interfaces",
    url: "https://github.com/facebook/react",
    platform: "github",
    owner: "facebook",
    languages: ["JavaScript", "TypeScript"],
    primary_language: "JavaScript",
    topics: ["web", "frontend", "javascript", "ui"],
    stars: 200000,
    forks: 40000,
    open_issues: 1000,
    license: "MIT",
    size: "large",
    difficulty: "intermediate",
    activity_level: "high",
    has_good_first_issues: true,
    good_first_issue_labels: ["good first issue", "help wanted"],
    contributor_friendly: true,
    has_contributing_guide: true,
    has_code_of_conduct: true,
    last_updated: "2024-01-14T15:45:00Z",
    created_at: "2013-05-29T00:00:00Z",
    last_commit: "2024-01-14T15:45:00Z",
    recent_commits: 200,
    avg_issue_close_time: 5
  },
  {
    name: "Docker",
    description: "Docker is an open platform for developing, shipping, and running applications",
    url: "https://github.com/docker/docker-ce",
    platform: "github",
    owner: "docker",
    languages: ["Go", "Shell"],
    primary_language: "Go",
    topics: ["containers", "devops", "cloud", "deployment"],
    stars: 65000,
    forks: 18000,
    open_issues: 2000,
    license: "Apache-2.0",
    size: "large",
    difficulty: "advanced",
    activity_level: "high",
    has_good_first_issues: true,
    good_first_issue_labels: ["good first issue", "help wanted"],
    contributor_friendly: true,
    has_contributing_guide: true,
    has_code_of_conduct: true,
    last_updated: "2024-01-13T12:20:00Z",
    created_at: "2013-03-13T00:00:00Z",
    last_commit: "2024-01-13T12:20:00Z",
    recent_commits: 120,
    avg_issue_close_time: 10
  },
  {
    name: "Vue.js",
    description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework",
    url: "https://github.com/vuejs/vue",
    platform: "github",
    owner: "vuejs",
    languages: ["JavaScript", "TypeScript"],
    primary_language: "JavaScript",
    topics: ["web", "frontend", "javascript", "framework"],
    stars: 200000,
    forks: 32000,
    open_issues: 800,
    license: "MIT",
    size: "large",
    difficulty: "intermediate",
    activity_level: "high",
    has_good_first_issues: true,
    good_first_issue_labels: ["good first issue", "help wanted"],
    contributor_friendly: true,
    has_contributing_guide: true,
    has_code_of_conduct: true,
    last_updated: "2024-01-12T09:15:00Z",
    created_at: "2013-07-29T00:00:00Z",
    last_commit: "2024-01-12T09:15:00Z",
    recent_commits: 180,
    avg_issue_close_time: 6
  },
  {
    name: "TensorFlow",
    description: "An Open Source Machine Learning Framework for Everyone",
    url: "https://github.com/tensorflow/tensorflow",
    platform: "github",
    owner: "tensorflow",
    languages: ["Python", "C++", "JavaScript"],
    primary_language: "Python",
    topics: ["machine-learning", "ai", "deep-learning", "neural-networks"],
    stars: 170000,
    forks: 87000,
    open_issues: 4000,
    license: "Apache-2.0",
    size: "large",
    difficulty: "advanced",
    activity_level: "high",
    has_good_first_issues: true,
    good_first_issue_labels: ["good first issue", "help wanted"],
    contributor_friendly: true,
    has_contributing_guide: true,
    has_code_of_conduct: true,
    last_updated: "2024-01-11T14:30:00Z",
    created_at: "2015-11-07T00:00:00Z",
    last_commit: "2024-01-11T14:30:00Z",
    recent_commits: 250,
    avg_issue_close_time: 8
  }
];

// Sample users data
const sampleUsers = [
  {
    auth0_id: "auth0|sample_user_1",
    name: "John Developer",
    email: "john@example.com",
    github_username: "johndev",
    languages: ["JavaScript", "Python", "Go"],
    topics: ["web", "cloud", "devops"],
    experience_level: "intermediate",
    contribution_type: ["documentation", "bug-fixes", "features"],
    project_size: "medium",
    min_stars: 100,
    preferred_license: ["MIT", "Apache-2.0"],
    bookmarked_projects: [],
    viewed_projects: [],
    search_history: [],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    auth0_id: "auth0|sample_user_2",
    name: "Sarah Contributor",
    email: "sarah@example.com",
    github_username: "sarahcontrib",
    languages: ["Python", "JavaScript"],
    topics: ["machine-learning", "ai", "web"],
    experience_level: "beginner",
    contribution_type: ["documentation", "translations"],
    project_size: "small",
    min_stars: 50,
    preferred_license: ["MIT"],
    bookmarked_projects: [],
    viewed_projects: [],
    search_history: [],
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  }
];

// Sample bookmarks data
const sampleBookmarks = [
  {
    user_id: "auth0|sample_user_1",
    project_id: "https://github.com/kubernetes/kubernetes",
    project: {
      name: "Kubernetes",
      url: "https://github.com/kubernetes/kubernetes"
    }
  },
  {
    user_id: "auth0|sample_user_1",
    project_id: "https://github.com/facebook/react",
    project: {
      name: "React",
      url: "https://github.com/facebook/react"
    }
  },
  {
    user_id: "auth0|sample_user_2",
    project_id: "https://github.com/tensorflow/tensorflow",
    project: {
      name: "TensorFlow",
      url: "https://github.com/tensorflow/tensorflow"
    }
  }
];

// Insert sample data
print("Inserting sample projects...");
db.projects.insertMany(sampleProjects);

print("Inserting sample users...");
db.users.insertMany(sampleUsers);

print("Inserting sample bookmarks...");
db.bookmarks.insertMany(sampleBookmarks);

// Create indexes after inserting data
print("Creating indexes...");

// Projects indexes
db.projects.createIndex({ "name": "text", "description": "text" }, { name: "text_search_index" });
db.projects.createIndex({ "languages": 1 }, { name: "languages_index" });
db.projects.createIndex({ "topics": 1 }, { name: "topics_index" });
db.projects.createIndex({ "url": 1 }, { unique: true, name: "url_unique_index" });
db.projects.createIndex({ "stars": -1 }, { name: "stars_index" });
db.projects.createIndex({ "last_updated": -1 }, { name: "last_updated_index" });

// Users indexes
db.users.createIndex({ "auth0_id": 1 }, { unique: true, name: "auth0_id_unique_index" });
db.users.createIndex({ "email": 1 }, { unique: true, name: "email_unique_index" });

// Bookmarks indexes
db.bookmarks.createIndex({ "user_id": 1, "project_id": 1 }, { unique: true, name: "user_project_unique_index" });
db.bookmarks.createIndex({ "user_id": 1 }, { name: "user_bookmarks_index" });

print("Database seeding completed successfully!");
print("Inserted " + sampleProjects.length + " projects");
print("Inserted " + sampleUsers.length + " users");
print("Inserted " + sampleBookmarks.length + " bookmarks"); 