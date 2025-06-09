import React from 'react';
import { Link } from 'react-router-dom';
import './ProtectedPage.css';

function ProtectedPage() {
  return (
    <div className="protected-container">
      <header className="protected-header">
        <h1>Protected Page</h1>
        <p>You are logged in and viewing a protected page.</p>
        <Link to="/update-profile" className="update-profile-link">Update Profile</Link>
        <Link to="/" className="home-link">Go to Home</Link>
      </header>
    </div>
  );
}

export default ProtectedPage;