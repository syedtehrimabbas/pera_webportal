import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Requisitions from './pages/requisitions/Requisitions';
import RequisitionDetail from './pages/requisitions/RequisitionDetail';
import CreateRequisition from './pages/requisitions/CreateRequisition';
import Resources from './pages/resources/Resources';
import Stations from './pages/stations/Stations';
import Profile from './pages/profile/Profile';
import Page404 from './pages/errors/Page404';

// Protected Route Component
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user.designation)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// App component
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <Router>
          <AuthProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<Page404 />} />
            </Route>

            {/* Protected Routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Requisition Routes */}
              <Route path="requisitions" element={<Requisitions />} />
              <Route path="requisitions/create" element={<CreateRequisition />} />
              <Route path="requisitions/:id" element={<RequisitionDetail />} />
              
              {/* Resource Management */}
              <Route 
                path="resources" 
                element={
                  <ProtectedRoute roles={['admin', 'sdo']}>
                    <Resources />
                  </ProtectedRoute>
                } 
              />
              
              {/* Station Management */}
              <Route 
                path="stations" 
                element={
                  <ProtectedRoute roles={['admin']}>
                    <Stations />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Profile */}
              <Route path="profile" element={<Profile />} />
              
              {/* Redirect root to dashboard */}
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
