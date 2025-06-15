import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../Styles/SearchPage.css';

export default function SearchPage() {
  const { userId, isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() || language.trim() || topic.trim()) {
        setLoading(true);
        setError('');
        api
          .getProjects(
            { q: query, language, topic }, 
            isAuthenticated ? userId : null // Only pass userId if authenticated
          )
          .then(res => {
            setResults(Array.isArray(res.data) ? res.data : []);
          })
          .catch(() => {
            setError('Failed to fetch projects.');
            setResults([]);
          })
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, language, topic, userId, isAuthenticated]); // Add isAuthenticated to dependencies

  return (
    <div className="search-container">
      <h2 className="search-title">Search Projects</h2>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name or description"
          className="search-input"
        />
        <input
          type="text"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          placeholder="Language (e.g. Go)"
          className="search-input"
        />
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Topic (e.g. cloud)"
          className="search-input"
        />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div className="results">
        {results.length === 0 && !loading && (query || language || topic) && (
          <div>No projects found.</div>
        )}
        {results.map(proj => (
          <ProjectCard 
            key={proj.id || proj.url} 
            project={{
              ...proj,
              bookmark_id: proj.bookmark_id // This will be included from backend when authenticated
            }} 
          />
        ))}
      </div>
    </div>
  );
}