import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
