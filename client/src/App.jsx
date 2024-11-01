import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext/authContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import MediaGallery from './components/mediaGallery';
import Register from './components/Register';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserUploadImgs from './components/UserUploadImgs';
import ShapesLoader from './components/Shapes';

// PrivateRoute component to handle redirection based on auth status
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ShapesLoader></ShapesLoader>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/nav" element={<PrivateRoute><Navbar /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/media" element={<PrivateRoute><MediaGallery /></PrivateRoute>} />
          <Route path="/mediaupload" element={<PrivateRoute><UserUploadImgs /></PrivateRoute>} /> {/* Protect Media Upload route */}
          <Route path="/" element={<PrivateRoute><Navbar /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
