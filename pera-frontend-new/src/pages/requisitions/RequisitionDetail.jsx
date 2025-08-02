import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, Paper, Grid, Divider, List, ListItem, ListItemText, 
  ListItemIcon, Chip, Avatar, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Tabs, Tab, IconButton, Snackbar, Alert, CircularProgress,
  ListItemAvatar, FormControl, InputLabel, Select, MenuItem, FormHelperText,
  DialogContentText
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import { useSnackbar } from 'notistack';
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  History as HistoryIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon
} from '@mui/icons-material';

// Helper function to get status color
const getStatusColor = (status) => {
  const statusColors = {
    draft: 'default',
    submitted: 'info',
    under_review: 'primary',
    needs_revision: 'warning',
    resubmitted: 'info',
    approved: 'success',
    in_progress: 'secondary',
    completed: 'success',
    rejected: 'error',
    cancelled: 'error',
    archived: 'default'
  };
  return statusColors[status] || 'default';
};

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'PPpp');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Accessibility props for tabs
const a11yProps = (index) => ({
  id: `simple-tab-${index}`,
  'aria-controls': `simple-tabpanel-${index}`,
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const RequisitionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [requisition, setRequisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [comment, setComment] = useState('');
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [submitting, setSubmitting] = useState(false);
  
  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Status update form
  const statusUpdateForm = useFormik({
    initialValues: {
      status: '',
      note: ''
    },
    validationSchema: Yup.object({
      status: Yup.string().required('Status is required'),
      note: Yup.string()
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // TODO: Replace with actual API call
        console.log('Updating status:', values);
        
        // Update local state
        const statusUpdate = {
          id: `h${Date.now()}`,
          action: 'status_update',
          status: values.status,
          user: { id: 'current-user', name: 'Current User', designation: 'EO' },
          timestamp: new Date().toISOString(),
          comment: values.note || `Status changed to ${values.status}`,
        };
        
        setRequisition(prev => ({
          ...prev,
          status: values.status,
          history: [...(prev.history || []), statusUpdate]
        }));
        
        handleStatusDialogClose();
        enqueueSnackbar('Status updated successfully', { variant: 'success' });
      } catch (error) {
        console.error('Error updating status:', error);
        enqueueSnackbar('Failed to update status', { variant: 'error' });
      } finally {
        setSubmitting(false);
      }
    }
  });
  
  // Handle delete requisition
  const handleDeleteRequisition = async () => {
    try {
      setSubmitting(true);
      // TODO: Replace with actual API call
      console.log('Deleting requisition:', id);
      setDeleteDialogOpen(false);
      enqueueSnackbar('Requisition deleted successfully', { variant: 'success' });
      navigate('/requisitions');
    } catch (error) {
      console.error('Error deleting requisition:', error);
      enqueueSnackbar('Failed to delete requisition', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // Define VehicleIcon and WeaponIcon components
  const VehicleIcon = DirectionsCarIcon;
  const WeaponIcon = LocalPoliceIcon;

  // Mock data - replace with API call
  useEffect(() => {
    const fetchRequisition = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await api.get(`/api/requisitions/${id}`);
        // setRequisition(response.data);
        
        // Mock data for now
        setRequisition({
          id: id,
          operationType: 'Raid',
          description: 'Raid on suspected illegal construction site',
          status: 'pending',
          urgency: 'high',
          sensitivity: 'sensitive',
          location: '123 Main St, City',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          requestedBy: { id: '1', name: 'John Doe', designation: 'IO' },
          assignedTeam: [
            { id: '2', name: 'Jane Smith', designation: 'EO' },
            { id: '3', name: 'Robert Johnson', designation: 'Constable' },
          ],
          assignedVehicles: [
            { id: 'v1', registrationNumber: 'ABC-123', type: 'Patrol Car' },
          ],
          assignedWeapons: [
            { id: 'w1', serialNumber: 'SN12345', type: 'Pistol' },
          ],
          notes: 'Special instructions for the team',
          attachments: [],
          history: [
            {
              id: 'h1',
              action: 'created',
              user: { name: 'John Doe', designation: 'IO' },
              timestamp: new Date().toISOString(),
              comment: 'Requisition created',
            },
          ],
          comments: [],
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load requisition details');
        setLoading(false);
      }
    };

    fetchRequisition();
  }, [id]);

  const getAvailableStatusOptions = () => {
    if (!requisition) return [];
    
    const statusFlow = {
      draft: ['submitted', 'cancelled'],
      submitted: ['under_review', 'cancelled'],
      under_review: ['approved', 'rejected', 'needs_revision'],
      needs_revision: ['resubmitted', 'cancelled'],
      resubmitted: ['under_review', 'approved', 'rejected'],
      approved: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
      completed: ['archived'],
      rejected: ['draft'],
      cancelled: ['draft'],
      archived: []
    };
    
    return statusFlow[requisition.status] || [];
  };

  const availableStatusOptions = getAvailableStatusOptions();

  const canEdit = () => {
    if (!requisition) return false;
    // Only allow editing if status is draft, needs_revision, or rejected
    return ['draft', 'needs_revision', 'rejected'].includes(requisition.status);
  };

  const canDelete = () => {
    if (!requisition) return false;
    // Only allow deletion if status is draft or cancelled
    return ['draft', 'cancelled'].includes(requisition.status);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // TODO: Replace with actual API call
    const newComment = {
      id: `c${Date.now()}`,
      user: { id: 'current-user', name: 'Current User', designation: 'EO' },
      timestamp: new Date().toISOString(),
      text: comment,
    };
    
    setRequisition(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
    
    setComment('');
    setSnackbar({ open: true, message: 'Comment added successfully', severity: 'success' });
  };

  const handleStatusDialogOpen = () => {
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
    statusUpdateForm.resetForm();
  };

  const handleStatusUpdate = async () => {
    if (!statusUpdateForm.values.status) return;
    
    try {
      setSubmitting(true);
      // TODO: Replace with actual API call
      const statusUpdate = {
        id: `h${Date.now()}`,
        action: 'status_update',
        status: statusUpdateForm.values.status,
        user: { id: 'current-user', name: 'Current User', designation: 'EO' },
        timestamp: new Date().toISOString(),
        comment: statusUpdateForm.values.note || `Status changed to ${statusUpdateForm.values.status}`,
      };
      
      setRequisition(prev => ({
        ...prev,
        status: statusUpdateForm.values.status,
        history: [...(prev.history || []), statusUpdate]
      }));
      
      handleStatusDialogClose();
      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' });
    } catch (error) {
      console.error('Error updating status:', error);
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleStatusUpdateChange = (event) => {
    statusUpdateForm.setFieldValue('status', event.target.value);
  };

  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // TODO: Replace with actual API call
    console.log('Deleting requisition:', id);
    // Simulate API call
    setTimeout(() => {
      setSnackbar({ open: true, message: 'Requisition deleted successfully', severity: 'success' });
      navigate('/requisitions');
    }, 1000);
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!requisition) {
    return (
      <Box p={3}>
        <Alert severity="warning">Requisition not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with back button and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => navigate('/requisitions')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Requisition: {requisition.id}
          </Typography>
        </Box>
        
        <Box>
          {canEdit() && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/requisitions/${id}/edit`)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
          )}
          
          {canDelete() && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteDialogOpen}
              sx={{ mr: 1 }}
            >
              Delete
            </Button>
          )}
          
          {availableStatusOptions.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
              onClick={handleStatusDialogOpen}
            >
              Update Status
            </Button>
          )}
        </Box>
      </Box>

      {/* Status and basic info */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                {requisition.operationType.charAt(0).toUpperCase() + requisition.operationType.slice(1).replace('_', ' ')}
              </Typography>
              <Chip 
                label={requisition.status.replace('_', ' ')}
                color={getStatusColor(requisition.status)}
                size="small"
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
            
            <Typography variant="body1" paragraph>
              {requisition.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Chip 
                icon={<AccessTimeIcon />}
                label={`Urgency: ${requisition.urgency}`}
                color={
                  requisition.urgency === 'high' || requisition.urgency === 'critical' 
                    ? 'error' 
                    : requisition.urgency === 'medium' 
                      ? 'warning' 
                      : 'default'
                }
                variant="outlined"
                size="small"
              />
              <Chip 
                label={`Sensitivity: ${requisition.sensitivity}`}
                variant="outlined"
                size="small"
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Location</Typography>
                <Typography variant="body1">{requisition.location}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Start Time</Typography>
                <Typography variant="body1">{formatDate(requisition.startTime)}</Typography>
              </Grid>
              {requisition.endTime && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">End Time</Typography>
                  <Typography variant="body1">{formatDate(requisition.endTime)}</Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Requested By</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <PersonIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {requisition.requestedBy.name} ({requisition.requestedBy.designation.toUpperCase()})
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Team Members</Typography>
            <List dense>
              {requisition.assignedTeam.length > 0 ? (
                requisition.assignedTeam.map((member) => (
                  <ListItem key={member.id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemAvatar sx={{ minWidth: 36 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={member.name}
                      secondary={member.designation.toUpperCase()}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No team members assigned</Typography>
              )}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>Assigned Resources</Typography>
            
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
              <VehicleIcon fontSize="small" sx={{ mr: 1 }} />
              Vehicles
            </Typography>
            <List dense>
              {requisition.assignedVehicles.length > 0 ? (
                requisition.assignedVehicles.map((vehicle) => (
                  <ListItem key={vehicle.id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={`${vehicle.type} (${vehicle.registrationNumber})`}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ pl: 4 }}>No vehicles assigned</Typography>
              )}
            </List>
            
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
              <WeaponIcon fontSize="small" sx={{ mr: 1 }} />
              Weapons
            </Typography>
            <List dense>
              {requisition.assignedWeapons.length > 0 ? (
                requisition.assignedWeapons.map((weapon) => (
                  <ListItem key={weapon.id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText 
                      primary={`${weapon.type} (${weapon.serialNumber})`}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary" sx={{ pl: 4 }}>No weapons assigned</Typography>
              )}
            </List>
            
            {requisition.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Additional Notes
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {requisition.notes}
                  </Typography>
                </Box>
              </>
            )}
            
            {requisition.attachments && requisition.attachments.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Attachments
                  </Typography>
                  <List dense>
                    {requisition.attachments.map((file) => (
                      <ListItem 
                        key={file.id} 
                        button 
                        component="a" 
                        href={`#/attachments/${file.id}`} // Replace with actual attachment URL
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ py: 0.5 }}
                      >
                        <ListItemAvatar sx={{ minWidth: 32 }}>
                          <AttachFileIcon fontSize="small" color="action" />
                        </ListItemAvatar>
                        <ListItemText 
                          primary={file.name}
                          secondary={file.size}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tabs for History and Comments */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="History" icon={<HistoryIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label={`Comments (${requisition.comments?.length || 0})`} icon={<CommentIcon />} iconPosition="start" {...a11yProps(1)} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <List>
            {requisition.history.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {item.user.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography component="span" variant="subtitle2">
                          {item.user.name} ({item.user.designation.toUpperCase()})
                        </Typography>
                        {' '}
                        <Typography component="span" variant="body2" color="textSecondary">
                          {formatDate(item.timestamp)}
                        </Typography>
                      </>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {item.action === 'status_updated' ? (
                            <>
                              Status changed to{' '}
                              <Chip 
                                label={item.status.replace('_', ' ')}
                                color={getStatusColor(item.status)}
                                size="small"
                                sx={{ height: 20, fontSize: '0.7rem' }}
                              />
                            </>
                          ) : item.action === 'created' ? (
                            'Requisition created'
                          ) : (
                            item.action
                          )}
                        </Typography>
                        {item.comment && (
                          <Box component="div" sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.primary">
                              {item.comment}
                            </Typography>
                          </Box>
                        )}
                      </>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              error={!!errors.comment}
              helperText={errors.comment}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={!comment.trim()}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
          
          {requisition.comments.length > 0 ? (
            <List>
              {requisition.comments.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start" disablePadding sx={{ mb: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {item.user.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography component="span" variant="subtitle2">
                            {item.user.name} ({item.user.designation.toUpperCase()})
                          </Typography>
                          {' '}
                          <Typography component="span" variant="body2" color="textSecondary">
                            {formatDate(item.timestamp)}
                          </Typography>
                        </>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {item.text}
                        </Typography>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <CommentIcon color="action" fontSize="large" />
              <Typography variant="subtitle1" color="textSecondary">
                No comments yet
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Be the first to comment
              </Typography>
            </Box>
          )}
        </TabPanel>
      </Paper>
      
      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose} maxWidth="sm" fullWidth>
        <form onSubmit={statusUpdateForm.handleSubmit}>
          <DialogTitle>Update Requisition Status</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update the status of this requisition. This action will be recorded in the history.
            </DialogContentText>
            
            <Box sx={{ mt: 2 }}>
              <FormControl 
                fullWidth 
                error={statusUpdateForm.touched.status && Boolean(statusUpdateForm.errors.status)}
                sx={{ mb: 2 }}
              >
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status"
                  name="status"
                  value={statusUpdateForm.values.status}
                  onChange={statusUpdateForm.handleChange}
                  onBlur={statusUpdateForm.handleBlur}
                  label="Status"
                >
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="under_review">Under Review</MenuItem>
                  <MenuItem value="needs_revision">Needs Revision</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
                {statusUpdateForm.touched.status && statusUpdateForm.errors.status && (
                  <FormHelperText>{statusUpdateForm.errors.status}</FormHelperText>
                )}
              </FormControl>
              
              <TextField
                margin="normal"
                fullWidth
                multiline
                rows={3}
                id="note"
                name="note"
                label="Note (Optional)"
                value={statusUpdateForm.values.note}
                onChange={statusUpdateForm.handleChange}
                onBlur={statusUpdateForm.handleBlur}
                placeholder="Add a note about this status change..."
                error={statusUpdateForm.touched.note && Boolean(statusUpdateForm.errors.note)}
                helperText={statusUpdateForm.touched.note && statusUpdateForm.errors.note}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              type="button" 
              onClick={handleStatusDialogClose} 
              color="inherit"
              disabled={statusUpdateForm.isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="contained" 
              color="primary"
              disabled={!statusUpdateForm.dirty || statusUpdateForm.isSubmitting}
            >
              {statusUpdateForm.isSubmitting ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Requisition</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this requisition? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            color="inherit"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteRequisition} 
            color="error" 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequisitionDetail;
