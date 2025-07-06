# Open Source Project Finder

A platform that helps developers discover active, well-maintained open source projects tailored to their skills and interests. Features AI-powered recommendations, project activity scoring, community health metrics, and personalized matching to maximize successful contributions.

## 🚀 Features

- **AI-Powered Recommendations**: Personalized project suggestions based on skills and interests
- **Activity Scoring**: Real-time project health and maintenance metrics
- **Community Health Indicators**: Response time, contributor friendliness, and engagement metrics
- **Smart Filtering**: Filter by language, topic, experience level, and activity
- **Bookmark System**: Save and organize projects of interest
- **User Authentication**: Secure login with Auth0 integration

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

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Go** (v1.24 or higher)
- **Azure Cosmos DB** (MongoDB API) or **MongoDB** (v4.4 or higher)
- **Git**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sachinparihar/Open_Source_Project_Finder.git
cd Open_Source_Project_Finder
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Go dependencies
go mod tidy

# Create .env file for environment variables
cp .env.example .env
# Edit .env file with your configuration
```

#### Environment Variables (.env)

Create a `.env` file in the backend directory with the following variables:

```env
# Azure Cosmos DB MongoDB Configuration
MONGODB_URI=your_cosmosdb_connection_string_here

# GitHub API Configuration
GITHUB_TOKEN=your_github_token_here

# Server Configuration
PORT=8080

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

#### Get GitHub Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Generate a new token with `repo` and `read:user` permissions
3. Add the token to your `.env` file

#### Setup Azure Cosmos DB

1. Go to [Azure Portal](https://portal.azure.com/)
2. Create a new Cosmos DB account with MongoDB API
3. Create a database named `osproject_finder`
4. Copy the connection string from the "Keys" section
5. Copy the connection string and replace `your_cosmosdb_connection_string_here` in the .env file

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for environment variables
cp .env.example .env
# Edit .env file with your configuration
```

#### Environment Variables (.env)

Create a `.env` file in the frontend directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8080

# Auth0 Configuration
REACT_APP_AUTH0_DOMAIN=your_auth0_domain
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
```

#### Setup Auth0

1. Create an account at [Auth0](https://auth0.com/)
2. Create a new application (Single Page Application)
3. Configure allowed callback URLs: `http://localhost:3000`
4. Copy your domain and client ID to the `.env` file

### 4. Database Setup

#### Option 1: Azure Cosmos DB (Recommended)

1. Create an Azure Cosmos DB account with MongoDB API
2. Create a database named `osproject_finder`
3. Get your connection string from Azure Portal
4. Update the `MONGODB_URI` in your `.env` file

#### Option 2: Local MongoDB

```bash
# Start MongoDB (if not running as a service)
mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Run the Go server
go run main.go
```

The backend server will start on `http://localhost:8080`

### 2. Start the Frontend Application

```bash
# Navigate to frontend directory
cd frontend

# Start the React development server
npm start
```

The frontend application will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 🔄 Updating & Maintenance

### 1. Pull the Latest Code

```bash
git pull origin main
```

### 2. Update Backend Dependencies

```bash
cd backend
go mod tidy
```

### 3. Update Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Apply Database Migrations (if any)

- Check the `backend/database/` directory for migration scripts or instructions.
- Run any provided migration commands as needed.

### 5. Restart the Servers

- **Backend:**
  ```bash
  cd backend
  go run main.go
  ```
- **Frontend:**
  ```bash
  cd frontend
  npm start
  ```

### 6. Update Environment Variables

- If `.env.example` changes, update your local `.env` files accordingly.
- Never commit real secrets to the repository.

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

## 🧪 Testing

### Backend Tests

```bash
cd backend
go test ./...
```

### Frontend Tests

```bash
cd frontend
npm test
```

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
- LinkedIn: [Sachin Parihar](https://linkedin.com/in/sachinparihar)

## 🙏 Acknowledgments

- CNCF projects (Kubernetes, KubeSphere, OpenFunction) for inspiration
- Open source community for continuous learning and collaboration