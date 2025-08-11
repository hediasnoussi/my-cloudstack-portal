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
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';
import { useTranslation } from 'react-i18next';

const UsersManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    account_id: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      console.log('Users response:', response.data);
      setUsers(response.data || []);
      setError(null);
    } catch (err) {
      setError(`${t('users.errorLoadingUsers')}: ${err.message}`);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, user) => {
    setDialogMode(mode);
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        account_id: user.account_id?.toString() || ''
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user',
        account_id: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      account_id: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await apiService.createUser(formData);
        setSnackbar({ open: true, message: t('users.userCreatedSuccess'), severity: 'success' });
      } else {
        await apiService.updateUser(selectedUser.id, formData);
        setSnackbar({ open: true, message: t('users.userUpdatedSuccess'), severity: 'success' });
      }
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      const errorMessage = dialogMode === 'create' ? t('users.errorCreatingUser') : t('users.errorUpdatingUser');
      setSnackbar({ open: true, message: `${errorMessage}: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteUser(id);
      setSnackbar({ open: true, message: t('users.userDeletedSuccess'), severity: 'success' });
      fetchUsers();
    } catch (err) {
      setSnackbar({ open: true, message: `${t('users.errorDeletingUser')}: ${err.message}`, severity: 'error' });
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return t('users.admin');
      case 'user':
        return t('users.user');
      default:
        return role;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {t('users.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchUsers}>
            {t('users.refresh')}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog('create')}>
            + {t('users.newUser')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('users.username')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('users.email')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('users.role')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('users.accountId')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('users.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={getRoleLabel(user.role)} 
                    color={user.role === 'admin' ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{user.account_id}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('users.viewUser')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('users.editUser')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('edit', user)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('users.deleteUser')}>
                      <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDelete(user.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? t('users.newUser') : t('users.editUser')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label={t('users.username')} 
              value={formData.username} 
              onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('users.email')} 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('users.password')} 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('users.role')}</InputLabel>
              <Select 
                value={formData.role} 
                label={t('users.role')} 
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="user">{t('users.user')}</MenuItem>
                <MenuItem value="admin">{t('users.admin')}</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              fullWidth 
              label={t('users.accountId')} 
              value={formData.account_id} 
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })} 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersManagement;