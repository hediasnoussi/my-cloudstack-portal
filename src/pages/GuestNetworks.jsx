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
  Wifi as WifiIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const GuestNetworks = () => {
  const [guestNetworks, setGuestNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for guest networks
  const mockGuestNetworks = [
    {
      id: 1,
      name: 'Web Network',
      description: 'Network for web servers',
      cidr: '192.168.1.0/24',
      gateway: '192.168.1.1',
      netmask: '255.255.255.0',
      state: 'Allocated',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      vmCount: 5,
      tags: ['web', 'network']
    },
    {
      id: 2,
      name: 'Database Network',
      description: 'Network for database servers',
      cidr: '192.168.2.0/24',
      gateway: '192.168.2.1',
      netmask: '255.255.255.0',
      state: 'Allocated',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      vmCount: 3,
      tags: ['database', 'network']
    },
    {
      id: 3,
      name: 'Development Network',
      description: 'Network for development VMs',
      cidr: '192.168.3.0/24',
      gateway: '192.168.3.1',
      netmask: '255.255.255.0',
      state: 'Available',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      vmCount: 0,
      tags: ['development', 'network']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cidr: '',
    gateway: '',
    netmask: '',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchGuestNetworks();
  }, []);

  const fetchGuestNetworks = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGuestNetworks(mockGuestNetworks);
      setError('');
    } catch (err) {
      setError('Failed to fetch guest networks');
      console.error('Error fetching guest networks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNetwork = async (networkData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newNetwork = {
        id: Date.now(),
        ...networkData,
        state: 'Available',
        created: new Date().toISOString(),
        vmCount: 0,
        tags: []
      };
      setGuestNetworks([...guestNetworks, newNetwork]);
      setSnackbar({ open: true, message: 'Guest network created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create guest network', severity: 'error' });
    }
  };

  const handleUpdateNetwork = async (id, networkData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setGuestNetworks(guestNetworks.map(network => 
        network.id === id ? { ...network, ...networkData } : network
      ));
      setSnackbar({ open: true, message: 'Guest network updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update guest network', severity: 'error' });
    }
  };

  const handleDeleteNetwork = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setGuestNetworks(guestNetworks.filter(network => network.id !== id));
      setSnackbar({ open: true, message: 'Guest network deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete guest network', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, network = null) => {
    setDialogMode(mode);
    setSelectedNetwork(network);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        cidr: '',
        gateway: '',
        netmask: '',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (network) {
      setFormData({
        name: network.name,
        description: network.description,
        cidr: network.cidr,
        gateway: network.gateway,
        netmask: network.netmask,
        account: network.account,
        domain: network.domain,
        zone: network.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNetwork(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateNetwork(formData);
    } else if (dialogMode === 'edit' && selectedNetwork) {
      await handleUpdateNetwork(selectedNetwork.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Allocated': return 'success';
      case 'Available': return 'primary';
      case 'Reserved': return 'warning';
      case 'Released': return 'error';
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
          Guest Networks Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchGuestNetworks}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Guest Network
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
                <TableCell>CIDR</TableCell>
                <TableCell>Gateway</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>VM Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guestNetworks.map((network) => (
                <TableRow key={network.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <WifiIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {network.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{network.description}</TableCell>
                  <TableCell>{network.cidr}</TableCell>
                  <TableCell>{network.gateway}</TableCell>
                  <TableCell>
                    <Chip 
                      label={network.state} 
                      color={getStateColor(network.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{network.account}</TableCell>
                  <TableCell>{network.domain}</TableCell>
                  <TableCell>{network.zone}</TableCell>
                  <TableCell>{network.vmCount}</TableCell>
                  <TableCell>{formatDate(network.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', network)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Guest Network">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', network)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Guest Network">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#6b7280' }}
                        onClick={() => handleDeleteNetwork(network.id)}
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
          {dialogMode === 'create' ? 'Create New Guest Network' : 
           dialogMode === 'edit' ? 'Edit Guest Network' : 'Guest Network Details'}
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
            <TextField
              fullWidth
              label="CIDR"
              value={formData.cidr}
              onChange={(e) => handleInputChange('cidr', e.target.value)}
              margin="normal"
              placeholder="192.168.1.0/24"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Gateway"
              value={formData.gateway}
              onChange={(e) => handleInputChange('gateway', e.target.value)}
              margin="normal"
              placeholder="192.168.1.1"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Netmask"
              value={formData.netmask}
              onChange={(e) => handleInputChange('netmask', e.target.value)}
              margin="normal"
              placeholder="255.255.255.0"
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

export default GuestNetworks; 