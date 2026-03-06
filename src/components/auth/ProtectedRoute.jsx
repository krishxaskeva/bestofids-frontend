import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Protects routes that require login (Profile).
 * If not logged in, redirects to login with return URL in state.
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location, message: 'Please login to access this content.' }} replace />;
  }

  return children;
}
