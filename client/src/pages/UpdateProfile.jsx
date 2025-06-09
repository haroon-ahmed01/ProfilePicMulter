import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UpdateProfile.css';

function UpdateProfile() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const baseURL = import.meta.env.VITE_BASE_URL


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${baseURL}/api/protected`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUserData(response.data.user);
        if (response.data.user?.username) {
          setUsername(response.data.user.username);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpg' || file.type === 'image/png')) {
      setProfileImage(file);
      setError('');
    } else if (file) {
      setError('Only .jpg and .png files are allowed');
      e.target.value = null; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in');
        return;
      }

      const formData = new FormData();
      if (username) formData.append('username', username);
      if (profileImage) formData.append('profileImage', profileImage);

      const response = await axios.put(
        `${baseURL}/api/update-profile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(response.data.message || 'Profile updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Profile Settings</h1>
        
        <div className="profile-form-container">
          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                minLength="3"
                maxLength="20"
              />
            </div>
            
            <div className="form-group file-input-group">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="file-input"
                id="profile-image-input"
              />
              <label htmlFor="profile-image-input" className="file-label">
                {profileImage ? profileImage.name : 'Choose file'}
              </label>
              <span className="file-info">{!profileImage && 'No file chosen'}</span>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
            
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
        
        <div className="navigation-links">
          <Link to="/" className="home-link">Go to Home</Link>
        </div>
      </header>
    </div>
  );
}

export default UpdateProfile;