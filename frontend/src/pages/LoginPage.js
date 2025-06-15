import React from "react";
import { useAuth } from "../context/AuthContext";
import '../Styles/LoginPage.css';

export default function LoginPage() {
  const { account, login, isAuthenticated } = useAuth();

  return (
    <div className="login-page">
      <div className="login-container">
        {isAuthenticated ? (
          <div className="logged-in-section">
            <div className="welcome-icon">✅</div>
            <h2 className="welcome-title">Welcome Back!</h2>
            <p className="welcome-message">
              You are already logged in as <strong>{account?.name || "User"}</strong>
            </p>
            <p className="navigation-hint">
              Navigate using the navbar above to explore projects.
            </p>
          </div>
        ) : (
          <div className="login-section">
            <div className="login-icon">🔍</div>
            <h2 className="login-title">Open Source Project Finder</h2>
            <p className="login-subtitle">
              Discover amazing open source projects and start contributing today!
            </p>
            <button onClick={login} className="login-button" aria-label="Login with Auth0">
              🚀 Login with GitHub
            </button>
            <p className="login-note">
              Sign in to get personalized recommendations and bookmark your favorite projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}