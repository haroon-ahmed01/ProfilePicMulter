import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const baseURL = import.meta.env.VITE_BASE_URL
    
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      const res = await axios.post(`${baseURL}/api/login`, { 
        email, 
        password 
      });
      
      localStorage.setItem('token', res.data.token);
      
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      alert('Login successful');
      window.location.href = '/protected';
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
        <div className="login-container">
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Login</h2>
            {errorMsg && <div className="error-message">{errorMsg}</div>}
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit">Login</button>
            <p className="login-link">
              Don't have an account? <Link to="/register">Sign up</Link>
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

export default Login;
