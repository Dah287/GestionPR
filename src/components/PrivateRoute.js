// src/components/PrivateRoute.js  (ou src/pages/PrivateRoute.js)
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // ✅ cohérent avec Login.js
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;