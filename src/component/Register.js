import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'gray'
  });

  // Password strength validation
  const validatePasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    // Length check
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters');
    } else {
      score += 1;
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      feedback.push('Add uppercase letter');
    } else {
      score += 1;
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      feedback.push('Add lowercase letter');
    } else {
      score += 1;
    }

    // Number check
    if (!/[0-9]/.test(password)) {
      feedback.push('Add a number');
    } else {
      score += 1;
    }

    // Special character check
    if (!/[^A-Za-z0-9]/.test(password)) {
      feedback.push('Add special character');
    } else {
      score += 1;
    }

    // Determine strength message and color
    let strengthMessage = '';
    let strengthColor = '';

    if (score === 0 || score === 1) {
      strengthMessage = 'Weak';
      strengthColor = '#D46A6A'; // Error red
    } else if (score === 2 || score === 3) {
      strengthMessage = 'Moderate';
      strengthColor = '#E6A23C'; // Warning orange
    } else if (score === 4) {
      strengthMessage = 'Good';
      strengthColor = '#6BB187'; // Success green-ish
    } else {
      strengthMessage = 'Strong';
      strengthColor = '#67C23A'; // Success green
    }

    return {
      score,
      message: strengthMessage,
      feedback: feedback.join(', '),
      color: strengthColor,
      isStrong: score >= 3 // Consider password strong enough if score is at least 3
    };
  };

  // Email validation
  const validateEmail = (email) => {
    // Basic email regex pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check password strength when password field changes
    if (name === 'password') {
      setPasswordStrength(validatePasswordStrength(value));
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Validate password strength
    const passwordCheck = validatePasswordStrength(formData.password);
    if (!passwordCheck.isStrong) {
      setError(`Password is too weak. ${passwordCheck.feedback}`);
      setTimeout(() => setError(''), 4000);
      return;
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if username already exists
    if (existingUsers.some(user => user.username === formData.username)) {
      setError('Username already exists');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Check if email already exists
    if (existingUsers.some(user => user.email === formData.email)) {
      setError('Email already registered');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    // Create new user
    const newUser = {
      username: formData.username,
      password: formData.password,
      email: formData.email
    };
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
    
    // Set session for login
    sessionStorage.setItem('user', formData.username);
    
    // Redirect to dashboard
    setIsRegistered(true);
  };

  if (isRegistered) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join the conversation!</p>
          </div>
          
          <form onSubmit={handleRegister} className="register-form">
            <div className="input-group">
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                value={formData.username}
                onChange={handleChange}
                className="register-input"
                required
              />
              <span className="input-icon">👤</span>
            </div>
            
            <div className="input-group">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={formData.email}
                onChange={handleChange}
                className="register-input"
                required
              />
              <span className="input-icon">📧</span>
              {formData.email && !validateEmail(formData.email) && 
                <div className="input-feedback error">Please enter a valid email address</div>
              }
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                className="register-input"
                required
              />
              <span className="input-icon">🔐</span>
              {formData.password && 
                <div className="password-strength">
                  <div className="strength-text" style={{color: passwordStrength.color}}>
                    {passwordStrength.message}
                  </div>
                  <div className="strength-meter">
                    <div 
                      className="strength-meter-fill" 
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  {passwordStrength.score < 3 && formData.password && 
                    <div className="input-feedback">{passwordStrength.feedback}</div>
                  }
                </div>
              }
            </div>
            
            <div className="input-group">
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                className="register-input"
                required
              />
              <span className="input-icon">🔐</span>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && 
                <div className="input-feedback error">Passwords do not match</div>
              }
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit"
              className="register-button"
            >
              Create Account
            </button>
          </form>
          
          <div className="register-footer">
            <p>Already have an account? <Link to="/">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;