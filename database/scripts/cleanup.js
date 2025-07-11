// Database cleanup script for Open Source Project Finder
// Run this script to clean up old or unused data

print("Starting database cleanup...");

// Clean up old projects (older than 2 years with no activity)
const twoYearsAgo = new Date();
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

const oldProjects = db.projects.find({
    last_updated: { $lt: twoYearsAgo.toISOString() },
    stars: { $lt: 10 }
}).count();

if (oldProjects > 0) {
    print(`Found ${oldProjects} old inactive projects to remove...`);
    db.projects.deleteMany({
        last_updated: { $lt: twoYearsAgo.toISOString() },
        stars: { $lt: 10 }
    });
    print(`Removed ${oldProjects} old projects`);
}

// Clean up orphaned bookmarks (bookmarks for projects that no longer exist)
const orphanedBookmarks = db.bookmarks.aggregate([
    {
        $lookup: {
            from: "projects",
            localField: "project_id",
            foreignField: "url",
            as: "project"
        }
    },
    {
        $match: {
            project: { $size: 0 }
        }
    }
]).toArray();

if (orphanedBookmarks.length > 0) {
    print(`Found ${orphanedBookmarks.length} orphaned bookmarks to remove...`);
    const orphanedIds = orphanedBookmarks.map(b => b._id);
    db.bookmarks.deleteMany({ _id: { $in: orphanedIds } });
    print(`Removed ${orphanedBookmarks.length} orphaned bookmarks`);
}

// Clean up duplicate projects (keep the one with more stars)
const duplicates = db.projects.aggregate([
    {
        $group: {
            _id: "$url",
            count: { $sum: 1 },
            docs: { $push: "$$ROOT" }
        }
    },
    {
        $match: {
            count: { $gt: 1 }
        }
    }
]).toArray();

if (duplicates.length > 0) {
    print(`Found ${duplicates.length} duplicate projects to clean up...`);
    
    duplicates.forEach(duplicate => {
        // Sort by stars (descending) and keep the first one
        const sortedDocs = duplicate.docs.sort((a, b) => b.stars - a.stars);
        const toRemove = sortedDocs.slice(1);
        
        const idsToRemove = toRemove.map(doc => doc._id);
        db.projects.deleteMany({ _id: { $in: idsToRemove } });
        
        print(`Removed ${toRemove.length} duplicates for ${duplicate._id}`);
    });
}

// Update statistics
const totalProjects = db.projects.countDocuments();
const totalUsers = db.users.countDocuments();
const totalBookmarks = db.bookmarks.countDocuments();

print("Cleanup completed successfully!");
print(`Database now contains:`);
print(`- ${totalProjects} projects`);
print(`- ${totalUsers} users`);
print(`- ${totalBookmarks} bookmarks`); 