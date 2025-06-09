import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedPage from './pages/ProtectedPage';
import UpdateProfile from './pages/UpdateProfile';

// Protect route if token not found
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route 
          path="/update-profile" 
          element={
            <PrivateRoute>
              <UpdateProfile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/protected" 
          element={
            <PrivateRoute>
              <ProtectedPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;