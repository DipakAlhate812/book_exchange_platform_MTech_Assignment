// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  // Check if the user is authenticated (e.g., check if a token exists in localStorage)
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the element (protected component)
  return element;
};

export default ProtectedRoute;
