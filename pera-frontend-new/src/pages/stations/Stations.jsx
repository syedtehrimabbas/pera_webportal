import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Stations = () => {
  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Police Stations
        </Typography>
        <Typography variant="body1">
          This is the police stations management page. It will contain the interface for managing police stations and their resources.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Stations;
