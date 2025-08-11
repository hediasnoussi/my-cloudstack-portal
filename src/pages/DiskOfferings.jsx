import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Chip, 
  IconButton, 
  Tooltip, 
  Alert, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Snackbar, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon, 
  Refresh as RefreshIcon, 
  Storage as StorageIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const DiskOfferings = () => {
  const [diskOfferings, setDiskOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for disk offerings
  const mockDiskOfferings = [
    {
      id: 1,
      name: 'Small Disk',
      displayText: 'Small disk offering - 10GB',
      diskSize: 10,
      storageType: 'Local',
      state: 'Active',
      created: '2024-01-15T10:30:00Z',
      domain: 'ROOT',
      tags: ['small', 'disk']
    },
    {
      id: 2,
      name: 'Medium Disk',
      displayText: 'Medium disk offering - 50GB',
      diskSize: 50,
      storageType: 'Local',
      state: 'Active',
      created: '2024-01-20T14:45:00Z',
      domain: 'ROOT',
      tags: ['medium', 'disk']
    },
    {
      id: 3,
      name: 'Large Disk',
      displayText: 'Large disk offering - 100GB',
      diskSize: 100,
      storageType: 'Shared',
      state: 'Active',
      created: '2024-01-25T09:15:00Z',
      domain: 'ROOT',
      tags: ['large', 'disk']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    displayText: '',
    diskSize: 10,
    storageType: 'Local',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchDiskOfferings();
  }, []);

  const fetchDiskOfferings = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDiskOfferings(mockDiskOfferings);
      setError('');
    } catch (err) {
      setError('Failed to fetch disk offerings');
      console.error('Error fetching disk offerings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffering = async (offeringData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newOffering = {
        id: Date.now(),
        ...offeringData,
        state: 'Active',
        created: new Date().toISOString(),
        tags: []
      };
      setDiskOfferings([...diskOfferings, newOffering]);
      setSnackbar({ open: true, message: 'Disk offering created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create disk offering', severity: 'error' });
    }
  };

  const handleUpdateOffering = async (id, offeringData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setDiskOfferings(diskOfferings.map(offering => 
        offering.id === id ? { ...offering, ...offeringData } : offering
      ));
      setSnackbar({ open: true, message: 'Disk offering updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update disk offering', severity: 'error' });
    }
  };

  const handleDeleteOffering = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setDiskOfferings(diskOfferings.filter(offering => offering.id !== id));
      setSnackbar({ open: true, message: 'Disk offering deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete disk offering', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, offering = null) => {
    setDialogMode(mode);
    setSelectedOffering(offering);
    if (mode === 'create') {
      setFormData({
        name: '',
        displayText: '',
        diskSize: 10,
        storageType: 'Local',
        domain: 'ROOT'
      });
    } else if (offering) {
      setFormData({
        name: offering.name,
        displayText: offering.displayText,
        diskSize: offering.diskSize,
        storageType: offering.storageType,
        domain: offering.domain
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOffering(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateOffering(formData);
    } else if (dialogMode === 'edit' && selectedOffering) {
      await handleUpdateOffering(selectedOffering.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Disabled': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDiskSize = (size) => {
    return `${size} GB`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Disk Offerings Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchDiskOfferings}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Disk Offering
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Display Text</TableCell>
                <TableCell>Disk Size</TableCell>
                <TableCell>Storage Type</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diskOfferings.map((offering) => (
                <TableRow key={offering.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {offering.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{offering.displayText}</TableCell>
                  <TableCell>{formatDiskSize(offering.diskSize)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={offering.storageType} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={offering.state} 
                      color={getStateColor(offering.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{offering.domain}</TableCell>
                  <TableCell>{formatDate(offering.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', offering)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Disk Offering">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', offering)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Disk Offering">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteOffering(offering.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New Disk Offering' : 
           dialogMode === 'edit' ? 'Edit Disk Offering' : 'Disk Offering Details'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              margin="normal"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Display Text"
              value={formData.displayText}
              onChange={(e) => handleInputChange('displayText', e.target.value)}
              margin="normal"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Disk Size (GB)"
              type="number"
              value={formData.diskSize}
              onChange={(e) => handleInputChange('diskSize', parseInt(e.target.value))}
              margin="normal"
              disabled={dialogMode === 'view'}
            />
            <FormControl fullWidth margin="normal" disabled={dialogMode === 'view'}>
              <InputLabel>Storage Type</InputLabel>
              <Select
                value={formData.storageType}
                onChange={(e) => handleInputChange('storageType', e.target.value)}
                label="Storage Type"
              >
                <MenuItem value="Local">Local</MenuItem>
                <MenuItem value="Shared">Shared</MenuItem>
                <MenuItem value="Network">Network</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" disabled={dialogMode === 'view'}>
              <InputLabel>Domain</InputLabel>
              <Select
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                label="Domain"
              >
                <MenuItem value="ROOT">ROOT</MenuItem>
                <MenuItem value="DOMAIN1">DOMAIN1</MenuItem>
                <MenuItem value="DOMAIN2">DOMAIN2</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {dialogMode === 'create' ? 'Create' : 'Update'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiskOfferings; 