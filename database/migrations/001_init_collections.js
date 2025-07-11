// Migration: Initialize collections and indexes
// Run this script to set up the database structure

db = db.getSiblingDB('open_source_finder');

// Create collections if they don't exist
db.createCollection('projects');
db.createCollection('users');
db.createCollection('bookmarks');

// Create indexes for projects collection
db.projects.createIndex(
  { "name": "text", "description": "text" },
  { name: "text_search_index" }
);

db.projects.createIndex(
  { "languages": 1 },
  { name: "languages_index" }
);

db.projects.createIndex(
  { "topics": 1 },
  { name: "topics_index" }
);

db.projects.createIndex(
  { "url": 1 },
  { unique: true, name: "url_unique_index" }
);

db.projects.createIndex(
  { "stars": -1 },
  { name: "stars_index" }
);

db.projects.createIndex(
  { "last_updated": -1 },
  { name: "last_updated_index" }
);

// Create indexes for users collection
db.users.createIndex(
  { "auth0_id": 1 },
  { unique: true, name: "auth0_id_unique_index" }
);

db.users.createIndex(
  { "email": 1 },
  { unique: true, name: "email_unique_index" }
);

// Create indexes for bookmarks collection
db.bookmarks.createIndex(
  { "user_id": 1, "project_id": 1 },
  { unique: true, name: "user_project_unique_index" }
);

db.bookmarks.createIndex(
  { "user_id": 1 },
  { name: "user_bookmarks_index" }
);

print("Database initialization completed successfully!"); 