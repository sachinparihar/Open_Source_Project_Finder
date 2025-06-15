import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Styles/Navbar.css';

export default function Navbar() {
  const { isAuthenticated, login, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🔍</span>
          <span className="brand-text">OSProject Finder</span>
        </Link>
        
        <div className="navbar-nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
          <Link 
            to="/search" 
            className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}
          >
            🔍 Search
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/recommend" 
                className={`nav-link ${location.pathname === '/recommend' ? 'active' : ''}`}
              >
                ✨ Recommended
              </Link>
              <Link 
                to="/bookmarks" 
                className={`nav-link ${location.pathname === '/bookmarks' ? 'active' : ''}`}
              >
                📚 Bookmarks
              </Link>
            </>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="auth-section">
              <span className="user-greeting">
                Hi, {user?.name || user?.preferred_username || 'User'}!
              </span>
              <button onClick={() => navigate('/profile')} className="profile-btn">
                👤 Profile
              </button>
              <button onClick={logout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          ) : (
            <button onClick={login} className="login-btn">
              🚀 Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}