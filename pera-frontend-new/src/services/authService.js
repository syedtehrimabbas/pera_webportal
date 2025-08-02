import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Set auth token for axios requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Login user
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token, user } = response.data;
    
    // Set auth token in axios headers
    setAuthToken(token);
    
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
  }
};

// Register new user
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, user } = response.data;
    
    // Set auth token in axios headers
    setAuthToken(token);
    
    return { user, token };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

// Get current user
const getCurrentUser = async (token) => {
  try {
    // Set auth token if provided
    if (token) {
      setAuthToken(token);
    }
    
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  } catch (error) {
    // Clear token if request fails
    setAuthToken(null);
    localStorage.removeItem('token');
    throw new Error('Session expired. Please login again.');
  }
};

export { login, register, getCurrentUser, setAuthToken };
