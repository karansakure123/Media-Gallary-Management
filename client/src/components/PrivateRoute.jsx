import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../authContext/authContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Only allow access to the route if the user is authenticated
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
