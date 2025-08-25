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
  Backup as BackupIcon, 
  Restore as RestoreIcon, 
  Download as DownloadIcon 
} from '@mui/icons-material';

const StorageSnapshots = () => {
  const [storageSnapshots, setStorageSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for storage snapshots
  const mockStorageSnapshots = [
    {
      id: 1,
      name: 'Web Server Backup',
      description: 'Backup of web server volume',
      volumeName: 'web-server-volume',
      size: 50,
      state: 'BackedUp',
      created: '2024-01-15T10:30:00Z',
      account: 'admin',
      domain: 'ROOT',
      tags: ['web', 'backup']
    },
    {
      id: 2,
      name: 'Database Snapshot',
      description: 'Database volume snapshot',
      volumeName: 'database-volume',
      size: 100,
      state: 'BackedUp',
      created: '2024-01-20T14:45:00Z',
      account: 'admin',
      domain: 'ROOT',
      tags: ['database', 'snapshot']
    },
    {
      id: 3,
      name: 'App Data Backup',
      description: 'Application data backup',
      volumeName: 'app-data-volume',
      size: 25,
      state: 'Creating',
      created: '2024-01-25T09:15:00Z',
      account: 'user1',
      domain: 'ROOT',
      tags: ['app', 'data']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    volumeName: '',
    account: '',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchStorageSnapshots();
  }, []);

  const fetchStorageSnapshots = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStorageSnapshots(mockStorageSnapshots);
      setError('');
    } catch (err) {
      setError('Failed to fetch storage snapshots');
      console.error('Error fetching storage snapshots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSnapshot = async (snapshotData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const newSnapshot = {
        id: Date.now(),
        ...snapshotData,
        size: 0,
        state: 'Creating',
        created: new Date().toISOString(),
        tags: []
      };
      setStorageSnapshots([...storageSnapshots, newSnapshot]);
      setSnackbar({ open: true, message: 'Storage snapshot created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create storage snapshot', severity: 'error' });
    }
  };

  const handleUpdateSnapshot = async (id, snapshotData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStorageSnapshots(storageSnapshots.map(snapshot => 
        snapshot.id === id ? { ...snapshot, ...snapshotData } : snapshot
      ));
      setSnackbar({ open: true, message: 'Storage snapshot updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update storage snapshot', severity: 'error' });
    }
  };

  const handleDeleteSnapshot = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setStorageSnapshots(storageSnapshots.filter(snapshot => snapshot.id !== id));
      setSnackbar({ open: true, message: 'Storage snapshot deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete storage snapshot', severity: 'error' });
    }
  };

  const handleRestoreSnapshot = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSnackbar({ open: true, message: 'Storage snapshot restored successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to restore storage snapshot', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, snapshot = null) => {
    setDialogMode(mode);
    setSelectedSnapshot(snapshot);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        volumeName: '',
        account: '',
        domain: 'ROOT'
      });
    } else if (snapshot) {
      setFormData({
        name: snapshot.name,
        description: snapshot.description,
        volumeName: snapshot.volumeName,
        account: snapshot.account,
        domain: snapshot.domain
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSnapshot(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateSnapshot(formData);
    } else if (dialogMode === 'edit' && selectedSnapshot) {
      await handleUpdateSnapshot(selectedSnapshot.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'BackedUp': return 'success';
      case 'Creating': return 'warning';
      case 'Failed': return 'error';
      case 'Destroyed': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSize = (size) => {
    return `${size} GB`;
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
          Storage Snapshots Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchStorageSnapshots}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Storage Snapshot
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
                <TableCell>Volume Name</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storageSnapshots.map((snapshot) => (
                <TableRow key={snapshot.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <BackupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {snapshot.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{snapshot.description}</TableCell>
                  <TableCell>{snapshot.volumeName}</TableCell>
                  <TableCell>{formatSize(snapshot.size)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={snapshot.state} 
                      color={getStateColor(snapshot.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{snapshot.account}</TableCell>
                  <TableCell>{snapshot.domain}</TableCell>
                  <TableCell>{formatDate(snapshot.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', snapshot)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Storage Snapshot">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', snapshot)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Restore Snapshot">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleRestoreSnapshot(snapshot.id)}
                      >
                        <RestoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Snapshot">
                      <IconButton 
                        size="small" 
                        color="secondary"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Storage Snapshot">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteSnapshot(snapshot.id)}
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
          {dialogMode === 'create' ? 'Create New Storage Snapshot' : 
           dialogMode === 'edit' ? 'Edit Storage Snapshot' : 'Storage Snapshot Details'}
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
              label="Volume Name"
              value={formData.volumeName}
              onChange={(e) => handleInputChange('volumeName', e.target.value)}
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

export default StorageSnapshots; 