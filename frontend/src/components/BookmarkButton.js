import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookmarkButton({ project }) {
  const { userId } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if project is already bookmarked based on bookmark_id
    setBookmarked(!!project.bookmark_id);
  }, [project]);

  const toggle = async () => {
    if (!userId || loading) return;
    
    setLoading(true);
    try {
      if (!bookmarked) {
        await api.addBookmark(userId, project);
        setBookmarked(true);
      } else {
        const projectId = project.id || project.url;
        await api.removeBookmark(userId, projectId);
        setBookmarked(false);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggle} 
      disabled={loading}
      style={{
        background: bookmarked ? '#ef4444' : '#22c55e',
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '0.5rem'
      }}
    >
      {loading ? '⏳' : bookmarked ? '💔 Unbookmark' : '⭐ Bookmark'}
    </button>
  );
}