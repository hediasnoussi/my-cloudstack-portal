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
  Security as SecurityIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const SecurityGroups = () => {
  const [securityGroups, setSecurityGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for security groups
  const mockSecurityGroups = [
    {
      id: 1,
      name: 'Web Server SG',
      description: 'Security group for web servers',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-15T10:30:00Z',
      vmCount: 3,
      ruleCount: 5,
      tags: ['web', 'security']
    },
    {
      id: 2,
      name: 'Database SG',
      description: 'Security group for database servers',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-20T14:45:00Z',
      vmCount: 2,
      ruleCount: 3,
      tags: ['database', 'security']
    },
    {
      id: 3,
      name: 'Load Balancer SG',
      description: 'Security group for load balancers',
      account: 'user1',
      domain: 'ROOT',
      created: '2024-01-25T09:15:00Z',
      vmCount: 1,
      ruleCount: 4,
      tags: ['load', 'balancer']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    account: '',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchSecurityGroups();
  }, []);

  const fetchSecurityGroups = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSecurityGroups(mockSecurityGroups);
      setError('');
    } catch (err) {
      setError('Failed to fetch security groups');
      console.error('Error fetching security groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newGroup = {
        id: Date.now(),
        ...groupData,
        created: new Date().toISOString(),
        vmCount: 0,
        ruleCount: 0,
        tags: []
      };
      setSecurityGroups([...securityGroups, newGroup]);
      setSnackbar({ open: true, message: 'Security group created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create security group', severity: 'error' });
    }
  };

  const handleUpdateGroup = async (id, groupData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSecurityGroups(securityGroups.map(group => 
        group.id === id ? { ...group, ...groupData } : group
      ));
      setSnackbar({ open: true, message: 'Security group updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update security group', severity: 'error' });
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSecurityGroups(securityGroups.filter(group => group.id !== id));
      setSnackbar({ open: true, message: 'Security group deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete security group', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, group = null) => {
    setDialogMode(mode);
    setSelectedGroup(group);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        account: '',
        domain: 'ROOT'
      });
    } else if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        account: group.account,
        domain: group.domain
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroup(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateGroup(formData);
    } else if (dialogMode === 'edit' && selectedGroup) {
      await handleUpdateGroup(selectedGroup.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          Security Groups Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSecurityGroups}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Security Group
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
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>VM Count</TableCell>
                <TableCell>Rule Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {securityGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {group.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>{group.account}</TableCell>
                  <TableCell>{group.domain}</TableCell>
                  <TableCell>
                    <Chip 
                      label={group.vmCount} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={group.ruleCount} 
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(group.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', group)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Security Group">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', group)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Security Group">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteGroup(group.id)}
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
          {dialogMode === 'create' ? 'Create New Security Group' : 
           dialogMode === 'edit' ? 'Edit Security Group' : 'Security Group Details'}
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

export default SecurityGroups; 