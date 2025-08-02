import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline, ThemeProvider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          p: 2,
        }}
      >
        <CssBaseline />
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            py: 4,
          }}
        >
          <Box
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: theme.shadows[3],
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="PERA Logo"
              sx={{
                width: 80,
                height: 80,
                mb: 3,
                display: 'block',
                mx: 'auto',
              }}
              onError={(e) => {
                e.target.onerror = null;
                // e.target.src = 'https://via.placeholder.com/80';
              }}
            />
            <Outlet />
          </Box>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <img
              src="/pera-logo-text.png"
              alt="Punjab Enforcement & Regularity Authority"
              style={{ maxWidth: '200px', height: 'auto' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <Box sx={{ mt: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
              © {new Date().getFullYear()} PERA. All rights reserved.
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;
