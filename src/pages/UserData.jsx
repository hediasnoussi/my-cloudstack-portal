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
  DataObject as DataIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';

const UserData = () => {
  const [userDataItems, setUserDataItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for user data items
  const mockUserDataItems = [
    {
      id: 1,
      name: 'Web Server Script',
      description: 'User data script for web server initialization',
      type: 'Shell Script',
      size: '2.5 KB',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-15T10:30:00Z',
      tags: ['web', 'script']
    },
    {
      id: 2,
      name: 'Database Setup',
      description: 'User data script for database server setup',
      type: 'Shell Script',
      size: '1.8 KB',
      account: 'admin',
      domain: 'ROOT',
      created: '2024-01-20T14:45:00Z',
      tags: ['database', 'script']
    },
    {
      id: 3,
      name: 'Development Environment',
      description: 'User data script for development environment setup',
      type: 'Cloud-init',
      size: '3.2 KB',
      account: 'user1',
      domain: 'ROOT',
      created: '2024-01-25T09:15:00Z',
      tags: ['development', 'script']
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Shell Script',
    content: '',
    account: '',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchUserDataItems();
  }, []);

  const fetchUserDataItems = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserDataItems(mockUserDataItems);
      setError('');
    } catch (err) {
      setError('Failed to fetch user data items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (itemData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newItem = {
        id: Date.now(),
        ...itemData,
        size: `${Math.round(itemData.content.length / 1024 * 10) / 10} KB`,
        created: new Date().toISOString(),
        tags: []
      };
      setUserDataItems([...userDataItems, newItem]);
      setSnackbar({ open: true, message: 'User data item created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to create user data item', severity: 'error' });
    }
  };

  const handleUpdateItem = async (id, itemData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserDataItems(userDataItems.map(item => 
        item.id === id ? { ...item, ...itemData, size: `${Math.round(itemData.content.length / 1024 * 10) / 10} KB` } : item
      ));
      setSnackbar({ open: true, message: 'User data item updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to update user data item', severity: 'error' });
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserDataItems(userDataItems.filter(item => item.id !== id));
      setSnackbar({ open: true, message: 'User data item deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to delete user data item', severity: 'error' });
    }
  };

  const handleOpenDialog = (mode, item = null) => {
    setDialogMode(mode);
    setSelectedItem(item);
    if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        type: 'Shell Script',
        content: '',
        account: '',
        domain: 'ROOT'
      });
    } else if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        type: item.type,
        content: '#!/bin/bash\n# Sample user data script\n\necho "Starting user data script..."\n# Add your initialization commands here',
        account: item.account,
        domain: item.domain
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSubmit = async () => {
    if (dialogMode === 'create') {
      await handleCreateItem(formData);
    } else if (dialogMode === 'edit' && selectedItem) {
      await handleUpdateItem(selectedItem.id, formData);
    }
    handleCloseDialog();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          User Data Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUserDataItems}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Create User Data
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
                <TableCell>Account</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userDataItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <DataIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.type} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.account}</TableCell>
                  <TableCell>{item.domain}</TableCell>
                  <TableCell>{formatDate(item.created)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('view', item)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit User Data">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog('edit', item)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User Data">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteItem(item.id)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Create New User Data' : 
           dialogMode === 'edit' ? 'Edit User Data' : 'User Data Details'}
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
                <MenuItem value="Shell Script">Shell Script</MenuItem>
                <MenuItem value="Cloud-init">Cloud-init</MenuItem>
                <MenuItem value="YAML">YAML</MenuItem>
                <MenuItem value="JSON">JSON</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              margin="normal"
              multiline
              rows={8}
              disabled={dialogMode === 'view'}
              placeholder="Enter your user data script content here..."
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

export default UserData; 