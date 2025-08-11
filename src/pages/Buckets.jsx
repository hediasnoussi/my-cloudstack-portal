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
  Storage as StorageIcon, 
  Download as DownloadIcon 
} from '@mui/icons-material';

const Buckets = () => {
  const [buckets, setBuckets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedBucket, setSelectedBucket] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for buckets
  const mockBuckets = [
    {
      id: 1,
      name: 'web-assets-bucket',
      description: 'Storage bucket for web assets',
      size: '2.5 GB',
      objectCount: 150,
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      tags: ['web', 'assets']
    },
    {
      id: 2,
      name: 'backup-storage-bucket',
      description: 'Storage bucket for backups',
      size: '15.8 GB',
      objectCount: 45,
      state: 'Active',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      tags: ['backup', 'storage']
    },
    {
      id: 3,
      name: 'logs-bucket',
      description: 'Storage bucket for application logs',
      size: '8.2 GB',
      objectCount: 320,
      state: 'Inactive',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      tags: ['logs', 'storage']
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
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBuckets(mockBuckets);
      setError('');
    } catch (err) {
      setError('Failed to fetch buckets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBucket = async (bucketData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBucket = {
        id: Date.now(),
        ...bucketData,
        state: 'Creating',
        size: '0 GB',
        objectCount: 0,
        created: new Date().toISOString(),
        tags: []
      };
      setBuckets([...buckets, newBucket]);
      setSnackbar({ open: true, message: 'Bucket created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create bucket', severity: 'error' });
    }
  };

  const handleUpdateBucket = async (id, bucketData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBuckets(buckets.map(bucket => 
        bucket.id === id ? { ...bucket, ...bucketData } : bucket
      ));
      setSnackbar({ open: true, message: 'Bucket updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update bucket', severity: 'error' });
    }
  };

  const handleDeleteBucket = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBuckets(buckets.filter(bucket => bucket.id !== id));
      setSnackbar({ open: true, message: 'Bucket deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete bucket', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, bucket = null) => {
    setDialogMode(mode);
    setSelectedBucket(bucket);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (bucket) {
      setFormData({
        name: bucket.name,
        description: bucket.description,
        account: bucket.account,
        domain: bucket.domain,
        zone: bucket.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBucket(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateBucket(formData);
    } else if (dialogMode === 'edit' && selectedBucket) {
      await handleUpdateBucket(selectedBucket.id, formData);
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
          Buckets Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchBuckets}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Bucket
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
                <TableCell>Object Count</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buckets.map((bucket) => (
                <TableRow key={bucket.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {bucket.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{bucket.description}</TableCell>
                  <TableCell>{bucket.size}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bucket.objectCount} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={bucket.state} 
                      color={getStateColor(bucket.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{bucket.account}</TableCell>
                  <TableCell>{bucket.domain}</TableCell>
                  <TableCell>{bucket.zone}</TableCell>
                  <TableCell>{formatDate(bucket.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', bucket)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Bucket">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', bucket)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Bucket">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteBucket(bucket.id)}
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
          {dialogMode === 'create' ? 'Create New Bucket' : 
           dialogMode === 'edit' ? 'Edit Bucket' : 'Bucket Details'}
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
    </Box>
  );
};

export default Buckets; 