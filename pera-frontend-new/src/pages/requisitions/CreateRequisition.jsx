import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  FormGroup,
  IconButton,
  Tooltip,
  LinearProgress,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  LocalPolice as PoliceIcon,
  DirectionsCar as VehicleIcon,
  Security as WeaponIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

// Mock data - in a real app, this would come from your API
const mockUsers = [
  { id: '1', name: 'John Doe', designation: 'io' },
  { id: '2', name: 'Jane Smith', designation: 'eo' },
  { id: '3', name: 'Robert Johnson', designation: 'constable' },
  { id: '4', name: 'Emily Davis', designation: 'sr_constable' },
];

const mockVehicles = [
  { id: 'v1', registrationNumber: 'LEA-1234', type: 'Double Cabin' },
  { id: 'v2', registrationNumber: 'LEA-5678', type: 'Single Cabin' },
  { id: 'v3', registrationNumber: 'LEB-9012', type: 'Bike' },
];

const mockWeapons = [
  { id: 'w1', serialNumber: 'AK-12345', type: 'AK-47' },
  { id: 'w2', serialNumber: 'BR-67890', type: 'Beretta' },
  { id: 'w3', serialNumber: 'AK-54321', type: 'AK-47' },
];

const operationTypes = [
  { value: 'surveillance', label: 'Surveillance' },
  { value: 'raid', label: 'Raid' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'other', label: 'Other' },
];

const urgencies = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const sensitivities = [
  { value: 'normal', label: 'Normal' },
  { value: 'sensitive', label: 'Sensitive' },
  { value: 'top-secret', label: 'Top Secret' },
];

// Form validation schema
const validationSchema = Yup.object({
  operationType: Yup.string().required('Operation type is required'),
  description: Yup.string().required('Description is required'),
  urgency: Yup.string().required('Urgency level is required'),
  sensitivity: Yup.string().required('Sensitivity level is required'),
  location: Yup.string().required('Location is required'),
  startDate: Yup.date().required('Start date is required'),
  startTime: Yup.date().required('Start time is required'),
  endDate: Yup.date()
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .nullable(),
  endTime: Yup.date()
    .when('endDate', {
      is: (endDate) => !!endDate,
      then: Yup.date().required('End time is required when end date is provided'),
    })
    .nullable(),
  assignedTeam: Yup.array()
    .min(1, 'At least one team member is required')
    .required('Team members are required'),
  assignedVehicles: Yup.array(),
  assignedWeapons: Yup.array(),
  notes: Yup.string(),
});

