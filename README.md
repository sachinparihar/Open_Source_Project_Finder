# Open Source Project Finder

A Web Platform that makes it easy for developers to find and join active open source projects. The app matches users with projects based on their skills and interests, highlights project activity and helps contributors connect with the right opportunities.

## 🚀 Features
- AI-Powered Recommendations
- Project Activity Scoring
- Community Health Indicators
- Smart Filtering
- Bookmark System
- Auth0 Authentication

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Auth0 Authentication
- Axios for API calls
- CSS for styling

### Backend
- Go 1.24.2
- Gorilla Mux for routing
- Azure Cosmos DB (MongoDB API) for database
- GitHub API integration
- JWT authentication

## ⚙️ Local Setup

```bash
# Clone the repository
git clone https://github.com/sachinparihar/Open_Source_Project_Finder.git
cd Open_Source_Project_Finder

# --------------------
# Backend Setup
# --------------------
cd backend
go mod tidy
cp .env.example .env

# Edit .env and add the following:
# MONGODB_URI=your_mongodb_uri
# GITHUB_TOKEN=your_github_token
# PORT=8080
# ALLOWED_ORIGINS=http://localhost:3000

# Start backend server
go run main.go

# --------------------
# Frontend Setup (in a new terminal or after backend is running)
# --------------------
cd ../frontend
npm install
cp .env.example .env

# Edit .env and add the following:
# REACT_APP_API_URL=http://localhost:8080
# REACT_APP_AUTH0_DOMAIN=your_auth0_domain
# REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id

# Start frontend
npm start
```

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Go** (v1.24 or higher)
- **MongoDB** or **Azure Cosmos DB**
- **GitHub Personal Access Token**
- **Auth0 Account**

## 🔧 Environment Setup

### GitHub Token
1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with `repo` and `read:user` permissions

### Auth0 Setup
1. Create an account at [Auth0](https://auth0.com/)
2. Create a new application (Single Page Application)
3. Configure allowed callback URLs: `http://localhost:3000`

### Database Setup
- **Option 1**: Azure Cosmos DB (MongoDB API)
- **Option 2**: Local MongoDB: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

## 📊 API Endpoints

### Projects
- `GET /api/projects` - Search and filter projects
- `POST /api/recommend` - Get personalized recommendations

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks` - Add bookmark
- `DELETE /api/bookmarks` - Remove bookmark

### GitHub Integration
- `POST /api/github/fetch` - Fetch GitHub projects
- `POST /api/github/sync` - Sync trending projects

## 📁 Project Structure

```
Open_Source_Project_Finder/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # HTTP handlers
│   ├── database/        # Database connection
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── main.go         # Entry point
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   └── styles/      # CSS files
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sachin Parihar**
- GitHub: [@sachinparihar](https://github.com/sachinparihar)
- LinkedIn: [Sachin Parihar](https://linkedin.com/in/sachin-parihar-937b3b237/)

## 🙏 Acknowledgments

- CNCF projects (Kubernetes, KubeSphere, Knative, Dapr) for inspiration
- Open source community for continuous learning and collaboration