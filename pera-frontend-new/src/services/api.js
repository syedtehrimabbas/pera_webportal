import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Requisition API
const getRequisitions = async (params = {}) => {
  const response = await api.get('/requisitions', { params });
  return response.data;
};

const getRequisition = async (id) => {
  const response = await api.get(`/requisitions/${id}`);
  return response.data;
};

const createRequisition = async (data) => {
  const response = await api.post('/requisitions', data);
  return response.data;
};

const updateRequisitionStatus = async (id, status, data = {}) => {
  const response = await api.put(`/requisitions/${id}/status`, { status, ...data });
  return response.data;
};

const deleteRequisition = async (id) => {
  const response = await api.delete(`/requisitions/${id}`);
  return response.data;
};

// User API
const getUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Resource API
const getVehicles = async (params = {}) => {
  const response = await api.get('/vehicles', { params });
  return response.data;
};

const getWeapons = async (params = {}) => {
  const response = await api.get('/weapons', { params });
  return response.data;
};

// Site API
const getStations = async (params = {}) => {
  const response = await api.get('/stations', { params });
  return response.data;
};

const apiService = {
  // Requisitions
  getRequisitions,
  getRequisition,
  createRequisition,
  updateRequisitionStatus,
  deleteRequisition,
  
  // Users
  getUsers,
  getUser,
  
  // Resources
  getVehicles,
  getWeapons,
  
  // Sites
  getStations,
};

export default apiService;
