import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../Styles/SearchPage.css';

export default function RecommendPage() {
  const { user, userId, isAuthenticated } = useAuth();
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Enhanced filters
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [topic, setTopic] = useState('');
  const [minStars, setMinStars] = useState('');
  const [minScore, setMinScore] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [showReasonings, setShowReasonings] = useState(true);

  // User preference modal
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    languages: [],
    topics: [],
    experience_level: '',
    contribution_type: [],
    project_size: '',
    min_stars: 0
  });

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    setError('');
    
    // Create enhanced user profile for recommendations
    const enhancedUser = {
      ...user,
      ...userPreferences,
      // Fallback to basic user data if preferences not set
      languages: userPreferences.languages.length > 0 ? userPreferences.languages : [user.preferred_language || 'JavaScript'],
      topics: userPreferences.topics.length > 0 ? userPreferences.topics : ['web', 'open-source'],
      experience_level: userPreferences.experience_level || 'intermediate'
    };
    
    api.recommend(enhancedUser, userId)
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        setAllRecommendations(list);
        setFilteredProjects(list);
      })
      .catch(() => {
        setError('Failed to load recommendations');
        setAllRecommendations([]);
        setFilteredProjects([]);
      })
      .finally(() => setLoading(false));
  }, [user, userId, isAuthenticated, userPreferences]);

  // Enhanced filtering
  useEffect(() => {
    let filtered = [...allRecommendations];

    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(proj => 
        proj.name.toLowerCase().includes(searchTerm) ||
        (proj.description && proj.description.toLowerCase().includes(searchTerm)) ||
        (proj.reasoning && proj.reasoning.toLowerCase().includes(searchTerm))
      );
    }

    if (language.trim()) {
      const langFilter = language.toLowerCase();
      filtered = filtered.filter(proj =>
        proj.languages && proj.languages.some(lang => 
          lang.toLowerCase().includes(langFilter)
        )
      );
    }

    if (topic.trim()) {
      const topicFilter = topic.toLowerCase();
      filtered = filtered.filter(proj =>
        proj.topics && proj.topics.some(t => 
          t.toLowerCase().includes(topicFilter)
        )
      );
    }

    if (minStars.trim() && !isNaN(minStars)) {
      const minStarsNum = parseInt(minStars);
      filtered = filtered.filter(proj => proj.stars >= minStarsNum);
    }

    if (minScore.trim() && !isNaN(minScore)) {
      const minScoreNum = parseFloat(minScore);
      filtered = filtered.filter(proj => proj.score >= minScoreNum);
    }

    if (experienceLevel.trim()) {
      filtered = filtered.filter(proj => 
        proj.difficulty === experienceLevel
      );
    }

    // Enhanced sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stars - a.stars;
        case 'updated':
          return new Date(b.last_updated || b.updated_at) - new Date(a.last_updated || a.updated_at);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'language_match':
          return (b.score_breakdown?.language_match || 0) - (a.score_breakdown?.language_match || 0);
        case 'community':
          return (b.score_breakdown?.community_score || 0) - (a.score_breakdown?.community_score || 0);
        case 'score':
        default:
          return b.score - a.score;
      }
    });

    setFilteredProjects(filtered);
  }, [allRecommendations, query, language, topic, minStars, minScore, experienceLevel, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setLanguage('');
    setTopic('');
    setMinStars('');
    setMinScore('');
    setExperienceLevel('');
    setSortBy('score');
  };

  const updatePreferences = (newPrefs) => {
    setUserPreferences(prev => ({ ...prev, ...newPrefs }));
    setShowPreferences(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Please log in to see personalized recommendations.</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading personalized recommendations...</div>
        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
          This may take a moment as we analyze thousands of projects for you
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="search-title">Personalized Recommendations</h2>
        <button
          onClick={() => setShowPreferences(true)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          ⚙️ Preferences
        </button>
      </div>
      
      {/* Enhanced Filters */}
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search recommendations..."
          className="search-input"
        />
        <input
          type="text"
          value={language}
          onChange={e => setLanguage(e.target.value)}
          placeholder="Language"
          className="search-input"
        />
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Topic"
          className="search-input"
        />
        <input
          type="number"
          value={minStars}
          onChange={e => setMinStars(e.target.value)}
          placeholder="Min Stars"
          className="search-input"
        />
        <input
          type="number"
          value={minScore}
          onChange={e => setMinScore(e.target.value)}
          placeholder="Min Score"
          className="search-input"
          step="0.1"
        />
        <select
          value={experienceLevel}
          onChange={e => setExperienceLevel(e.target.value)}
          className="search-input"
        >
          <option value="">Any Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        alignItems: 'center', 
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label htmlFor="sortBy" style={{ fontWeight: 'bold' }}>Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #ccc'
            }}
          >
            <option value="score">Recommendation Score</option>
            <option value="language_match">Language Match</option>
            <option value="community">Community Health</option>
            <option value="stars">Stars</option>
            <option value="updated">Last Updated</option>
            <option value="name">Name</option>
          </select>
        </div>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={showReasonings}
            onChange={e => setShowReasonings(e.target.checked)}
          />
          Show why recommended
        </label>
        
        <button onClick={clearFilters} style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}>
          Clear Filters
        </button>
        
        <span style={{ color: '#6b7280' }}>
          {filteredProjects.length} of {allRecommendations.length} recommendations
        </span>
      </div>

      {/* Results */}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div className="results">
        {filteredProjects.length === 0 && allRecommendations.length > 0 && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No projects match your current filters.</p>
            <button onClick={clearFilters} style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}>
              Clear Filters
            </button>
          </div>
        )}
        
        {allRecommendations.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No recommendations available.</p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Try updating your preferences or search for some projects first.
            </p>
          </div>
        )}
        
        {filteredProjects.map((proj, index) => (
          <div key={proj.id || proj.url} style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ 
                fontSize: '0.9rem', 
                color: '#3b82f6', 
                fontWeight: 'bold'
              }}>
                #{index + 1} • Score: {proj.score.toFixed(1)}
              </span>
              {proj.score_breakdown && (
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Lang: {proj.score_breakdown.language_match?.toFixed(0) || 0} | 
                  Topic: {proj.score_breakdown.topic_match?.toFixed(0) || 0} | 
                  Community: {proj.score_breakdown.community_score?.toFixed(0) || 0}
                </span>
              )}
            </div>
            
            <ProjectCard 
              project={{
                ...proj,
                bookmark_id: proj.bookmark_id
              }} 
            />
            
            {showReasonings && proj.reasoning && (
              <div style={{ 
                backgroundColor: '#f8fafc', 
                padding: '0.75rem', 
                borderRadius: '0.375rem',
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                color: '#4b5563',
                fontStyle: 'italic'
              }}>
                💡 {proj.reasoning}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <PreferencesModal 
          preferences={userPreferences}
          onSave={updatePreferences}
          onClose={() => setShowPreferences(false)}
        />
      )}
    </div>
  );
}

// Preferences Modal Component
function PreferencesModal({ preferences, onSave, onClose }) {
  const [localPrefs, setLocalPrefs] = useState(preferences);

  const handleSave = () => {
    onSave(localPrefs);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h3>Recommendation Preferences</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Preferred Languages (comma-separated):</label>
          <input
            type="text"
            value={localPrefs.languages.join(', ')}
            onChange={e => setLocalPrefs(prev => ({
              ...prev,
              languages: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }))}
            placeholder="JavaScript, Python, Go"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Interested Topics (comma-separated):</label>
          <input
            type="text"
            value={localPrefs.topics.join(', ')}
            onChange={e => setLocalPrefs(prev => ({
              ...prev,
              topics: e.target.value.split(',').map(s => s.trim()).filter(s => s)
            }))}
            placeholder="web, machine-learning, devops"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Experience Level:</label>
          <select
            value={localPrefs.experience_level}
            onChange={e => setLocalPrefs(prev => ({ ...prev, experience_level: e.target.value }))}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Minimum Stars:</label>
          <input
            type="number"
            value={localPrefs.min_stars}
            onChange={e => setLocalPrefs(prev => ({ ...prev, min_stars: parseInt(e.target.value) || 0 }))}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={handleSave}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Save Preferences
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}