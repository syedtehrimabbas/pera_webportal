import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as authLogin, register as authRegister, getCurrentUser } from '../services/authService';

const isDevelopment = process.env.NODE_ENV === 'development';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isDevelopment) {
          // Auto-login with admin user in development
          const devUser = {
            _id: 'dev-user-id',
            name: 'Development Admin',
            email: 'admin@pera.com',
            designation: 'admin',
            role: 'admin'
          };
          setUser(devUser);
          localStorage.setItem('token', 'dev-token');
          setToken('dev-token');
          navigate('/dashboard');
        } else {
          const storedToken = localStorage.getItem('token');
          if (storedToken) {
            const userData = await getCurrentUser(storedToken);
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (!isDevelopment) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      
      if (isDevelopment) {
        // Auto-login in development
        const devUser = {
          _id: 'dev-user-id',
          name: 'Development Admin',
          email: email || 'admin@pera.com',
          designation: 'admin',
          role: 'admin'
        };
        localStorage.setItem('token', 'dev-token');
        setToken('dev-token');
        setUser(devUser);
        navigate('/dashboard');
        return;
      }
      
      const { user: userData, token: authToken } = await authLogin(email, password);
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
      
      // Redirect based on user role
      if (userData.designation === 'admin' || userData.designation === 'sdo') {
        navigate('/dashboard');
      } else {
        navigate('/requisitions');
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
      return { success: false, error: error.message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const { user: newUser, token: authToken } = await authRegister(userData);
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(newUser);
      
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    if (user.designation === 'admin') return true;
    return user.designation === requiredRole;
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        error,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
