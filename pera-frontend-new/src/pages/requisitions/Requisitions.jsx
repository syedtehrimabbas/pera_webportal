import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'sdo_approved', label: 'SDO Approved' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
];

const operationTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'surveillance', label: 'Surveillance' },
  { value: 'raid', label: 'Raid' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'other', label: 'Other' },
];

const Requisitions = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  // State for table data and pagination
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // State for filters
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || 'all',
    operationType: searchParams.get('type') || 'all',
    search: searchParams.get('search') || '',
  });

  // Fetch requisitions based on filters and pagination
  const fetchRequisitions = async () => {
    try {
      setLoading(true);
      
      // Prepare query params
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      
      // Add filters to params
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.operationType !== 'all') params.operationType = filters.operationType;
      if (filters.search) params.search = filters.search;
      
      // Update URL with current filters
      const newSearchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        newSearchParams.set(key, value);
      });
      setSearchParams(newSearchParams);
      
      // In a real app, you would fetch data from your API
      // For now, we'll use mock data
      const mockData = {
        data: Array(10).fill().map((_, i) => ({
          id: `REQ-2023-${1000 + i}`,
          operationType: ['surveillance', 'raid', 'inspection', 'other'][Math.floor(Math.random() * 4)],
          location: ['Lahore', 'Islamabad', 'Karachi', 'Peshawar', 'Quetta'][Math.floor(Math.random() * 5)],
          status: ['draft', 'submitted', 'sdo_approved', 'in_progress', 'completed', 'rejected', 'cancelled'][Math.floor(Math.random() * 7)],
          requestedBy: 'John Doe',
          startTime: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          urgency: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
        })),
        total: 100,
      };
      
      setRequisitions(mockData.data);
      setTotalCount(mockData.total);
    } catch (error) {
      console.error('Error fetching requisitions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchRequisitions();
  }, [page, rowsPerPage, filters]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPage(0); // Reset to first page when filters change
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setFilters(prev => ({
      ...prev,
      search: event.target.value,
    }));
  };

  // Handle search submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchRequisitions();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
      case 'sdo_approved':
        return 'primary';
      case 'submitted':
        return 'info';
      case 'draft':
        return 'default';
      case 'rejected':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get operation type label
  const getOperationTypeLabel = (type) => {
    return operationTypeOptions.find(opt => opt.value === type)?.label || type;
  };

  // Format date
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'PPpp');
  };

  // Handle view requisition
  const handleViewRequisition = (id) => {
    navigate(`/requisitions/${id}`);
  };

  // Handle edit requisition
  const handleEditRequisition = (id, e) => {
    e.stopPropagation();
    navigate(`/requisitions/${id}/edit`);
  };

  // Handle delete requisition
  const handleDeleteRequisition = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this requisition?')) {
      try {
        // In a real app, you would call your API to delete the requisition
        // await api.delete(`/requisitions/${id}`);
        // fetchRequisitions(); // Refresh the list
        alert('Requisition deleted successfully');
      } catch (error) {
        console.error('Error deleting requisition:', error);
        alert('Failed to delete requisition');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Requisitions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/requisitions/create')}
        >
          New Requisition
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSearchSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search requisitions..."
              variant="outlined"
              size="small"
              name="search"
              value={filters.search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, minWidth: 200 }}
            />

            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="type-filter-label">Operation Type</InputLabel>
              <Select
                labelId="type-filter-label"
                id="type-filter"
                name="operationType"
                value={filters.operationType}
                onChange={handleFilterChange}
                label="Operation Type"
              >
                {operationTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchRequisitions}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Requisitions Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="requisitions table">
            <TableHead>
              <TableRow>
                <TableCell>Request #</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Requested By</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Urgency</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requisitions.length > 0 ? (
                requisitions.map((requisition) => (
                  <TableRow 
                    hover 
                    key={requisition.id}
                    onClick={() => handleViewRequisition(requisition.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{requisition.id}</TableCell>
                    <TableCell>{getOperationTypeLabel(requisition.operationType)}</TableCell>
                    <TableCell>{requisition.location}</TableCell>
                    <TableCell>
                      <Chip 
                        label={requisition.status.replace('_', ' ')}
                        color={getStatusColor(requisition.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{requisition.requestedBy}</TableCell>
                    <TableCell>{formatDate(requisition.startTime)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={requisition.urgency}
                        color={
                          requisition.urgency === 'high' || requisition.urgency === 'critical' 
                            ? 'error' 
                            : requisition.urgency === 'medium' 
                              ? 'warning' 
                              : 'default'
                        }
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRequisition(requisition.id);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={(e) => handleEditRequisition(requisition.id, e)}
                        disabled={requisition.status !== 'draft'}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => handleDeleteRequisition(requisition.id, e)}
                        disabled={!['draft', 'submitted'].includes(requisition.status)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    {loading ? 'Loading...' : 'No requisitions found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default Requisitions;
