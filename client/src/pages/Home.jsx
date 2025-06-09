import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
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
            <div className="auth-links">
              <Link to="/login" className="login">Login</Link>
              <Link to="/register" className="signup">Signup</Link>
              <Link to="/update-profile">Update Profile</Link>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="content-wrapper">
        <h1>Welcome to MARQWON</h1>
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

export default Home;
