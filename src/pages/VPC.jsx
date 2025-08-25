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
  Cloud as CloudIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const VPC = () => {
  const [vpcs, setVpcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedVpc, setSelectedVpc] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for VPCs
  const mockVpcs = [
    {
      id: 1,
      name: 'Production VPC',
      description: 'Virtual Private Cloud for production workloads',
      cidr: '10.0.0.0/16',
      state: 'Enabled',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      tierCount: 3,
      vmCount: 12,
      tags: ['production', 'vpc']
    },
    {
      id: 2,
      name: 'Development VPC',
      description: 'Virtual Private Cloud for development environment',
      cidr: '172.16.0.0/16',
      state: 'Enabled',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      tierCount: 2,
      vmCount: 8,
      tags: ['development', 'vpc']
    },
    {
      id: 3,
      name: 'Testing VPC',
      description: 'Virtual Private Cloud for testing environment',
      cidr: '192.168.0.0/16',
      state: 'Disabled',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      tierCount: 1,
      vmCount: 3,
      tags: ['testing', 'vpc']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cidr: '',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchVpcs();
  }, []);

  const fetchVpcs = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVpcs(mockVpcs);
      setError('');
    } catch (err) {
      setError('Failed to fetch VPCs');
      console.error('Error fetching VPCs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVpc = async (vpcData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newVpc = {
        id: Date.now(),
        ...vpcData,
        state: 'Enabled',
        created: new Date().toISOString(),
        tierCount: 0,
        vmCount: 0,
        tags: []
      };
      setVpcs([...vpcs, newVpc]);
      setSnackbar({ open: true, message: 'VPC created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create VPC', severity: 'error' });
    }
  };

  const handleUpdateVpc = async (id, vpcData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setVpcs(vpcs.map(vpc => 
        vpc.id === id ? { ...vpc, ...vpcData } : vpc
      ));
      setSnackbar({ open: true, message: 'VPC updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update VPC', severity: 'error' });
    }
  };

  const handleDeleteVpc = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setVpcs(vpcs.filter(vpc => vpc.id !== id));
      setSnackbar({ open: true, message: 'VPC deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete VPC', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, vpc = null) => {
    setDialogMode(mode);
    setSelectedVpc(vpc);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        cidr: '',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (vpc) {
      setFormData({
        name: vpc.name,
        description: vpc.description,
        cidr: vpc.cidr,
        account: vpc.account,
        domain: vpc.domain,
        zone: vpc.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVpc(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateVpc(formData);
    } else if (dialogMode === 'edit' && selectedVpc) {
      await handleUpdateVpc(selectedVpc.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Enabled': return 'success';
      case 'Disabled': return 'error';
      case 'Creating': return 'warning';
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
        <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
          VPC Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchVpcs}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create VPC
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
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Tier Count</TableCell>
                <TableCell>VM Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vpcs.map((vpc) => (
                <TableRow key={vpc.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <CloudIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {vpc.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{vpc.description}</TableCell>
                  <TableCell>{vpc.cidr}</TableCell>
                  <TableCell>
                    <Chip 
                      label={vpc.state} 
                      color={getStateColor(vpc.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{vpc.account}</TableCell>
                  <TableCell>{vpc.domain}</TableCell>
                  <TableCell>{vpc.zone}</TableCell>
                  <TableCell>{vpc.tierCount}</TableCell>
                  <TableCell>{vpc.vmCount}</TableCell>
                  <TableCell>{formatDate(vpc.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', vpc)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit VPC">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', vpc)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete VPC">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#6b7280' }}
                        onClick={() => handleDeleteVpc(vpc.id)}
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
          {dialogMode === 'create' ? 'Create New VPC' : 
           dialogMode === 'edit' ? 'Edit VPC' : 'VPC Details'}
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
              placeholder="10.0.0.0/16"
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

export default VPC; 