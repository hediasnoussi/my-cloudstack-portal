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
  Group as GroupIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const InstanceGroups = () => {
  const [instanceGroups, setInstanceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Message de test pour vérifier le routage
  console.log('✅ InstanceGroups component loaded successfully!');

  // Mock data for instance groups
  const mockInstanceGroups = [
    {
      id: 1,
      name: 'Web Server Group',
      description: 'Instance group for web servers',
      instanceCount: 3,
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      tags: ['web', 'group']
    },
    {
      id: 2,
      name: 'Database Group',
      description: 'Instance group for database servers',
      instanceCount: 2,
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      tags: ['database', 'group']
    },
    {
      id: 3,
      name: 'Development Group',
      description: 'Instance group for development servers',
      instanceCount: 1,
      state: 'Inactive',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      tags: ['development', 'group']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchInstanceGroups();
  }, []);

  const fetchInstanceGroups = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInstanceGroups(mockInstanceGroups);
      setError('');
    } catch (err) {
      setError('Failed to fetch instance groups');
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
        instanceCount: 0,
        tags: []
      };
      setInstanceGroups([...instanceGroups, newGroup]);
      setSnackbar({ open: true, message: 'Instance group created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create instance group', severity: 'error' });
    }
  };

  const handleUpdateGroup = async (id, groupData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setInstanceGroups(instanceGroups.map(group => 
        group.id === id ? { ...group, ...groupData } : group
      ));
      setSnackbar({ open: true, message: 'Instance group updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update instance group', severity: 'error' });
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setInstanceGroups(instanceGroups.filter(group => group.id !== id));
      setSnackbar({ open: true, message: 'Instance group deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete instance group', severity: 'error' });
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
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (group) {
      setFormData({
        name: group.name,
        description: group.description,
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
    <div className="w-full">
      <div className="mb-6 mt-8">
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
          Gestion des Groupes d'Instances
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }}>
          Gérez vos groupes d'instances CloudStack
        </Typography>
      </div>

      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInstanceGroups}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Instance Group
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
              {instanceGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {group.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{group.description}</TableCell>
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
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(group.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#6b7280' }}
                        onClick={() => handleOpenDialog('view', group)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Instance Group">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#6b7280' }}
                        onClick={() => handleOpenDialog('edit', group)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Instance Group">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#6b7280' }}
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
          {dialogMode === 'create' ? 'Create New Instance Group' : 
           dialogMode === 'edit' ? 'Edit Instance Group' : 'Instance Group Details'}
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
    </div>
  );
};

export default InstanceGroups; 