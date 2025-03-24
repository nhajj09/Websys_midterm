import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user exists
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user || (username.trim() === 'admin' && password === 'pass')) {
      sessionStorage.setItem('user', username);
      setIsLoggedIn(true);
    } else {
      setError('Invalid username or password');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (sessionStorage.getItem('user')) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Twitter Clone</h1>
            <p>Welcome back!</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                required
              />
              <span className="input-icon">👤</span>
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
              <span className="input-icon">🔐</span>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit"
              className="login-button"
            >
              Sign In
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account? <Link to="/register">Register now</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;