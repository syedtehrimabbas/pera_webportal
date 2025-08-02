import React from 'react';
import { Box, Typography, Paper, Avatar, Button } from '@mui/material';

const Profile = () => {
  // Mock user data - replace with actual user data from context/API
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    designation: 'Enforcement Officer',
    department: 'Traffic Police',
    station: 'Central Police Station',
    phone: '+1 234 567 8900',
    joinDate: 'January 2022',
  };

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 120, 
              height: 120, 
              fontSize: '3rem',
              mr: 3
            }}
          >
            {user.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1">
              {user.name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {user.designation}
            </Typography>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ mt: 1 }}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              Personal Information
            </Typography>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">Full Name</Typography>
              <Typography>{user.name}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">Email Address</Typography>
              <Typography>{user.email}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">Phone Number</Typography>
              <Typography>{user.phone}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              Work Information
            </Typography>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">Designation</Typography>
              <Typography>{user.designation}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">Department</Typography>
              <Typography>{user.department}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">Station</Typography>
              <Typography>{user.station}</Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary">Member Since</Typography>
              <Typography>{user.joinDate}</Typography>
            </Box>
          </Box>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
            Account Settings
          </Typography>
          <Button variant="outlined" color="primary" sx={{ mr: 2 }}>
            Change Password
          </Button>
          <Button variant="outlined" color="error">
            Deactivate Account
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
