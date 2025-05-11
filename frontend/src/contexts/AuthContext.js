// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(authService.getCurrentAdmin());
  const [loading, setLoading] = useState(false); // To manage loading state during login
  const [error, setError] = useState(null);     // To manage login errors
  const navigate = useNavigate();

  // Effect to check if adminInfo changes (e.g., on initial load)
  useEffect(() => {
    const currentAdmin = authService.getCurrentAdmin();
    if (currentAdmin) {
      setAdminInfo(currentAdmin);
    }
  }, []);


  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setAdminInfo(data);
      setLoading(false);
      navigate('/dashboard'); // Navigate to dashboard on successful login
      return data; // Return data for potential further use
    } catch (err) {
      // err is expected to be the error object from authService
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
      throw err; // Re-throw to be caught by the calling component if needed
    }
  };

  const logout = () => {
    authService.logout();
    setAdminInfo(null);
    navigate('/login'); // Navigate to login page on logout
  };

  const value = {
    adminInfo,
    isAuthenticated: !!adminInfo, // True if adminInfo exists (and has a token)
    loading,
    error,
    login,
    logout,
    clearError: () => setError(null), // Function to clear error messages
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};