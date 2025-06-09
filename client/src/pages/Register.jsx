import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const baseURL = import.meta.env.VITE_BASE_URL;

  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const res = await axios.post(`${baseURL}/api/register`, { 
        email, 
        password,
        username
      });
      alert('Registration successful! Please login.');
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };
  
  return (
    <div className="page-container">
      <header className="landing-header">
        <nav className="navbar">
          <div className="logo">
            <h1>Marqwon Dynamic</h1>
          </div>
          <div className="nav-group">
            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="content-wrapper">
        <div className="register-container">
          <form className="register-form" onSubmit={handleRegister}>
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required
              minLength={3}
              maxLength={20}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <button type="submit">Register</button>
            <p className="login-link">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </main>
      
      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; 2025 Marqwon Dynamic. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link> | <Link to="/terms">Terms</Link> | <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Register;
