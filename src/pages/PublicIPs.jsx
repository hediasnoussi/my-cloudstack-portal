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
  Public as PublicIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const PublicIPs = () => {
  const [publicIPs, setPublicIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedIP, setSelectedIP] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for public IPs
  const mockPublicIPs = [
    {
      id: 1,
      ipAddress: '203.0.113.1',
      description: 'Web server public IP',
      state: 'Allocated',
      associatedWith: 'web-server-vm',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-15T10:30:00Z',
      zone: 'Zone1',
      tags: ['web', 'server']
    },
    {
      id: 2,
      ipAddress: '203.0.113.2',
      description: 'Database server public IP',
      state: 'Allocated',
      associatedWith: 'db-server-vm',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-20T14:45:00Z',
      zone: 'Zone1',
      tags: ['database', 'server']
    },
    {
      id: 3,
      ipAddress: '203.0.113.3',
      description: 'Load balancer public IP',
      state: 'Available',
      associatedWith: null,
      account: 'user1',
      domain: 'ROOT',
      created: '2024-01-25T09:15:00Z',
      zone: 'Zone1',
      tags: ['load', 'balancer']
    }
  ];

  const [formData, setFormData] = useState({
    ipAddress: '',
    description: '',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchPublicIPs();
  }, []);

  const fetchPublicIPs = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPublicIPs(mockPublicIPs);
      setError('');
    } catch (err) {
      setError('Failed to fetch public IPs');
      console.error('Error fetching public IPs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIP = async (ipData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newIP = {
        id: Date.now(),
        ...ipData,
        state: 'Available',
        associatedWith: null,
        created: new Date().toISOString(),
        tags: []
      };
      setPublicIPs([...publicIPs, newIP]);
      setSnackbar({ open: true, message: 'Public IP created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create public IP', severity: 'error' });
    }
  };

  const handleUpdateIP = async (id, ipData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPublicIPs(publicIPs.map(ip => 
        ip.id === id ? { ...ip, ...ipData } : ip
      ));
      setSnackbar({ open: true, message: 'Public IP updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update public IP', severity: 'error' });
    }
  };

  const handleDeleteIP = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPublicIPs(publicIPs.filter(ip => ip.id !== id));
      setSnackbar({ open: true, message: 'Public IP deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete public IP', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, ip = null) => {
    setDialogMode(mode);
    setSelectedIP(ip);
    if (mode === 'create') {
      setFormData({
        ipAddress: '',
        description: '',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (ip) {
      setFormData({
        ipAddress: ip.ipAddress,
        description: ip.description,
        account: ip.account,
        domain: ip.domain,
        zone: ip.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIP(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateIP(formData);
    } else if (dialogMode === 'edit' && selectedIP) {
      await handleUpdateIP(selectedIP.id, formData);
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
          Public IPs Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchPublicIPs}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Public IP
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
                <TableCell>IP Address</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Associated With</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {publicIPs.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {ip.ipAddress}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{ip.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={ip.state} 
                      color={getStateColor(ip.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {ip.associatedWith ? (
                      <Chip 
                        label={ip.associatedWith} 
                        color="primary"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Not associated
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{ip.account}</TableCell>
                  <TableCell>{ip.domain}</TableCell>
                  <TableCell>{ip.zone}</TableCell>
                  <TableCell>{formatDate(ip.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', ip)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Public IP">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', ip)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Public IP">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteIP(ip.id)}
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
          {dialogMode === 'create' ? 'Create New Public IP' : 
           dialogMode === 'edit' ? 'Edit Public IP' : 'Public IP Details'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="IP Address"
              value={formData.ipAddress}
              onChange={(e) => handleInputChange('ipAddress', e.target.value)}
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

export default PublicIPs; 