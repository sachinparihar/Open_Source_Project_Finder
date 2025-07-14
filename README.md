# Open Source Project Finder
A platform that helps developers discover active, well-maintained open source projects tailored to their skills and interests. Features AI-powered recommendations, project activity scoring, and personalized matching to maximize successful contributions.

## 🚀 Features
- AI-Powered Recommendations
- Project Activity Scoring
- Community Health Indicators
- Smart Filtering
- Bookmark System
- Auth0 Authentication

## 🛠️ Tech Stack
- **Frontend:** React 19, Auth0, Axios, CSS
- **Backend:** Go 1.24.2, Gorilla Mux, Azure Cosmos DB (MongoDB API), GitHub API, JWT
- **Infrastructure:** Docker, Docker Compose, Nginx

## 📦 Prerequisites
- Node.js v16+
- Go v1.24+
- Azure Cosmos DB or MongoDB v4.4+
- Docker & Docker Compose (for containerized setup)
- Git

## 🔧 Setup Instructions

### Option 1: Docker Setup (Recommended)
1. **Clone the Repository**
   ```bash
   git clone https://github.com/sachinparihar/Open_Source_Project_Finder.git
   cd Open_Source_Project_Finder
   ```

2. **Environment Setup**
   ```bash
   # Backend environment
   cp backend/.env.example backend/.env
   # Edit backend/.env with your Azure Cosmos DB connection string and GitHub token
   
   # Frontend environment
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your API URL, Auth0 domain, and client ID
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```
   This will start both frontend and backend containers.

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Option 2: Local Development Setup
1. **Clone the Repository**
   ```bash
   git clone https://github.com/sachinparihar/Open_Source_Project_Finder.git
   cd Open_Source_Project_Finder
   ```

2. **Backend Setup**
   ```bash
   cd backend
   go mod tidy
   # Create .env file with your Azure Cosmos DB connection string
   # See backend/ENVIRONMENT_SETUP.md for detailed instructions
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Add API URL, Auth0 domain, and client ID in .env
   ```

## ▶️ Running the App

### Using Docker (Recommended)
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build
```

### Local Development
**Start Backend**
```bash
cd backend
go run main.go
# Test database connection:
go run cmd/test_db/main.go
```

**Start Frontend**
```bash
cd frontend
npm start
```

Visit: http://localhost:3000

<img width="1545" height="1011" alt="home" src="https://github.com/user-attachments/assets/4c60d698-cb99-40bb-a41e-9b9649db5ac1" />

## 🐳 Docker Configuration

### Backend Container
- **Port:** 8080 (host) → 8080 (container)
- **Base Image:** golang:1.22-alpine
- **Environment:** Uses backend/.env file

### Frontend Container
- **Port:** 3000 (host) → 80 (container)
- **Base Image:** Multi-stage build (node:20-alpine → nginx:alpine)
- **Web Server:** Nginx
- **Environment:** Uses frontend/.env file

### Docker Compose Services
- **Backend:** Go API server
- **Frontend:** React app served by Nginx
- **Dependencies:** Frontend depends on backend

## 📊 API Overview
- `GET /api/projects` – Filter/search projects
- `POST /api/recommend` – Personalized recommendations
- `GET/POST/DELETE /api/bookmarks` – Manage bookmarks
- `POST /api/github/fetch` – Fetch GitHub data
- `POST /api/github/sync` – Sync trending projects

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=mongodb://your-cosmos-db-connection-string
GITHUB_TOKEN=your-github-personal-access-token
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_AUTH0_DOMAIN=your-auth0-domain
REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
```

## 🤝 Contributing
- Fork the repo
- Create a branch: `git checkout -b feature/your-feature`
- Commit and push
- Open a Pull Request

## 👨‍💻 Author
Sachin Parihar  
[GitHub](https://github.com/sachinparihar) • [LinkedIn](https://linkedin.com/in/sachin-parihar-937b3b237/)
