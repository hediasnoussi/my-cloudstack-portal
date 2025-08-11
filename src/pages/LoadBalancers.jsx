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
  Balance as BalanceIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const LoadBalancers = () => {
  const [loadBalancers, setLoadBalancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedBalancer, setSelectedBalancer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for load balancers
  const mockLoadBalancers = [
    {
      id: 1,
      name: 'Web Load Balancer',
      description: 'Load balancer for web servers',
      algorithm: 'Round Robin',
      state: 'Running',
      publicIP: '203.0.113.10',
      privateIP: '10.0.1.10',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      vmCount: 3,
      port: 80,
      tags: ['web', 'load-balancer']
    },
    {
      id: 2,
      name: 'API Load Balancer',
      description: 'Load balancer for API servers',
      algorithm: 'Least Connections',
      state: 'Running',
      publicIP: '203.0.113.11',
      privateIP: '10.0.1.11',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      vmCount: 2,
      port: 443,
      tags: ['api', 'load-balancer']
    },
    {
      id: 3,
      name: 'Database Load Balancer',
      description: 'Load balancer for database servers',
      algorithm: 'Source IP',
      state: 'Stopped',
      publicIP: '203.0.113.12',
      privateIP: '10.0.1.12',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      vmCount: 2,
      port: 3306,
      tags: ['database', 'load-balancer']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    algorithm: 'Round Robin',
    publicIP: '',
    privateIP: '',
    port: 80,
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchLoadBalancers();
  }, []);

  const fetchLoadBalancers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoadBalancers(mockLoadBalancers);
      setError('');
    } catch (err) {
      setError('Failed to fetch load balancers');
      console.error('Error fetching load balancers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBalancer = async (balancerData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBalancer = {
        id: Date.now(),
        ...balancerData,
        state: 'Creating',
        created: new Date().toISOString(),
        vmCount: 0,
        tags: []
      };
      setLoadBalancers([...loadBalancers, newBalancer]);
      setSnackbar({ open: true, message: 'Load balancer created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create load balancer', severity: 'error' });
    }
  };

  const handleUpdateBalancer = async (id, balancerData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadBalancers(loadBalancers.map(balancer => 
        balancer.id === id ? { ...balancer, ...balancerData } : balancer
      ));
      setSnackbar({ open: true, message: 'Load balancer updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update load balancer', severity: 'error' });
    }
  };

  const handleDeleteBalancer = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoadBalancers(loadBalancers.filter(balancer => balancer.id !== id));
      setSnackbar({ open: true, message: 'Load balancer deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete load balancer', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, balancer = null) => {
    setDialogMode(mode);
    setSelectedBalancer(balancer);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        algorithm: 'Round Robin',
        publicIP: '',
        privateIP: '',
        port: 80,
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (balancer) {
      setFormData({
        name: balancer.name,
        description: balancer.description,
        algorithm: balancer.algorithm,
        publicIP: balancer.publicIP,
        privateIP: balancer.privateIP,
        port: balancer.port,
        account: balancer.account,
        domain: balancer.domain,
        zone: balancer.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBalancer(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateBalancer(formData);
    } else if (dialogMode === 'edit' && selectedBalancer) {
      await handleUpdateBalancer(selectedBalancer.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Running': return 'success';
      case 'Stopped': return 'error';
      case 'Creating': return 'warning';
      case 'Failed': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
          Load Balancers Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchLoadBalancers}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Load Balancer
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
                <TableCell>Algorithm</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Public IP</TableCell>
                <TableCell>Private IP</TableCell>
                <TableCell>Port</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>VM Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadBalancers.map((balancer) => (
                <TableRow key={balancer.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <BalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {balancer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{balancer.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={balancer.algorithm} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={balancer.state} 
                      color={getStateColor(balancer.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{balancer.publicIP}</TableCell>
                  <TableCell>{balancer.privateIP}</TableCell>
                  <TableCell>{balancer.port}</TableCell>
                  <TableCell>{balancer.account}</TableCell>
                  <TableCell>{balancer.domain}</TableCell>
                  <TableCell>{balancer.zone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={balancer.vmCount} 
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(balancer.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', balancer)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Load Balancer">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', balancer)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Load Balancer">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteBalancer(balancer.id)}
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
          {dialogMode === 'create' ? 'Create New Load Balancer' : 
           dialogMode === 'edit' ? 'Edit Load Balancer' : 'Load Balancer Details'}
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
              <InputLabel>Algorithm</InputLabel>
              <Select
                value={formData.algorithm}
                onChange={(e) => handleInputChange('algorithm', e.target.value)}
                label="Algorithm"
              >
                <MenuItem value="Round Robin">Round Robin</MenuItem>
                <MenuItem value="Least Connections">Least Connections</MenuItem>
                <MenuItem value="Source IP">Source IP</MenuItem>
                <MenuItem value="Weighted Round Robin">Weighted Round Robin</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Public IP"
              value={formData.publicIP}
              onChange={(e) => handleInputChange('publicIP', e.target.value)}
              margin="normal"
              placeholder="203.0.113.10"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Private IP"
              value={formData.privateIP}
              onChange={(e) => handleInputChange('privateIP', e.target.value)}
              margin="normal"
              placeholder="10.0.1.10"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Port"
              type="number"
              value={formData.port}
              onChange={(e) => handleInputChange('port', parseInt(e.target.value))}
              margin="normal"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Account"
              value={formData.account}
              onChange={(e) => handleInputChange('account', e.target.value)}
              margin="normal"
              disabled={dialogMode === 'view'}
            />
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

export default LoadBalancers; 