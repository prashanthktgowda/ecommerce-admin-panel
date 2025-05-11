// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation(); // To remember where the user was trying to go

  // If still checking auth status (e.g., initial load, though our context handles this quickly)
  // You might add a more sophisticated loading check in useAuth if needed for async auth checks
  if (loading && !isAuthenticated) { // Added !isAuthenticated to avoid flicker if already auth
    return <div>Loading authentication status...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If `children` prop is provided, render that (useful for wrapping layout components)
  // Otherwise, render the <Outlet /> for nested routes.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;