const CreateRequisition = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form with Formik
  const formik = useFormik({
    initialValues: {
      operationType: '',
      description: '',
      urgency: 'medium',
      sensitivity: 'normal',
      location: '',
      startDate: new Date(),
      startTime: new Date(),
      endDate: null,
      endTime: null,
      assignedTeam: [],
      assignedVehicles: [],
      assignedWeapons: [],
      notes: '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        setLoading(true);
        setError(null);
        
        // Format dates for API
        const startDateTime = new Date(values.startDate);
        startDateTime.setHours(
          values.startTime.getHours(),
          values.startTime.getMinutes(),
          0,
          0
        );
        
        let endDateTime = null;
        if (values.endDate && values.endTime) {
          endDateTime = new Date(values.endDate);
          endDateTime.setHours(
            values.endTime.getHours(),
            values.endTime.getMinutes(),
            0,
            0
          );
          
          // Validate end date is after start date
          if (endDateTime <= startDateTime) {
            setFieldError('endDate', 'End date/time must be after start date/time');
            setFieldError('endTime', 'End date/time must be after start date/time');
            return;
          }
        }
        
        // Prepare the requisition data
        const requisitionData = {
          operationType: values.operationType,
          description: values.description,
          urgency: values.urgency,
          sensitivity: values.sensitivity,
          location: values.location,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime ? endDateTime.toISOString() : undefined,
          assignedTeam: values.assignedTeam.map(user => user.id),
          assignedVehicles: values.assignedVehicles.map(vehicle => vehicle.id),
          assignedWeapons: values.assignedWeapons.map(weapon => weapon.id),
          notes: values.notes,
          createdBy: user?.id || 'system',
          status: 'pending',
        };
        
        console.log('Submitting requisition:', requisitionData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, uncomment this:
        // const response = await api.post('/requisitions', requisitionData);
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/requisitions');
        }, 1500);
      } catch (error) {
        console.error('Error creating requisition:', error);
        setError(error.response?.data?.message || 'Failed to create requisition. Please try again.');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this data from your API
        // const [usersRes, vehiclesRes, weaponsRes] = await Promise.all([
        //   api.get('/users'),
        //   api.get('/vehicles'),
        //   api.get('/weapons')
        // ]);
        // setUsers(usersRes.data);
        // setVehicles(vehiclesRes.data);
        // setWeapons(weaponsRes.data);
        
        // Using mock data for now
        setUsers(mockUsers);
        setVehicles(mockVehicles);
        setWeapons(mockWeapons);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load required data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle next step
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Handle step change
  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  // Steps for the stepper
  const steps = [
    { label: 'Operation Details', fields: ['operationType', 'description', 'urgency', 'sensitivity'] },
    { label: 'Location & Timing', fields: ['location', 'startDate', 'startTime', 'endDate', 'endTime'] },
    { label: 'Resources', fields: ['assignedTeam', 'assignedVehicles', 'assignedWeapons'] },
    { label: 'Review & Submit', fields: [] },
  ];

  // Check if current step is valid
  const isStepValid = (stepIndex) => {
    const fieldNames = steps[stepIndex].fields;
    
    // If no fields to validate, return true
    if (fieldNames.length === 0) return true;
    
    // Check if all fields in the current step are valid
    return fieldNames.every(fieldName => {
      // Skip validation for fields that don't have validation errors
      if (!formik.touched[fieldName]) return true;
      
      // Check if the field has an error
      return !formik.errors[fieldName];
    });
  };

  // Render form fields based on current step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.operationType && Boolean(formik.errors.operationType)}>
                <InputLabel id="operation-type-label">Operation Type *</InputLabel>
                <Select
                  labelId="operation-type-label"
                  id="operationType"
                  name="operationType"
                  value={formik.values.operationType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Operation Type *"
                >
                  {operationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.operationType && formik.errors.operationType && (
                  <FormHelperText>{formik.errors.operationType}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description *"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.urgency && Boolean(formik.errors.urgency)}>
                <InputLabel id="urgency-label">Urgency *</InputLabel>
                <Select
                  labelId="urgency-label"
                  id="urgency"
                  name="urgency"
                  value={formik.values.urgency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Urgency *"
                >
                  {urgencies.map((urgency) => (
                    <MenuItem key={urgency.value} value={urgency.value}>
                      {urgency.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.urgency && formik.errors.urgency && (
                  <FormHelperText>{formik.errors.urgency}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.sensitivity && Boolean(formik.errors.sensitivity)}>
                <InputLabel id="sensitivity-label">Sensitivity Level *</InputLabel>
                <Select
                  labelId="sensitivity-label"
                  id="sensitivity"
                  name="sensitivity"
                  value={formik.values.sensitivity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Sensitivity Level *"
                >
                  {sensitivities.map((sensitivity) => (
                    <MenuItem key={sensitivity.value} value={sensitivity.value}>
                      {sensitivity.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.sensitivity && formik.errors.sensitivity && (
                  <FormHelperText>{formik.errors.sensitivity}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location *"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date *"
                  value={formik.values.startDate}
                  onChange={(date) => formik.setFieldValue('startDate', date, true)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                      helperText={formik.touched.startDate && formik.errors.startDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Start Time *"
                  value={formik.values.startTime}
                  onChange={(time) => formik.setFieldValue('startTime', time, true)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                      helperText={formik.touched.startTime && formik.errors.startTime}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={formik.values.endDate}
                  onChange={(date) => formik.setFieldValue('endDate', date, true)}
                  minDate={formik.values.startDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                      helperText={formik.touched.endDate && formik.errors.endDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="End Time"
                  value={formik.values.endTime}
                  onChange={(time) => formik.setFieldValue('endTime', time, true)}
                  disabled={!formik.values.endDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                      helperText={formik.touched.endTime && formik.errors.endTime}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="assignedTeam"
                options={users}
                getOptionLabel={(option) => `${option.name} (${option.designation.toUpperCase()})`}
                value={formik.values.assignedTeam}
                onChange={(event, newValue) => {
                  formik.setFieldValue('assignedTeam', newValue, true);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team Members *"
                    placeholder="Select team members"
                    error={formik.touched.assignedTeam && Boolean(formik.errors.assignedTeam)}
                    helperText={formik.touched.assignedTeam && formik.errors.assignedTeam}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={`${option.name} (${option.designation.toUpperCase()})`}
                      size="small"
                      icon={<PersonAddIcon />}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="assignedVehicles"
                options={vehicles}
                getOptionLabel={(option) => `${option.type} - ${option.registrationNumber}`}
                value={formik.values.assignedVehicles}
                onChange={(event, newValue) => {
                  formik.setFieldValue('assignedVehicles', newValue, true);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned Vehicles"
                    placeholder="Select vehicles"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={`${option.type} - ${option.registrationNumber}`}
                      size="small"
                      icon={<VehicleIcon />}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="assignedWeapons"
                options={weapons}
                getOptionLabel={(option) => `${option.type} (${option.serialNumber})`}
                value={formik.values.assignedWeapons}
                onChange={(event, newValue) => {
                  formik.setFieldValue('assignedWeapons', newValue, true);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assigned Weapons"
                    placeholder="Select weapons"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      label={`${option.type} (${option.serialNumber})`}
                      size="small"
                      icon={<WeaponIcon />}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Additional Notes"
                multiline
                rows={3}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Operation Details
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle1">
                {operationTypes.find(t => t.value === formik.values.operationType)?.label || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formik.values.description}
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Urgency: ${formik.values.urgency}`} 
                  size="small" 
                  color={
                    formik.values.urgency === 'high' || formik.values.urgency === 'critical' 
                      ? 'error' 
                      : formik.values.urgency === 'medium' 
                        ? 'warning' 
                        : 'default'
                  }
                />
                <Chip 
                  label={`Sensitivity: ${formik.values.sensitivity}`} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Location & Timing
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Location:</strong> {formik.values.location}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Start:</strong> {new Date(formik.values.startDate).toLocaleString()}
              </Typography>
              {formik.values.endDate && formik.values.endTime && (
                <Typography variant="body1" gutterBottom>
                  <strong>End:</strong> {new Date(formik.values.endDate).toLocaleDateString()} {formik.values.endTime.toLocaleTimeString()}
                </Typography>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Team Members ({formik.values.assignedTeam.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formik.values.assignedTeam.length > 0 ? (
                  formik.values.assignedTeam.map((member) => (
                    <Chip
                      key={member.id}
                      label={`${member.name} (${member.designation.toUpperCase()})`}
                      size="small"
                      icon={<PersonAddIcon />}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No team members selected
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Vehicles ({formik.values.assignedVehicles.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formik.values.assignedVehicles.length > 0 ? (
                  formik.values.assignedVehicles.map((vehicle) => (
                    <Chip
                      key={vehicle.id}
                      label={`${vehicle.type} - ${vehicle.registrationNumber}`}
                      size="small"
                      icon={<VehicleIcon />}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No vehicles selected
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Weapons ({formik.values.assignedWeapons.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formik.values.assignedWeapons.length > 0 ? (
                  formik.values.assignedWeapons.map((weapon) => (
                    <Chip
                      key={weapon.id}
                      label={`${weapon.type} (${weapon.serialNumber})`}
                      size="small"
                      icon={<WeaponIcon />}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No weapons selected
                  </Typography>
                )}
              </Box>

              {formik.values.notes && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Additional Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formik.values.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/requisitions')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Create New Requisition
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                onClick={() => handleStepClick(index)}
                sx={{ cursor: 'pointer' }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {loading && <LinearProgress />}
        <Box sx={{ mt: 2 }}>
          {renderStepContent(activeStep)}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box>
          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => {
                // Validate current step before proceeding
                const isValid = isStepValid(activeStep);
                if (isValid) {
                  handleNext();
                } else {
                  // Show validation errors
                  formik.validateForm().then(errors => {
                    const fieldNames = steps[activeStep].fields;
                    const touched = {};
                    fieldNames.forEach(fieldName => {
                      if (errors[fieldName]) {
                        touched[fieldName] = true;
                      }
                    });
                    formik.setTouched(touched);
                  });
                }
              }}
              sx={{ ml: 1 }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={formik.handleSubmit}
              disabled={!formik.isValid || loading}
            >
              {loading ? 'Submitting...' : 'Submit Requisition'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateRequisition;
