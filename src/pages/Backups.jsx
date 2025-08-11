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
  Restore as RestoreIcon 
} from '@mui/icons-material';

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for backups
  const mockBackups = [
    {
      id: 1,
      name: 'Web Server Backup',
      description: 'Backup of web server instance',
      type: 'Instance Backup',
      size: '15.2 GB',
      state: 'Completed',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-15T10:30:00Z',
      tags: ['web', 'backup']
    },
    {
      id: 2,
      name: 'Database Backup',
      description: 'Backup of database server instance',
      type: 'Volume Backup',
      size: '8.7 GB',
      state: 'Completed',
      account: 'admin',
      domain: 'ROOT',
      zone: 'Zone1',
      created: '2024-01-20T14:45:00Z',
      tags: ['database', 'backup']
    },
    {
      id: 3,
      name: 'Development Backup',
      description: 'Backup of development environment',
      type: 'Instance Backup',
      size: '12.1 GB',
      state: 'In Progress',
      account: 'user1',
      domain: 'ROOT',
      zone: 'Zone2',
      created: '2024-01-25T09:15:00Z',
      tags: ['development', 'backup']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Instance Backup',
    account: '',
    domain: 'ROOT',
    zone: 'Zone1'
  });

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBackups(mockBackups);
      setError('');
    } catch (err) {
      setError('Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (backupData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBackup = {
        id: Date.now(),
        ...backupData,
        state: 'Creating',
        size: '0 GB',
        created: new Date().toISOString(),
        tags: []
      };
      setBackups([...backups, newBackup]);
      setSnackbar({ open: true, message: 'Backup created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create backup', severity: 'error' });
    }
  };

  const handleUpdateBackup = async (id, backupData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBackups(backups.map(backup => 
        backup.id === id ? { ...backup, ...backupData } : backup
      ));
      setSnackbar({ open: true, message: 'Backup updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update backup', severity: 'error' });
    }
  };

  const handleDeleteBackup = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setBackups(backups.filter(backup => backup.id !== id));
      setSnackbar({ open: true, message: 'Backup deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete backup', severity: 'error' });
    }
  };

  const handleRestoreBackup = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSnackbar({ open: true, message: 'Backup restore initiated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to restore backup', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, backup = null) => {
    setDialogMode(mode);
    setSelectedBackup(backup);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        type: 'Instance Backup',
        account: '',
        domain: 'ROOT',
        zone: 'Zone1'
      });
    } else if (backup) {
      setFormData({
        name: backup.name,
        description: backup.description,
        type: backup.type,
        account: backup.account,
        domain: backup.domain,
        zone: backup.zone
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBackup(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateBackup(formData);
    } else if (dialogMode === 'edit' && selectedBackup) {
      await handleUpdateBackup(selectedBackup.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Failed': return 'error';
      case 'Creating': return 'info';
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
          Backups Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchBackups}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create Backup
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
                <TableCell>Size</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <BackupIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {backup.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{backup.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={backup.type} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <Chip 
                      label={backup.state} 
                      color={getStateColor(backup.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{backup.account}</TableCell>
                  <TableCell>{backup.domain}</TableCell>
                  <TableCell>{backup.zone}</TableCell>
                  <TableCell>{formatDate(backup.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', backup)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Restore Backup">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleRestoreBackup(backup.id)}
                      >
                        <RestoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Backup">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', backup)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Backup">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteBackup(backup.id)}
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
          {dialogMode === 'create' ? 'Create New Backup' : 
           dialogMode === 'edit' ? 'Edit Backup' : 'Backup Details'}
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
                <MenuItem value="Instance Backup">Instance Backup</MenuItem>
                <MenuItem value="Volume Backup">Volume Backup</MenuItem>
                <MenuItem value="Template Backup">Template Backup</MenuItem>
                <MenuItem value="Full Backup">Full Backup</MenuItem>
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

export default Backups; 