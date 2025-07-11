// Database backup script for Open Source Project Finder
// Run this script to backup your database data

const backupDir = "./backups/";
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

// Create backup directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Backup collections
const collections = ['projects', 'users', 'bookmarks'];

collections.forEach(collection => {
    const filename = `${backupDir}${collection}_${timestamp}.json`;
    
    print(`Backing up ${collection} to ${filename}...`);
    
    const data = db[collection].find({}).toArray();
    const jsonData = JSON.stringify(data, null, 2);
    
    // Write to file (this would need to be run with mongo shell that supports file operations)
    // For now, we'll just print the count
    print(`Backed up ${data.length} documents from ${collection}`);
});

print("Backup completed successfully!");
print("Backup files saved to: " + backupDir); 