// frontend/src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API base URL
  // timeout: 10000, // Optional: 10 second timeout
  // headers: { 'Content-Type': 'application/json' } // Default, can be overridden
});

// Interceptor to add JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const adminInfo = localStorage.getItem('adminInfo')
      ? JSON.parse(localStorage.getItem('adminInfo'))
      : null;

    if (adminInfo && adminInfo.token) {
      config.headers['Authorization'] = `Bearer ${adminInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;