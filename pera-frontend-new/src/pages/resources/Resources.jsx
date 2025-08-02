import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Resources = () => {
  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Resources Management
        </Typography>
        <Typography variant="body1">
          This is the resources management page. It will contain the interface for managing vehicles, weapons, and other resources.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Resources;
