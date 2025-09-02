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
  TrendingUp as TrendingUpIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const AutoscalingGroups = () => {
  const [autoscalingGroups, setAutoscalingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for autoscaling groups
  const mockAutoscalingGroups = [
    {
      id: 1,
      name: 'Web Server ASG',
      description: 'Autoscaling group for web servers',
      minSize: 2,
      maxSize: 10,
      desiredCapacity: 3,
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      instanceCount: 3,
      tags: ['web', 'autoscaling']
    },
    {
      id: 2,
      name: 'API Server ASG',
      description: 'Autoscaling group for API servers',
      minSize: 1,
      maxSize: 5,
      desiredCapacity: 2,
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      instanceCount: 2,
      tags: ['api', 'autoscaling']
    },
    {
      id: 3,
      name: 'Database ASG',
      description: 'Autoscaling group for database servers',
      minSize: 1,
      maxSize: 3,
      desiredCapacity: 1,
      state: 'Inactive',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      instanceCount: 1,
      tags: ['database', 'autoscaling']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minSize: 1,
    maxSize: 5,
    desiredCapacity: 2,
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchAutoscalingGroups();
  }, []);

  const fetchAutoscalingGroups = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutoscalingGroups(mockAutoscalingGroups);
      setError('');
    } catch (err) {
      setError('Failed to fetch autoscaling groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newGroup = {
        id: Date.now(),
        ...groupData,
        state: 'Creating',
        created: new Date().toISOString(),
        instanceCount: groupData.desiredCapacity,
        tags: []
      };
      setAutoscalingGroups([...autoscalingGroups, newGroup]);
      setSnackbar({ open: true, message: 'Autoscaling group created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create autoscaling group', severity: 'error' });
    }
  };

  const handleUpdateGroup = async (id, groupData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAutoscalingGroups(autoscalingGroups.map(group => 
        group.id === id ? { ...group, ...groupData } : group
      ));
      setSnackbar({ open: true, message: 'Autoscaling group updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update autoscaling group', severity: 'error' });
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAutoscalingGroups(autoscalingGroups.filter(group => group.id !== id));
      setSnackbar({ open: true, message: 'Autoscaling group deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete autoscaling group', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, group = null) => {
    setDialogMode(mode);
    setSelectedGroup(group);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        minSize: 1,
        maxSize: 5,
        desiredCapacity: 2,
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        minSize: group.minSize,
        maxSize: group.maxSize,
        desiredCapacity: group.desiredCapacity,
        account: group.account,
        domain: group.domain,
        zone: group.zone
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

  const getStateColor = (state) => {
    switch (state) {
      case 'Active': return 'success';
      case 'Inactive': return 'error';
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
          Autoscaling Groups Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAutoscalingGroups}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Autoscaling Group
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
                <TableCell>Min Size</TableCell>
                <TableCell>Max Size</TableCell>
                <TableCell>Desired Capacity</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Instance Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {autoscalingGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <TrendingUpIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {group.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{group.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={group.minSize} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={group.maxSize} 
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={group.desiredCapacity} 
                      color="info"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={group.state} 
                      color={getStateColor(group.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{group.account}</TableCell>
                  <TableCell>{group.domain}</TableCell>
                  <TableCell>{group.zone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={group.instanceCount} 
                      color="success"
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
                    <Tooltip title="Edit Autoscaling Group">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', group)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Autoscaling Group">
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New Autoscaling Group' : 
           dialogMode === 'edit' ? 'Edit Autoscaling Group' : 'Autoscaling Group Details'}
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
              label="Min Size"
              type="number"
              value={formData.minSize}
              onChange={(e) => handleInputChange('minSize', parseInt(e.target.value))}
              margin="normal"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Max Size"
              type="number"
              value={formData.maxSize}
              onChange={(e) => handleInputChange('maxSize', parseInt(e.target.value))}
              margin="normal"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Desired Capacity"
              type="number"
              value={formData.desiredCapacity}
              onChange={(e) => handleInputChange('desiredCapacity', parseInt(e.target.value))}
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

export default AutoscalingGroups; 