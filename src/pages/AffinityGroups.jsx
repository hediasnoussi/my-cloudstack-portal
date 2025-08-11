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

const AffinityGroups = () => {
  const [affinityGroups, setAffinityGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for affinity groups
  const mockAffinityGroups = [
    {
      id: 1,
      name: 'Web Servers',
      description: 'Affinity group for web server instances',
      type: 'Host Affinity',
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-15T10:30:00Z',
      vmCount: 3,
      tags: ['web', 'servers']
    },
    {
      id: 2,
      name: 'Database Cluster',
      description: 'Affinity group for database instances',
      type: 'Host Anti-Affinity',
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-20T14:45:00Z',
      vmCount: 2,
      tags: ['database', 'cluster']
    },
    {
      id: 3,
      name: 'Load Balancers',
      description: 'Affinity group for load balancer instances',
      type: 'Host Affinity',
      state: 'Active',
      account: 'user1',
      domain: 'ROOT',
      created: '2024-01-25T09:15:00Z',
      vmCount: 1,
      tags: ['load', 'balancer']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Host Affinity',
    account: '',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchAffinityGroups();
  }, []);

  const fetchAffinityGroups = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAffinityGroups(mockAffinityGroups);
      setError('');
    } catch (err) {
      setError('Failed to fetch affinity groups');
      console.error('Error fetching affinity groups:', err);
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
        state: 'Active',
        created: new Date().toISOString(),
        vmCount: 0,
        tags: []
      };
      setAffinityGroups([...affinityGroups, newGroup]);
      setSnackbar({ open: true, message: 'Affinity group created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create affinity group', severity: 'error' });
    }
  };

  const handleUpdateGroup = async (id, groupData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAffinityGroups(affinityGroups.map(group => 
        group.id === id ? { ...group, ...groupData } : group
      ));
      setSnackbar({ open: true, message: 'Affinity group updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update affinity group', severity: 'error' });
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAffinityGroups(affinityGroups.filter(group => group.id !== id));
      setSnackbar({ open: true, message: 'Affinity group deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete affinity group', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, group = null) => {
    setDialogMode(mode);
    setSelectedGroup(group);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        type: 'Host Affinity',
        account: '',
        domain: 'ROOT'
      });
    } else if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        type: group.type,
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

  const getStateColor = (state) => {
    switch (state) {
      case 'Active': return 'success';
      case 'Inactive': return 'warning';
      case 'Disabled': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Host Affinity': return 'primary';
      case 'Host Anti-Affinity': return 'secondary';
      case 'Explicit Dedication': return 'warning';
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
          Affinity Groups Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAffinityGroups}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Affinity Group
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
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>VM Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {affinityGroups.map((group) => (
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
                      label={group.type} 
                      color={getTypeColor(group.type)}
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
                  <TableCell>{group.vmCount}</TableCell>
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
                    <Tooltip title="Edit Affinity Group">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', group)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Affinity Group">
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
          {dialogMode === 'create' ? 'Create New Affinity Group' : 
           dialogMode === 'edit' ? 'Edit Affinity Group' : 'Affinity Group Details'}
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
                <MenuItem value="Host Affinity">Host Affinity</MenuItem>
                <MenuItem value="Host Anti-Affinity">Host Anti-Affinity</MenuItem>
                <MenuItem value="Explicit Dedication">Explicit Dedication</MenuItem>
              </Select>
            </FormControl>
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

export default AffinityGroups; 