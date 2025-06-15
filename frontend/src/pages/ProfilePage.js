import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';
import '../Styles/ProfilePage.css';

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const [githubProfile, setGithubProfile] = useState(null);
  const [starredProjects, setStarredProjects] = useState([]);
  const [userRepos, setUserRepos] = useState([]);
  const [contributions, setContributions] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingStarred, setLoadingStarred] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [errorProfile, setErrorProfile] = useState('');
  const [errorStarred, setErrorStarred] = useState('');
  const [errorRepos, setErrorRepos] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('stars');

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
    const username = user.preferred_username || user.login || user.username || user.nickname;
    if (!username) return;

    // Fetch GitHub profile
    setLoadingProfile(true);
    axios
      .get(`https://api.github.com/users/${username}`)
      .then(res => {
        setGithubProfile(res.data);
        // Calculate contribution stats
        const joinedDate = new Date(res.data.created_at);
        const daysSinceJoined = Math.floor((Date.now() - joinedDate) / (1000 * 60 * 60 * 24));
        setContributions({
          totalRepos: res.data.public_repos,
          joinedDays: daysSinceJoined,
          avgReposPerMonth: ((res.data.public_repos / daysSinceJoined) * 30).toFixed(1)
        });
      })
      .catch(() => setErrorProfile('Failed to fetch GitHub profile.'))
      .finally(() => setLoadingProfile(false));

    // Fetch starred projects
    setLoadingStarred(true);
    axios
      .get(`https://api.github.com/users/${username}/starred?per_page=50`)
      .then(res => setStarredProjects(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErrorStarred('Failed to fetch starred projects.'))
      .finally(() => setLoadingStarred(false));

    // Fetch user repositories
    setLoadingRepos(true);
    axios
      .get(`https://api.github.com/users/${username}/repos?per_page=50&sort=updated`)
      .then(res => setUserRepos(Array.isArray(res.data) ? res.data : []))
      .catch(() => setErrorRepos('Failed to fetch repositories.'))
      .finally(() => setLoadingRepos(false));
  }, [isAuthenticated, user]);

  // Filter and sort projects
  const getFilteredProjects = (projects) => {
    let filtered = projects.filter(project => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        project.name.toLowerCase().includes(query) ||
        (project.description && project.description.toLowerCase().includes(query)) ||
        (project.language && project.language.toLowerCase().includes(query))
      );
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
          return new Date(b.updated_at) - new Date(a.updated_at);
        case 'created':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'stars':
        default:
          return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      }
    });
  };

  const getLanguageStats = (repos) => {
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });
    return Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="profile-empty-state">
          <div className="empty-state-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header">
        {loadingProfile ? (
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        ) : errorProfile ? (
          <div className="profile-error">
            <div className="error-icon">⚠️</div>
            <h3>Failed to load profile</h3>
            <p>{errorProfile}</p>
          </div>
        ) : githubProfile ? (
          <div className="profile-info">
            <div className="profile-avatar-section">
              <img
                src={githubProfile.avatar_url}
                alt={githubProfile.login}
                className="profile-avatar"
              />
              <div className="profile-status">
                <span className="status-indicator online"></span>
                Active
              </div>
            </div>
            
            <div className="profile-details">
              <h1 className="profile-name">
                {githubProfile.name || githubProfile.login}
              </h1>
              <p className="profile-username">@{githubProfile.login}</p>
              
              {githubProfile.bio && (
                <p className="profile-bio">{githubProfile.bio}</p>
              )}
              
              <div className="profile-meta">
                {githubProfile.location && (
                  <span className="meta-item">
                    <span className="meta-icon">📍</span>
                    {githubProfile.location}
                  </span>
                )}
                {githubProfile.company && (
                  <span className="meta-item">
                    <span className="meta-icon">🏢</span>
                    {githubProfile.company}
                  </span>
                )}
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Joined {new Date(githubProfile.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="profile-links">
                <a 
                  href={githubProfile.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="profile-link github"
                >
                  <span className="link-icon">🔗</span>
                  View on GitHub
                </a>
                {githubProfile.blog && (
                  <a 
                    href={githubProfile.blog.startsWith('http') ? githubProfile.blog : `https://${githubProfile.blog}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="profile-link website"
                  >
                    <span className="link-icon">🌐</span>
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Stats Section */}
      {githubProfile && (
        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-number">{githubProfile.public_repos}</div>
            <div className="stat-label">Public Repos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{githubProfile.followers}</div>
            <div className="stat-label">Followers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{githubProfile.following}</div>
            <div className="stat-label">Following</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{starredProjects.length}</div>
            <div className="stat-label">Starred</div>
          </div>
          {contributions && (
            <div className="stat-card">
              <div className="stat-number">{contributions.avgReposPerMonth}</div>
              <div className="stat-label">Repos/Month</div>
            </div>
          )}
        </div>
      )}

      {/* Language Stats */}
      {userRepos.length > 0 && (
        <div className="language-stats">
          <h3>Top Languages</h3>
          <div className="language-grid">
            {getLanguageStats(userRepos).map(([language, count]) => (
              <div key={language} className="language-item">
                <span className="language-name">{language}</span>
                <span className="language-count">{count} repos</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="profile-nav">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'repos' ? 'active' : ''}`}
          onClick={() => setActiveTab('repos')}
        >
          <span className="tab-icon">📁</span>
          Repositories ({userRepos.length})
        </button>
        <button
          className={`nav-tab ${activeTab === 'starred' ? 'active' : ''}`}
          onClick={() => setActiveTab('starred')}
        >
          <span className="tab-icon">⭐</span>
          Starred ({starredProjects.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {userRepos.slice(0, 5).map(repo => (
                    <div key={repo.id} className="activity-item">
                      <span className="activity-icon">📝</span>
                      <div className="activity-details">
                        <p className="activity-title">Updated {repo.name}</p>
                        <p className="activity-time">
                          {new Date(repo.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overview-card">
                <h3>Popular Repositories</h3>
                <div className="popular-repos">
                  {userRepos
                    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
                    .slice(0, 5)
                    .map(repo => (
                      <div key={repo.id} className="popular-repo">
                        <div className="repo-info">
                          <p className="repo-name">{repo.name}</p>
                          <p className="repo-lang">{repo.language}</p>
                        </div>
                        <div className="repo-stats">
                          <span className="repo-stars">⭐ {repo.stargazers_count || 0}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'repos' || activeTab === 'starred') && (
          <div className="projects-section">
            {/* Search and Filter Controls */}
            <div className="projects-controls">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'repos' ? 'repositories' : 'starred projects'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="projects-search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="projects-sort-select"
              >
                <option value="stars">Most Stars</option>
                <option value="updated">Recently Updated</option>
                <option value="created">Recently Created</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            {/* Projects Grid */}
            <div className="projects-grid">
              {activeTab === 'repos' && (
                <>
                  {loadingRepos && (
                    <div className="projects-loading">
                      <div className="loading-spinner"></div>
                      <p>Loading repositories...</p>
                    </div>
                  )}
                  {errorRepos && (
                    <div className="projects-error">
                      <p>{errorRepos}</p>
                    </div>
                  )}
                  {!loadingRepos && !errorRepos && (
                    getFilteredProjects(userRepos).length === 0 ? (
                      <div className="projects-empty">
                        <div className="empty-icon">📁</div>
                        <p>No repositories found.</p>
                      </div>
                    ) : (
                      getFilteredProjects(userRepos).map(repo => (
                        <ProjectCard key={repo.id} project={repo} />
                      ))
                    )
                  )}
                </>
              )}

              {activeTab === 'starred' && (
                <>
                  {loadingStarred && (
                    <div className="projects-loading">
                      <div className="loading-spinner"></div>
                      <p>Loading starred projects...</p>
                    </div>
                  )}
                  {errorStarred && (
                    <div className="projects-error">
                      <p>{errorStarred}</p>
                    </div>
                  )}
                  {!loadingStarred && !errorStarred && (
                    getFilteredProjects(starredProjects).length === 0 ? (
                      <div className="projects-empty">
                        <div className="empty-icon">⭐</div>
                        <p>No starred projects found.</p>
                      </div>
                    ) : (
                      getFilteredProjects(starredProjects).map(proj => (
                        <ProjectCard key={proj.id} project={proj} />
                      ))
                    )
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="profile-footer">
        <button onClick={logout} className="logout-button">
          <span className="button-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}