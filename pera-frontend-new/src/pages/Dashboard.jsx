import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  DirectionsCar as VehicleIcon,
  Security as WeaponIcon,
  Person as PersonIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import api from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingRequisitions: 0,
    approvedRequisitions: 0,
    availableVehicles: 0,
    availableWeapons: 0,
    recentRequisitions: [],
    requisitionStats: { labels: [], data: [] },
    resourceUtilization: { labels: [], data: [] },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        const mockData = {
          pendingRequisitions: 5,
          approvedRequisitions: 12,
          availableVehicles: 8,
          availableWeapons: 15,
          recentRequisitions: [
            { id: 1, type: 'Surveillance', location: 'Lahore', status: 'pending', date: '2023-06-15' },
            { id: 2, type: 'Raid', location: 'Islamabad', status: 'approved', date: '2023-06-14' },
            { id: 3, type: 'Inspection', location: 'Karachi', status: 'completed', date: '2023-06-10' },
          ],
          requisitionStats: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [12, 19, 3, 5, 2, 3],
          },
          resourceUtilization: {
            labels: ['Vehicles', 'Weapons', 'Personnel'],
            data: [65, 80, 45],
          },
        };
        
        setStats(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'primary';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const requisitionChartData = {
    labels: stats.requisitionStats.labels,
    datasets: [
      {
        label: 'Requisitions',
        data: stats.requisitionStats.data,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 1,
      },
    ],
  };

  const resourceChartData = {
    labels: stats.resourceUtilization.labels,
    datasets: [
      {
        label: 'Utilization %',
        data: stats.resourceUtilization.data,
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
        ],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.secondary.dark,
          theme.palette.info.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome back! Here's what's happening with PERA System today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Pending Requisitions
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.pendingRequisitions}
                  </Typography>
                </div>
                <Avatar sx={{ bgcolor: theme.palette.warning.light }}>
                  <AssignmentIcon />
                </Avatar>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/requisitions?status=pending')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Approved Requisitions
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.approvedRequisitions}
                  </Typography>
                </div>
                <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                  <AssignmentIcon />
                </Avatar>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/requisitions?status=approved')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Available Vehicles
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.availableVehicles}
                  </Typography>
                </div>
                <Avatar sx={{ bgcolor: theme.palette.info.light }}>
                  <VehicleIcon />
                </Avatar>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/resources?type=vehicles')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                  <Typography color="textSecondary" gutterBottom>
                    Available Weapons
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.availableWeapons}
                  </Typography>
                </div>
                <Avatar sx={{ bgcolor: theme.palette.error.light }}>
                  <WeaponIcon />
                </Avatar>
              </Box>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/resources?type=weapons')}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Requisitions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Requisitions</Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/requisitions')}
              >
                View All
              </Button>
            </Box>
            <List>
              {stats.recentRequisitions.map((req) => (
                <React.Fragment key={req.id}>
                  <ListItem 
                    button 
                    onClick={() => navigate(`/requisitions/${req.id}`)}
                    secondaryAction={
                      <Chip 
                        label={req.status.charAt(0).toUpperCase() + req.status.slice(1)} 
                        size="small"
                        color={getStatusColor(req.status)}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        <AssignmentIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={req.type} 
                      secondary={`${req.location} • ${new Date(req.date).toLocaleDateString()}`}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Requisition Trends</Typography>
            <Box sx={{ height: 250 }}>
              <Line 
                data={requisitionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Resource Utilization</Typography>
            <Box sx={{ height: 250 }}>
              <Bar 
                data={resourceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (value) => `${value}%`,
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Quick Actions</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/requisitions/create')}
              sx={{ py: 2 }}
            >
              New Requisition
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => navigate('/profile')}
              sx={{ py: 2 }}
            >
              View Profile
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
