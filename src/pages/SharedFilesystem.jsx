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
  Folder as FolderIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const SharedFilesystem = () => {
  const [sharedFilesystems, setSharedFilesystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedFilesystem, setSelectedFilesystem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for shared filesystems
  const mockSharedFilesystems = [
    {
      id: 1,
      name: 'Shared Data Volume',
      description: 'Shared filesystem for application data',
      size: '100 GB',
      mountPoint: '/mnt/shared-data',
      state: 'Mounted',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      vmCount: 3,
      tags: ['shared', 'data']
    },
    {
      id: 2,
      name: 'Log Storage Volume',
      description: 'Shared filesystem for log storage',
      size: '50 GB',
      mountPoint: '/mnt/logs',
      state: 'Mounted',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      vmCount: 2,
      tags: ['shared', 'logs']
    },
    {
      id: 3,
      name: 'Backup Volume',
      description: 'Shared filesystem for backups',
      size: '200 GB',
      mountPoint: '/mnt/backups',
      state: 'Unmounted',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      vmCount: 1,
      tags: ['shared', 'backup']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    size: '',
    mountPoint: '',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchSharedFilesystems();
  }, []);

  const fetchSharedFilesystems = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSharedFilesystems(mockSharedFilesystems);
      setError('');
    } catch (err) {
      setError('Failed to fetch shared filesystems');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFilesystem = async (filesystemData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newFilesystem = {
        id: Date.now(),
        ...filesystemData,
        state: 'Creating',
        created: new Date().toISOString(),
        vmCount: 0,
        tags: []
      };
      setSharedFilesystems([...sharedFilesystems, newFilesystem]);
      setSnackbar({ open: true, message: 'Shared filesystem created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create shared filesystem', severity: 'error' });
    }
  };

  const handleUpdateFilesystem = async (id, filesystemData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSharedFilesystems(sharedFilesystems.map(filesystem => 
        filesystem.id === id ? { ...filesystem, ...filesystemData } : filesystem
      ));
      setSnackbar({ open: true, message: 'Shared filesystem updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update shared filesystem', severity: 'error' });
    }
  };

  const handleDeleteFilesystem = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSharedFilesystems(sharedFilesystems.filter(filesystem => filesystem.id !== id));
      setSnackbar({ open: true, message: 'Shared filesystem deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete shared filesystem', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, filesystem = null) => {
    setDialogMode(mode);
    setSelectedFilesystem(filesystem);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        size: '',
        mountPoint: '',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (filesystem) {
      setFormData({
        name: filesystem.name,
        description: filesystem.description,
        size: filesystem.size,
        mountPoint: filesystem.mountPoint,
        account: filesystem.account,
        domain: filesystem.domain,
        zone: filesystem.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFilesystem(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateFilesystem(formData);
    } else if (dialogMode === 'edit' && selectedFilesystem) {
      await handleUpdateFilesystem(selectedFilesystem.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Mounted': return 'success';
      case 'Unmounted': return 'error';
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
          Shared Filesystem Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSharedFilesystems}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Shared Filesystem
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
                <TableCell>Size</TableCell>
                <TableCell>Mount Point</TableCell>
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
              {sharedFilesystems.map((filesystem) => (
                <TableRow key={filesystem.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {filesystem.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{filesystem.description}</TableCell>
                  <TableCell>{filesystem.size}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      {filesystem.mountPoint}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={filesystem.state} 
                      color={getStateColor(filesystem.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{filesystem.account}</TableCell>
                  <TableCell>{filesystem.domain}</TableCell>
                  <TableCell>{filesystem.zone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={filesystem.vmCount} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(filesystem.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', filesystem)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Shared Filesystem">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', filesystem)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Shared Filesystem">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteFilesystem(filesystem.id)}
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
          {dialogMode === 'create' ? 'Create New Shared Filesystem' : 
           dialogMode === 'edit' ? 'Edit Shared Filesystem' : 'Shared Filesystem Details'}
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
              label="Size"
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              margin="normal"
              placeholder="100 GB"
              disabled={dialogMode === 'view'}
            />
            <TextField
              fullWidth
              label="Mount Point"
              value={formData.mountPoint}
              onChange={(e) => handleInputChange('mountPoint', e.target.value)}
              margin="normal"
              placeholder="/mnt/shared-data"
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

export default SharedFilesystem; 