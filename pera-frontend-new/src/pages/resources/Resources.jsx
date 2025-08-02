import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Search as SearchIcon,
  LocalPolice as WeaponIcon,
  DirectionsCar as VehicleIcon,
  Shield as EquipmentIcon,
  CheckCircle as AvailableIcon,
  Cancel as UnavailableIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import api from '../../services/api';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resource-tabpanel-${index}`}
      aria-labelledby={`resource-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Resource types
const RESOURCE_TYPES = {
  VEHICLES: 'vehicles',
  WEAPONS: 'weapons',
  EQUIPMENT: 'equipment'
};

const Resources = () => {
  const [tabValue, setTabValue] = useState(0);
  const [resources, setResources] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [dialogType, setDialogType] = useState('add');
  const { enqueueSnackbar } = useSnackbar();

  // Get current resource type based on selected tab
  const getResourceType = () => {
    switch (tabValue) {
      case 0: return RESOURCE_TYPES.VEHICLES;
      case 1: return RESOURCE_TYPES.WEAPONS;
      case 2: return RESOURCE_TYPES.EQUIPMENT;
      default: return RESOURCE_TYPES.VEHICLES;
    }
  };

  // Fetch resources with better error handling
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const resourceType = getResourceType();
      let data = [];
      
      switch (resourceType) {
        case RESOURCE_TYPES.VEHICLES:
          data = await api.getVehicles();
          break;
        case RESOURCE_TYPES.WEAPONS:
          data = await api.getWeapons();
          break;
        case RESOURCE_TYPES.EQUIPMENT:
          // TODO: Implement equipment API
          data = [];
          break;
        default:
          data = [];
      }
      
      setResources(prev => ({
        ...prev,
        [resourceType]: data
      }));
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources. Please try again later.');
      enqueueSnackbar('Failed to load resources', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Open add/edit dialog
  const handleOpenDialog = (type, resource = null) => {
    setDialogType(type);
    setCurrentResource(resource || {
      name: '',
      type: '',
      status: 'available',
      details: {}
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentResource(null);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setCurrentResource(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle detail input changes
  const handleDetailChange = (field, value) => {
    setCurrentResource(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  };

  // Save resource
  const handleSaveResource = async () => {
    try {
      // TODO: Implement save/update API calls
      enqueueSnackbar(
        `${dialogType === 'add' ? 'Added' : 'Updated'} resource successfully`,
        { variant: 'success' }
      );
      fetchResources();
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar(
        `Failed to ${dialogType === 'add' ? 'add' : 'update'} resource`,
        { variant: 'error' }
      );
      console.error('Error saving resource:', error);
    }
  };

  // Delete resource
  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        // TODO: Implement delete API call
        enqueueSnackbar('Resource deleted successfully', { variant: 'success' });
        fetchResources();
      } catch (error) {
        enqueueSnackbar('Failed to delete resource', { variant: 'error' });
        console.error('Error deleting resource:', error);
      }
    }
  };

  // Filter resources based on search term
  const filteredResources = (resources[getResourceType()] || []).filter(resource => {
    const searchLower = searchTerm.toLowerCase();
    return (
      resource.name.toLowerCase().includes(searchLower) ||
      resource.type?.toLowerCase().includes(searchLower) ||
      resource.status.toLowerCase().includes(searchLower) ||
      JSON.stringify(resource.details || {}).toLowerCase().includes(searchLower)
    );
  });

  // Fetch resources when tab changes
  useEffect(() => {
    fetchResources();
  }, [tabValue]);

  // Get columns based on resource type
  const getColumns = () => {
    const resourceType = getResourceType();
    
    const baseColumns = [
      { id: 'name', label: 'Name' },
      { id: 'type', label: 'Type' },
      { 
        id: 'status', 
        label: 'Status',
        format: (value) => (
          <Chip
            icon={value === 'available' ? <AvailableIcon /> : <UnavailableIcon />}
            label={value}
            color={value === 'available' ? 'success' : 'error'}
            size="small"
          />
        )
      },
      { id: 'actions', label: 'Actions', align: 'right' }
    ];

    switch (resourceType) {
      case RESOURCE_TYPES.VEHICLES:
        return [
          ...baseColumns,
          { id: 'registration', label: 'Registration' },
          { id: 'model', label: 'Model' },
          { id: 'capacity', label: 'Capacity' }
        ];
      case RESOURCE_TYPES.WEAPONS:
        return [
          ...baseColumns,
          { id: 'serialNumber', label: 'Serial Number' },
          { id: 'caliber', label: 'Caliber' },
          { id: 'assignedTo', label: 'Assigned To' }
        ];
      case RESOURCE_TYPES.EQUIPMENT:
        return [
          ...baseColumns,
          { id: 'category', label: 'Category' },
          { id: 'condition', label: 'Condition' },
          { id: 'location', label: 'Location' }
        ];
      default:
        return baseColumns;
    }
  };

  // Get icon for resource type
  const getResourceIcon = () => {
    switch (getResourceType()) {
      case RESOURCE_TYPES.VEHICLES:
        return <VehicleIcon />;
      case RESOURCE_TYPES.WEAPONS:
        return <WeaponIcon />;
      case RESOURCE_TYPES.EQUIPMENT:
        return <EquipmentIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button 
            color="inherit" 
            size="small" 
            onClick={fetchResources}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="resource tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<VehicleIcon />} 
            iconPosition="start"
            label="Vehicles" 
          />
          <Tab 
            icon={<WeaponIcon />} 
            iconPosition="start"
            label="Weapons" 
          />
          <Tab 
            icon={<EquipmentIcon />} 
            iconPosition="start"
            label="Equipment" 
          />
        </Tabs>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            {getResourceType().charAt(0).toUpperCase() + getResourceType().slice(1)} Management
          </Typography>
          <Box>
            <TextField
              size="small"
              placeholder={`Search ${getResourceType()}...`}
              value={searchTerm}
              onChange={handleSearch}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mr: 2, minWidth: 250 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              disabled={isLoading}
            >
              Add {getResourceType().slice(0, -1)}
            </Button>
          </Box>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" p={6}>
            <CircularProgress />
          </Box>
        ) : filteredResources.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            p={6}
            textAlign="center"
          >
            <Box 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'action.hover', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              {getResourceIcon()}
            </Box>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No {getResourceType()} found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2, maxWidth: 400 }}>
              {searchTerm 
                ? 'No resources match your search. Try different keywords.'
                : `You don't have any ${getResourceType()} yet. Click the button above to add one.`
              }
            </Typography>
            {!searchTerm && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={{ mt: 2 }}
              >
                Add {getResourceType().slice(0, -1)}
              </Button>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {getColumns().map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id} hover>
                    {getColumns().map((column) => {
                      if (column.id === 'actions') {
                        return (
                          <TableCell key="actions" align="right">
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog('edit', resource)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteResource(resource.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        );
                      }
                      
                      const value = column.id in resource.details 
                        ? resource.details[column.id]
                        : resource[column.id];
                      
                      return (
                        <TableCell key={column.id}>
                          {column.format ? column.format(value) : value || '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'add' ? 'Add New ' : 'Edit '}
          {getResourceType().slice(0, -1)}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Name"
              value={currentResource?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="Type"
              value={currentResource?.type || ''}
              onChange={(e) => handleInputChange('type', e.target.value)}
              select
              sx={{ mb: 2 }}
            >
              {getResourceType() === RESOURCE_TYPES.VEHICLES && [
                <MenuItem key="patrol" value="Patrol Car">Patrol Car</MenuItem>,
                <MenuItem key="motorcycle" value="Motorcycle">Motorcycle</MenuItem>,
                <MenuItem key="van" value="Van">Van</MenuItem>,
                <MenuItem key="suv" value="SUV">SUV</MenuItem>,
              ]}
              {getResourceType() === RESOURCE_TYPES.WEAPONS && [
                <MenuItem key="pistol" value="Pistol">Pistol</MenuItem>,
                <MenuItem key="rifle" value="Rifle">Rifle</MenuItem>,
                <MenuItem key="shotgun" value="Shotgun">Shotgun</MenuItem>,
                <MenuItem key="smg" value="Submachine Gun">Submachine Gun</MenuItem>,
              ]}
              {getResourceType() === RESOURCE_TYPES.EQUIPMENT && [
                <MenuItem key="communication" value="Communication">Communication</MenuItem>,
                <MenuItem key="protection" value="Protection">Protection</MenuItem>,
                <MenuItem key="surveillance" value="Surveillance">Surveillance</MenuItem>,
                <MenuItem key="other" value="Other">Other</MenuItem>,
              ]}
            </TextField>

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={currentResource?.status || 'available'}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="in-use">In Use</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
                <MenuItem value="out-of-service">Out of Service</MenuItem>
              </Select>
            </FormControl>

            {getResourceType() === RESOURCE_TYPES.VEHICLES && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Registration Number"
                  value={currentResource?.details?.registration || ''}
                  onChange={(e) => handleDetailChange('registration', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Model"
                  value={currentResource?.details?.model || ''}
                  onChange={(e) => handleDetailChange('model', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  type="number"
                  label="Capacity"
                  value={currentResource?.details?.capacity || ''}
                  onChange={(e) => handleDetailChange('capacity', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {getResourceType() === RESOURCE_TYPES.WEAPONS && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Serial Number"
                  value={currentResource?.details?.serialNumber || ''}
                  onChange={(e) => handleDetailChange('serialNumber', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Caliber"
                  value={currentResource?.details?.caliber || ''}
                  onChange={(e) => handleDetailChange('caliber', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Assigned To"
                  value={currentResource?.details?.assignedTo || ''}
                  onChange={(e) => handleDetailChange('assignedTo', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            {getResourceType() === RESOURCE_TYPES.EQUIPMENT && (
              <>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Category"
                  value={currentResource?.details?.category || ''}
                  onChange={(e) => handleDetailChange('category', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Condition"
                  value={currentResource?.details?.condition || ''}
                  onChange={(e) => handleDetailChange('condition', e.target.value)}
                  select
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="good">Good</MenuItem>
                  <MenuItem value="fair">Fair</MenuItem>
                  <MenuItem value="poor">Poor</MenuItem>
                  <MenuItem value="needs-repair">Needs Repair</MenuItem>
                </TextField>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Location"
                  value={currentResource?.details?.location || ''}
                  onChange={(e) => handleDetailChange('location', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}

            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={currentResource?.details?.notes || ''}
              onChange={(e) => handleDetailChange('notes', e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveResource} 
            variant="contained"
            color="primary"
          >
            {dialogType === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Resources;
