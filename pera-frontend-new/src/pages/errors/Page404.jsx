import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
          <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
            404
          </Typography>
          <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
            Oops! Page Not Found
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: '600px' }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none', px: 4, py: 1.5 }}
          >
            Go to Homepage
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Page404;
