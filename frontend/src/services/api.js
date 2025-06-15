import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10000,
  withCredentials: false
});

const api = {
  // Projects - now accepts userId to include bookmark status
  getProjects: (params, userId = null) => {
    const searchParams = { ...params };
    if (userId) {
      searchParams.user_id = userId;
    }
    return client.get('/api/projects', { params: searchParams });
  },
  
  getProject: id => client.get(`/api/projects/${id}`),

  // Bookmarks (now scoped to a user)
  getBookmarks: userId =>
    client.get('/api/bookmarks', { params: { user_id: userId } }),

  addBookmark: (userId, project) =>
    client.post('/api/bookmarks', {
      user_id: userId,
      project_id: project.id || project.url,
      project
    }),

  removeBookmark: (userId, projectId) =>
    client.delete('/api/bookmarks', {
      params: { user_id: userId, project_id: projectId }
    }),

  // Recommendations
  recommend: (userProfile, userId = null) => {
    const url = userId ? `/api/recommend?user_id=${userId}` : '/api/recommend';
    return client.post(url, userProfile);
  },

  // GitHub sync
  syncGitHub: () => client.post('/api/github/sync'),

  // Auth (if used)
  login: creds => client.post('/api/auth/login', creds),
  logout: () => client.post('/api/auth/logout'),
  getProfile: () => client.get('/api/auth/profile')
};

export default api;