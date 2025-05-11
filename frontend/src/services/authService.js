// frontend/src/services/authService.js
import axiosInstance from '../api/axiosInstance';

const API_URL = '/auth/'; // Base path for auth routes from axiosInstance

// Login admin
const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_URL + 'login', {
      email,
      password,
    });
    if (response.data && response.data.token) {
      // Store user info (including token) in local storage
      localStorage.setItem('adminInfo', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    // Throw an error that can be caught by the calling component
    // The error.response.data will contain the message from the backend
    throw error.response && error.response.data
      ? error.response.data
      : new Error('Login failed. Please try again.');
  }
};

// Logout admin
const logout = () => {
  localStorage.removeItem('adminInfo');
  // Optionally, you could also make an API call to a /logout endpoint
  // on the backend to invalidate the token on the server-side if implemented.
};

// Get current user info from local storage
const getCurrentAdmin = () => {
  return JSON.parse(localStorage.getItem('adminInfo'));
};

// (Optional) Register admin - useful for initial setup if you don't want to use Postman
// const register = async (email, password) => {
//   try {
//     const response = await axiosInstance.post(API_URL + 'register', {
//       email,
//       password,
//     });
//     if (response.data && response.data.token) {
//       localStorage.setItem('adminInfo', JSON.stringify(response.data));
//     }
//     return response.data;
//   } catch (error) {
//     throw error.response && error.response.data
//       ? error.response.data
//       : new Error('Registration failed.');
//   }
// };

const authService = {
  login,
  logout,
  getCurrentAdmin,
  // register,
};

export default authService;