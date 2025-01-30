import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/github/profile', {
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data) => setUser({ provider: 'github', ...data }))
      .catch(() => {
        fetch('http://localhost:8080/google/profile', {
          credentials: 'include',
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error('Not authenticated');
          })
          .then((data) => setUser({ provider: 'google', ...data }))
          .catch(() => setUser(null));
      });
  }, []);

  const handleLogout = async () => {
    await fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <div className="home-container">
      <h1>Welcome to Open Source Project Finder</h1>
      {user ? (
        <>
          {user.provider === 'github' ? (
            <p>Logged in as {user.username} (GitHub)</p>
          ) : (
            <p>Logged in as {user.email} (Google)</p>
          )}
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </>
      ) : (
        <>
          <p>Log in with your preferred provider:</p>
          <a href="http://localhost:8080/github/login" className="login-button github">Login with GitHub</a>
          <a href="http://localhost:8080/google/login" className="login-button google">Login with Google</a>
        </>
      )}
    </div>
  );
}

export default App;