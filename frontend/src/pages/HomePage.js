import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Styles/HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({
    projects: '10,000+',
    languages: '50+',
    contributors: '5,000+'
  });

  // Simulate typing effect for hero text
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Discover. Contribute. Grow.';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-icon">🌟</span>
          <span>Your Gateway to Open Source Excellence</span>
        </div>
        
        <h1 className="home-title">
          Open Source Project <span className="title-highlight">Finder</span>
        </h1>
        
        <div className="typing-text">
          <span className="typing-cursor">{displayText}</span>
        </div>
        
        <p className="home-subtitle">
          Connect with meaningful open-source projects that match your skills, interests, and career goals. 
          Build your portfolio, contribute to the community, and accelerate your developer journey.
        </p>

        <div className="hero-actions">
          <Link to="/search" className="cta-button primary">
            <span className="button-icon">🔍</span>
            Start Exploring
          </Link>
          {!isAuthenticated ? (
            <Link to="/login" className="cta-button secondary">
              <span className="button-icon">🚀</span>
              Get Personalized
            </Link>
          ) : (
            <Link to="/recommend" className="cta-button secondary">
              <span className="button-icon">✨</span>
              My Recommendations
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">{stats.projects}</div>
            <div className="stat-label">Curated Projects</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.languages}</div>
            <div className="stat-label">Programming Languages</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.contributors}</div>
            <div className="stat-label">Active Contributors</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <p className="section-subtitle">
            We've built the most comprehensive and intelligent way to discover open-source projects
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Smart Matching</h3>
            <p className="feature-description">
              Our AI-powered recommendation engine analyzes your skills, interests, and contribution history 
              to suggest projects where you can make the biggest impact.
            </p>
            <div className="feature-highlight">Personalized for You</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Advanced Search</h3>
            <p className="feature-description">
              Filter by programming language, project size, difficulty level, activity status, and more. 
              Find exactly what you're looking for in seconds.
            </p>
            <div className="feature-highlight">Powerful Filters</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Curated Collections</h3>
            <p className="feature-description">
              Bookmark projects for later, organize them by categories, and track your contribution journey. 
              Never lose track of interesting opportunities.
            </p>
            <div className="feature-highlight">Stay Organized</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3 className="feature-title">Career Growth</h3>
            <p className="feature-description">
              Contribute to projects that align with your career goals. Build a portfolio that showcases 
              your skills and opens doors to new opportunities.
            </p>
            <div className="feature-highlight">Professional Development</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3 className="feature-title">Community Impact</h3>
            <p className="feature-description">
              Join a global community of developers making a difference. Contribute to projects that 
              solve real-world problems and benefit millions of users.
            </p>
            <div className="feature-highlight">Make a Difference</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">Skill Development</h3>
            <p className="feature-description">
              Learn new technologies, best practices, and collaboration skills by working on diverse projects 
              with experienced maintainers and contributors.
            </p>
            <div className="feature-highlight">Continuous Learning</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get started in minutes and discover your next favorite project
          </p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Sign Up & Set Preferences</h3>
              <p className="step-description">
                Create your profile and tell us about your skills, interests, and what type of 
                projects you'd like to contribute to. The more we know, the better we can help.
              </p>
            </div>
            <div className="step-icon">👤</div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Discover Projects</h3>
              <p className="step-description">
                Browse through our curated collection or get personalized recommendations. 
                Use our advanced filters to find projects that match your criteria perfectly.
              </p>
            </div>
            <div className="step-icon">🔍</div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Bookmark & Organize</h3>
              <p className="step-description">
                Save interesting projects to your bookmarks, organize them by categories, 
                and track your progress as you explore different opportunities.
              </p>
            </div>
            <div className="step-icon">📌</div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3 className="step-title">Start Contributing</h3>
              <p className="step-description">
                Jump into projects with confidence. Find good first issues, connect with maintainers, 
                and start making meaningful contributions to the open-source community.
              </p>
            </div>
            <div className="step-icon">🚀</div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="testimonials">
        <div className="section-header">
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">
            See how developers like you are growing their careers through open source
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              "This platform helped me find my first open-source contribution. Within 3 months, 
              I had contributed to 5 different projects and landed my dream job!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👩‍💻</div>
              <div className="author-info">
                <div className="author-name">Sarah Chen</div>
                <div className="author-role">Frontend Developer</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              "The recommendation engine is incredibly smart. It suggested projects that perfectly 
              matched my interests and skill level. I'm now a core maintainer!"
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍💻</div>
              <div className="author-info">
                <div className="author-name">Alex Rodriguez</div>
                <div className="author-role">Backend Engineer</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              "As a student, this platform gave me practical experience that no classroom could provide. 
              My GitHub profile went from empty to impressive in just 6 months."
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍🎓</div>
              <div className="author-info">
                <div className="author-name">Mike Johnson</div>
                <div className="author-role">CS Student</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="final-cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Open Source Journey?</h2>
          <p className="cta-description">
            Join thousands of developers who are building their careers, learning new skills, 
            and making a positive impact on the world through open source contributions.
          </p>
          
          <div className="cta-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/search" className="cta-button primary large">
                  <span className="button-icon">🌟</span>
                  Explore Projects Now
                </Link>
                <Link to="/login" className="cta-button secondary large">
                  <span className="button-icon">🚀</span>
                  Sign Up for Free
                </Link>
              </>
            ) : (
              <>
                <Link to="/recommend" className="cta-button primary large">
                  <span className="button-icon">✨</span>
                  Get My Recommendations
                </Link>
                <Link to="/bookmarks" className="cta-button secondary large">
                  <span className="button-icon">📚</span>
                  View My Bookmarks
                </Link>
              </>
            )}
          </div>

          <div className="cta-features">
            <div className="cta-feature">
              <span className="feature-check">✅</span>
              <span>100% Free Forever</span>
            </div>
            <div className="cta-feature">
              <span className="feature-check">✅</span>
              <span>No Spam, Ever</span>
            </div>
            <div className="cta-feature">
              <span className="feature-check">✅</span>
              <span>Personalized Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="footer-info">
        <div className="footer-content">
          <div className="footer-text">
            <h3>Built by Developers, for Developers</h3>
            <p>
              This platform is itself an open-source project, built with modern technologies 
              and best practices. We believe in transparency, community, and continuous improvement.
            </p>
          </div>
          
          <div className="tech-stack">
            <h4>Powered By</h4>
            <div className="tech-badges">
              <span className="tech-badge">React</span>
              <span className="tech-badge">Go</span>
              <span className="tech-badge">MongoDB</span>
              <span className="tech-badge">GitHub API</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;