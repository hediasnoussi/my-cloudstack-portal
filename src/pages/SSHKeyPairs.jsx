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
  VpnKey as KeyIcon, 
  Download as DownloadIcon 
} from '@mui/icons-material';

const SSHKeyPairs = () => {
  const [sshKeyPairs, setSshKeyPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedKey, setSelectedKey] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for SSH key pairs
  const mockSshKeyPairs = [
    {
      id: 1,
      name: 'Web Server Key',
      description: 'SSH key for web server access',
      fingerprint: 'SHA256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-15T10:30:00Z',
      vmCount: 3,
      tags: ['web', 'ssh']
    },
    {
      id: 2,
      name: 'Database Server Key',
      description: 'SSH key for database server access',
      fingerprint: 'SHA256:def456ghi789jkl012mno345pqr678stu901vwx234yzabc123',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-20T14:45:00Z',
      vmCount: 2,
      tags: ['database', 'ssh']
    },
    {
      id: 3,
      name: 'Development Key',
      description: 'SSH key for development servers',
      fingerprint: 'SHA256:ghi789jkl012mno345pqr678stu901vwx234yzabc123def456',
      account: 'user1',
      domain: 'ROOT',
      created: '2024-01-25T09:15:00Z',
      vmCount: 1,
      tags: ['development', 'ssh']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    publicKey: '',
    account: '',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchSshKeyPairs();
  }, []);

  const fetchSshKeyPairs = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSshKeyPairs(mockSshKeyPairs);
      setError('');
    } catch (err) {
      setError('Failed to fetch SSH key pairs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKeyPair = async (keyData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newKeyPair = {
        id: Date.now(),
        ...keyData,
        fingerprint: 'SHA256:newfingerprint' + Date.now(),
        created: new Date().toISOString(),
        vmCount: 0,
        tags: []
      };
      setSshKeyPairs([...sshKeyPairs, newKeyPair]);
      setSnackbar({ open: true, message: 'SSH key pair created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create SSH key pair', severity: 'error' });
    }
  };

  const handleUpdateKeyPair = async (id, keyData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSshKeyPairs(sshKeyPairs.map(key => 
        key.id === id ? { ...key, ...keyData } : key
      ));
      setSnackbar({ open: true, message: 'SSH key pair updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update SSH key pair', severity: 'error' });
    }
  };

  const handleDeleteKeyPair = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSshKeyPairs(sshKeyPairs.filter(key => key.id !== id));
      setSnackbar({ open: true, message: 'SSH key pair deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete SSH key pair', severity: 'error' });
    }
  };

  const handleDownloadKey = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSnackbar({ open: true, message: 'SSH key downloaded successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to download SSH key', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, key = null) => {
    setDialogMode(mode);
    setSelectedKey(key);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        publicKey: '',
        account: '',
        domain: 'ROOT'
      });
    } else if (key) {
      setFormData({
        name: key.name,
        description: key.description,
        publicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...',
        account: key.account,
        domain: key.domain
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedKey(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateKeyPair(formData);
    } else if (dialogMode === 'edit' && selectedKey) {
      await handleUpdateKeyPair(selectedKey.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateFingerprint = (fingerprint) => {
    return fingerprint.length > 30 ? fingerprint.substring(0, 30) + '...' : fingerprint;
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
          SSH Key Pairs Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSshKeyPairs}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create SSH Key Pair
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
                <TableCell>Fingerprint</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>VM Count</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sshKeyPairs.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <KeyIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {key.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{key.description}</TableCell>
                  <TableCell>
                    <Tooltip title={key.fingerprint}>
                      <Typography variant="body2" fontFamily="monospace">
                        {truncateFingerprint(key.fingerprint)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{key.account}</TableCell>
                  <TableCell>{key.domain}</TableCell>
                  <TableCell>
                    <Chip 
                      label={key.vmCount} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(key.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', key)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Private Key">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleDownloadKey(key.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit SSH Key Pair">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', key)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete SSH Key Pair">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteKeyPair(key.id)}
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
          {dialogMode === 'create' ? 'Create New SSH Key Pair' : 
           dialogMode === 'edit' ? 'Edit SSH Key Pair' : 'SSH Key Pair Details'}
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
              label="Public Key"
              value={formData.publicKey}
              onChange={(e) => handleInputChange('publicKey', e.target.value)}
              margin="normal"
              multiline
              rows={4}
              disabled={dialogMode === 'view'}
              placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
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

export default SSHKeyPairs; 