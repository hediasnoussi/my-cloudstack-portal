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
import { Role, CreateRoleRequest, UpdateRoleRequest } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from 'react-i18next';

const RolesManagement: React.FC = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    state: 'enabled' as 'enabled' | 'disabled'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRoles();
      setRoles((response.data as Role[]) || []);
      setError(null);
    } catch (err: any) {
      setError(`${t('roles.errorLoadingRoles')}: ${err.message}`);
      console.error('Error fetching roles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', role?: Role) => {
    setDialogMode(mode);
    if (role) {
      setSelectedRole(role);
      setFormData({
        name: role.name,
        type: role.type || '',
        description: role.description || '',
        state: role.state
      });
    } else {
      setSelectedRole(null);
      setFormData({
        name: '',
        type: '',
        description: '',
        state: 'enabled'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRole(null);
    setFormData({
      name: '',
      type: '',
      description: '',
      state: 'enabled'
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await apiService.createRole(formData as CreateRoleRequest);
        setSnackbar({ open: true, message: t('roles.roleCreatedSuccess'), severity: 'success' });
      } else {
        await apiService.updateRole(selectedRole!.id, formData as UpdateRoleRequest);
        setSnackbar({ open: true, message: t('roles.roleUpdatedSuccess'), severity: 'success' });
      }
      handleCloseDialog();
      fetchRoles();
    } catch (err: any) {
      const errorMessage = dialogMode === 'create' ? t('roles.errorCreatingRole') : t('roles.errorUpdatingRole');
      setSnackbar({ open: true, message: `${errorMessage}: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteRole(id);
      setSnackbar({ open: true, message: t('roles.roleDeletedSuccess'), severity: 'success' });
      fetchRoles();
    } catch (err: any) {
      setSnackbar({ open: true, message: `${t('roles.errorDeletingRole')}: ${err.message}`, severity: 'error' });
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'enabled':
        return 'success';
      case 'disabled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'enabled':
        return t('roles.enabled');
      case 'disabled':
        return t('roles.disabled');
      default:
        return state;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'admin':
        return t('roles.admin');
      case 'user':
        return t('roles.user');
      case 'readonly':
        return t('roles.readOnly');
      default:
        return type;
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
          {t('roles.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchRoles}>
            {t('roles.refresh')}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog('create')}>
            + {t('roles.newRole')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('roles.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('roles.description')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('roles.type')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('roles.state')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('roles.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{role.name}</TableCell>
                <TableCell>{role.description || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={getTypeLabel(role.type || '')} 
                    color="primary" 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStateLabel(role.state)} 
                    color={getStateColor(role.state)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('roles.viewRole')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('roles.editRole')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('edit', role)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('roles.deleteRole')}>
                      <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDelete(role.id)}>
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
          {dialogMode === 'create' ? t('roles.newRole') : t('roles.editRole')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label={t('roles.name')} 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('roles.description')} 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              multiline 
              rows={3} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('roles.type')}</InputLabel>
              <Select 
                value={formData.type} 
                label={t('roles.type')} 
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="admin">{t('roles.admin')}</MenuItem>
                <MenuItem value="user">{t('roles.user')}</MenuItem>
                <MenuItem value="readonly">{t('roles.readOnly')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('roles.state')}</InputLabel>
              <Select 
                value={formData.state} 
                label={t('roles.state')} 
                onChange={(e) => setFormData({ ...formData, state: e.target.value as 'enabled' | 'disabled' })}
              >
                <MenuItem value="enabled">{t('roles.enabled')}</MenuItem>
                <MenuItem value="disabled">{t('roles.disabled')}</MenuItem>
              </Select>
            </FormControl>
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

export default RolesManagement; 