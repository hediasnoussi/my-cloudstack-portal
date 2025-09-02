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
  Image as ImageIcon, 
  Download as DownloadIcon 
} from '@mui/icons-material';

const ISOs = () => {
  const [isos, setIsos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedIso, setSelectedIso] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for ISOs
  const mockIsos = [
    {
      id: 1,
      name: 'Ubuntu 22.04 LTS',
      description: 'Ubuntu 22.04 LTS Server ISO',
      size: '1.2 GB',
      format: 'ISO',
      state: 'Ready',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      tags: ['ubuntu', 'server']
    },
    {
      id: 2,
      name: 'CentOS 8',
      description: 'CentOS 8 Server ISO',
      size: '8.5 GB',
      format: 'ISO',
      state: 'Ready',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      tags: ['centos', 'server']
    },
    {
      id: 3,
      name: 'Windows Server 2019',
      description: 'Windows Server 2019 ISO',
      size: '4.8 GB',
      format: 'ISO',
      state: 'Uploading',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      tags: ['windows', 'server']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    format: 'ISO',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchIsos();
  }, []);

  const fetchIsos = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsos(mockIsos);
      setError('');
    } catch (err) {
      setError('Failed to fetch ISOs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIso = async (isoData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newIso = {
        id: Date.now(),
        ...isoData,
        state: 'Uploading',
        size: '0 GB',
        created: new Date().toISOString(),
        tags: []
      };
      setIsos([...isos, newIso]);
      setSnackbar({ open: true, message: 'ISO created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create ISO', severity: 'error' });
    }
  };

  const handleUpdateIso = async (id, isoData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsos(isos.map(iso => 
        iso.id === id ? { ...iso, ...isoData } : iso
      ));
      setSnackbar({ open: true, message: 'ISO updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update ISO', severity: 'error' });
    }
  };

  const handleDeleteIso = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsos(isos.filter(iso => iso.id !== id));
      setSnackbar({ open: true, message: 'ISO deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete ISO', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, iso = null) => {
    setDialogMode(mode);
    setSelectedIso(iso);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        format: 'ISO',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (iso) {
      setFormData({
        name: iso.name,
        description: iso.description,
        format: iso.format,
        account: iso.account,
        domain: iso.domain,
        zone: iso.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIso(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateIso(formData);
    } else if (dialogMode === 'edit' && selectedIso) {
      await handleUpdateIso(selectedIso.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Ready': return 'success';
      case 'Uploading': return 'warning';
      case 'Failed': return 'error';
      case 'Processing': return 'info';
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
          ISOs Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchIsos}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Upload ISO
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
                <TableCell>Format</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isos.map((iso) => (
                <TableRow key={iso.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {iso.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{iso.description}</TableCell>
                  <TableCell>{iso.size}</TableCell>
                  <TableCell>
                    <Chip 
                      label={iso.format} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={iso.state} 
                      color={getStateColor(iso.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{iso.account}</TableCell>
                  <TableCell>{iso.domain}</TableCell>
                  <TableCell>{iso.zone}</TableCell>
                  <TableCell>{formatDate(iso.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', iso)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download ISO">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => setSnackbar({ open: true, message: 'ISO download started', severity: 'success' })}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit ISO">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', iso)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete ISO">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteIso(iso.id)}
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
          {dialogMode === 'create' ? 'Upload New ISO' : 
           dialogMode === 'edit' ? 'Edit ISO' : 'ISO Details'}
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
              <InputLabel>Format</InputLabel>
              <Select
                value={formData.format}
                onChange={(e) => handleInputChange('format', e.target.value)}
                label="Format"
              >
                <MenuItem value="ISO">ISO</MenuItem>
                <MenuItem value="VHD">VHD</MenuItem>
                <MenuItem value="VMDK">VMDK</MenuItem>
                <MenuItem value="RAW">RAW</MenuItem>
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
              {dialogMode === 'create' ? 'Upload' : 'Update'}
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

export default ISOs; 