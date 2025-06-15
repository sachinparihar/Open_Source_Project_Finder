import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import '../Styles/BookmarkPage.css';

export default function BookmarksPage() {
  const { userId, isAuthenticated, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    
    setLoading(true);
    setError('');
    
    api.getBookmarks(userId)
      .then(res => {
        const bookmarks = Array.isArray(res.data) ? res.data : [];
        setProjects(bookmarks);
      })
      .catch(err => {
        console.error('Error fetching bookmarks:', err);
        setError('Failed to load bookmarks');
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [userId, isAuthenticated]);

  // Filter projects based on search
  const filteredProjects = projects.filter(bookmark => {
    if (!searchQuery) return true;
    const project = bookmark.project;
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query))
    );
  });

  const handleRemoveBookmark = (projectId) => {
    setProjects(prev => prev.filter(bookmark => 
      bookmark.project_id !== projectId && bookmark.project.id !== projectId
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="bookmark-page">
        <div className="bookmark-message">
          <h2>🔐 Please Login</h2>
          <p>You need to be logged in to view your bookmarks.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmark-page">
      {/* Header */}
      <div className="bookmark-header">
        <h1>📚 My Bookmarks</h1>
        <p>Hello <strong>{user?.name || 'User'}</strong>! Here are your saved projects.</p>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="bookmark-search">
          <input
            type="text"
            placeholder="🔍 Search your bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {/* Content */}
      <div className="bookmark-content">
        {loading && (
          <div className="bookmark-loading">
            <div className="loading-spinner"></div>
            <p>Loading your bookmarks...</p>
          </div>
        )}

        {error && (
          <div className="bookmark-error">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="bookmark-empty">
            <h2>📝 No Bookmarks Yet</h2>
            <p>Start exploring and save some amazing projects!</p>
            <div className="empty-actions">
              <a href="/search" className="action-btn primary">🔍 Explore Projects</a>
              <a href="/recommend" className="action-btn">✨ Get Recommendations</a>
            </div>
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && projects.length > 0 && (
          <div className="bookmark-no-results">
            <p>🔍 No bookmarks match your search.</p>
            <button onClick={() => setSearchQuery('')} className="clear-btn">
              Clear Search
            </button>
          </div>
        )}

        {!loading && !error && filteredProjects.length > 0 && (
          <>
            <div className="bookmark-count">
              Showing {filteredProjects.length} of {projects.length} bookmarks
            </div>

            <div className="bookmark-list">
              {filteredProjects.map((bookmark) => (
                <div key={bookmark.project_id || bookmark.id} className="bookmark-item">
                  <div className="bookmark-date">
                    Saved on {new Date(bookmark.created_at).toLocaleDateString()}
                  </div>
                  
                  <ProjectCard project={bookmark.project} />
                  
                  <button
                    onClick={() => handleRemoveBookmark(bookmark.project_id)}
                    className="remove-btn"
                  >
                    🗑️ Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}