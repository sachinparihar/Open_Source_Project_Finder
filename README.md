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

## 📦 Prerequisites
- Node.js v16+
- Go v1.24+
- Azure Cosmos DB or MongoDB v4.4+
- Git

## 🔧 Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sachinparihar/Open_Source_Project_Finder.git
   cd Open_Source_Project_Finder
   ```
2. **Backend Setup**
   ```bash
   cd backend
   go mod tidy
   cp .env.example .env
   # Add MongoDB URI, GitHub Token, and CORS config in .env
   ```
3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Add API URL, Auth0 domain, and client ID in .env
   ```

## ▶️ Running the App
**Start Backend**
```bash
cd backend
go run main.go
```
**Start Frontend**
```bash
cd frontend
npm start
```
Visit: http://localhost:3000


![home](https://github.com/user-attachments/assets/ede87542-6669-43ca-ad17-27836a9db534)



## 📊 API Overview
- `GET /api/projects` – Filter/search projects
- `POST /api/recommend` – Personalized recommendations
- `GET/POST/DELETE /api/bookmarks` – Manage bookmarks
- `POST /api/github/fetch` – Fetch GitHub data
- `POST /api/github/sync` – Sync trending projects

## 🤝 Contributing
- Fork the repo
- Create a branch: `git checkout -b feature/your-feature`
- Commit and push
- Open a Pull Request

## 📝 License
MIT – See the LICENSE file.

## 👨‍💻 Author
Sachin Parihar  
[GitHub](https://github.com/sachinparihar) • [LinkedIn](https://linkedin.com/in/sachin-parihar-937b3b237/)