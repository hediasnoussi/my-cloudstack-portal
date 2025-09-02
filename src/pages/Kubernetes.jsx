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
  Settings as SettingsIcon 
} from '@mui/icons-material';

const Kubernetes = () => {
  const [kubernetesClusters, setKubernetesClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for Kubernetes clusters
  const mockKubernetesClusters = [
    {
      id: 1,
      name: 'Production Cluster',
      description: 'Kubernetes cluster for production workloads',
      version: '1.24.0',
      state: 'Running',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      nodeCount: 5,
      podCount: 25,
      tags: ['production', 'kubernetes']
    },
    {
      id: 2,
      name: 'Development Cluster',
      description: 'Kubernetes cluster for development environment',
      version: '1.23.0',
      state: 'Running',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      nodeCount: 3,
      podCount: 12,
      tags: ['development', 'kubernetes']
    },
    {
      id: 3,
      name: 'Testing Cluster',
      description: 'Kubernetes cluster for testing environment',
      version: '1.22.0',
      state: 'Stopped',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      nodeCount: 2,
      podCount: 8,
      tags: ['testing', 'kubernetes']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    version: '1.24.0',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchKubernetesClusters();
  }, []);

  const fetchKubernetesClusters = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setKubernetesClusters(mockKubernetesClusters);
      setError('');
    } catch (err) {
      setError('Failed to fetch Kubernetes clusters');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCluster = async (clusterData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newCluster = {
        id: Date.now(),
        ...clusterData,
        state: 'Creating',
        created: new Date().toISOString(),
        nodeCount: 0,
        podCount: 0,
        tags: []
      };
      setKubernetesClusters([...kubernetesClusters, newCluster]);
      setSnackbar({ open: true, message: 'Kubernetes cluster created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create Kubernetes cluster', severity: 'error' });
    }
  };

  const handleUpdateCluster = async (id, clusterData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setKubernetesClusters(kubernetesClusters.map(cluster => 
        cluster.id === id ? { ...cluster, ...clusterData } : cluster
      ));
      setSnackbar({ open: true, message: 'Kubernetes cluster updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update Kubernetes cluster', severity: 'error' });
    }
  };

  const handleDeleteCluster = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setKubernetesClusters(kubernetesClusters.filter(cluster => cluster.id !== id));
      setSnackbar({ open: true, message: 'Kubernetes cluster deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete Kubernetes cluster', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, cluster = null) => {
    setDialogMode(mode);
    setSelectedCluster(cluster);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        version: '1.24.0',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (cluster) {
      setFormData({
        name: cluster.name,
        description: cluster.description,
        version: cluster.version,
        account: cluster.account,
        domain: cluster.domain,
        zone: cluster.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCluster(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateCluster(formData);
    } else if (dialogMode === 'edit' && selectedCluster) {
      await handleUpdateCluster(selectedCluster.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Running': return 'success';
      case 'Stopped': return 'error';
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
          Kubernetes Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchKubernetesClusters}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Kubernetes Cluster
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
                <TableCell>Version</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Node Count</TableCell>
                <TableCell>Pod Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kubernetesClusters.map((cluster) => (
                <TableRow key={cluster.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {cluster.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{cluster.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cluster.version} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={cluster.state} 
                      color={getStateColor(cluster.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{cluster.account}</TableCell>
                  <TableCell>{cluster.domain}</TableCell>
                  <TableCell>{cluster.zone}</TableCell>
                  <TableCell>
                    <Chip 
                      label={cluster.nodeCount} 
                      color="secondary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={cluster.podCount} 
                      color="info"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(cluster.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', cluster)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Kubernetes Cluster">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', cluster)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Kubernetes Cluster">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteCluster(cluster.id)}
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
          {dialogMode === 'create' ? 'Create New Kubernetes Cluster' : 
           dialogMode === 'edit' ? 'Edit Kubernetes Cluster' : 'Kubernetes Cluster Details'}
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
              <InputLabel>Version</InputLabel>
              <Select
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                label="Version"
              >
                <MenuItem value="1.24.0">1.24.0</MenuItem>
                <MenuItem value="1.23.0">1.23.0</MenuItem>
                <MenuItem value="1.22.0">1.22.0</MenuItem>
                <MenuItem value="1.21.0">1.21.0</MenuItem>
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

export default Kubernetes; 