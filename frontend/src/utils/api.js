import axios from 'axios';

// Use relative URL for production (Vercel) or environment variable for development
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Navigation utility for programmatic routing without full page reload
let navigate = null;
export const setNavigate = (navigateFunction) => {
  navigate = navigateFunction;
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Use React Router navigation if available, otherwise fallback to window.location
      if (navigate) {
        navigate('/login', { replace: true });
      } else {
        // Fallback: use window.location.replace to avoid adding to history
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
