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

const StoragePools = () => {
  const [storagePools, setStoragePools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedPool, setSelectedPool] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for storage pools
  const mockStoragePools = [
    {
      id: 1,
      name: 'Primary Storage Pool',
      description: 'Primary storage pool for VMs',
      type: 'Shared',
      state: 'Up',
      capacity: 1000,
      used: 300,
      available: 700,
      created: '2024-01-15T10:30:00Z',
      zone: 'Zone1',
      tags: ['primary', 'storage']
    },
    {
      id: 2,
      name: 'Secondary Storage Pool',
      description: 'Secondary storage for templates and snapshots',
      type: 'Shared',
      state: 'Up',
      capacity: 2000,
      used: 500,
      available: 1500,
      created: '2024-01-20T14:45:00Z',
      zone: 'Zone1',
      tags: ['secondary', 'storage']
    },
    {
      id: 3,
      name: 'Local Storage Pool',
      description: 'Local storage pool for high performance',
      type: 'Local',
      state: 'Up',
      capacity: 500,
      used: 100,
      available: 400,
      created: '2024-01-25T09:15:00Z',
      zone: 'Zone2',
      tags: ['local', 'performance']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Shared',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchStoragePools();
  }, []);

  const fetchStoragePools = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStoragePools(mockStoragePools);
      setError('');
    } catch (err) {
      setError('Failed to fetch storage pools');
      console.error('Error fetching storage pools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePool = async (poolData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newPool = {
        id: Date.now(),
        ...poolData,
        state: 'Up',
        capacity: 0,
        used: 0,
        available: 0,
        created: new Date().toISOString(),
        tags: []
      };
      setStoragePools([...storagePools, newPool]);
      setSnackbar({ open: true, message: 'Storage pool created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create storage pool', severity: 'error' });
    }
  };

  const handleUpdatePool = async (id, poolData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStoragePools(storagePools.map(pool => 
        pool.id === id ? { ...pool, ...poolData } : pool
      ));
      setSnackbar({ open: true, message: 'Storage pool updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update storage pool', severity: 'error' });
    }
  };

  const handleDeletePool = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStoragePools(storagePools.filter(pool => pool.id !== id));
      setSnackbar({ open: true, message: 'Storage pool deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete storage pool', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, pool = null) => {
    setDialogMode(mode);
    setSelectedPool(pool);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        type: 'Shared',
        zone: 'Zone1'
      });
    } else if (pool) {
      setFormData({
        name: pool.name,
        description: pool.description,
        type: pool.type,
        zone: pool.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPool(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreatePool(formData);
    } else if (dialogMode === 'edit' && selectedPool) {
      await handleUpdatePool(selectedPool.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Up': return 'success';
      case 'Down': return 'error';
      case 'Maintenance': return 'warning';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Shared': return 'primary';
      case 'Local': return 'secondary';
      case 'Network': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSize = (size) => {
    return `${size} GB`;
  };

  const calculateUsagePercentage = (used, capacity) => {
    if (capacity === 0) return 0;
    return Math.round((used / capacity) * 100);
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
          Storage Pools Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchStoragePools}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Storage Pool
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
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Used</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Usage %</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storagePools.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {pool.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{pool.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={pool.type} 
                      color={getTypeColor(pool.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={pool.state} 
                      color={getStateColor(pool.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatSize(pool.capacity)}</TableCell>
                  <TableCell>{formatSize(pool.used)}</TableCell>
                  <TableCell>{formatSize(pool.available)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${calculateUsagePercentage(pool.used, pool.capacity)}%`}
                      color={calculateUsagePercentage(pool.used, pool.capacity) > 80 ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{pool.zone}</TableCell>
                  <TableCell>{formatDate(pool.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', pool)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Storage Pool">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', pool)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Storage Pool">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeletePool(pool.id)}
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
          {dialogMode === 'create' ? 'Create New Storage Pool' : 
           dialogMode === 'edit' ? 'Edit Storage Pool' : 'Storage Pool Details'}
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
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              margin="normal"
              multiline
              rows={3}
              disabled={dialogMode === 'view'}
            />
            <FormControl fullWidth margin="normal" disabled={dialogMode === 'view'}>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                label="Type"
              >
                <MenuItem value="Shared">Shared</MenuItem>
                <MenuItem value="Local">Local</MenuItem>
                <MenuItem value="Network">Network</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" disabled={dialogMode === 'view'}>
              <InputLabel>Zone</InputLabel>
              <Select
                value={formData.zone}
                onChange={(e) => handleInputChange('zone', e.target.value)}
                label="Zone"
              >
                <MenuItem value="Zone1">Zone1</MenuItem>
                <MenuItem value="Zone2">Zone2</MenuItem>
                <MenuItem value="Zone3">Zone3</MenuItem>
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

export default StoragePools; 