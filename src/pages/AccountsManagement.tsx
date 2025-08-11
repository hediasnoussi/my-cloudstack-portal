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
import { Account, CreateAccountRequest, UpdateAccountRequest, Role, Domain } from '../types';
import { apiService } from '../services/api';
import { useTranslation } from 'react-i18next';

const AccountsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState({
    name: '',
    state: 'enabled' as 'enabled' | 'disabled',
    role_id: '',
    domain_id: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsResponse, rolesResponse, domainsResponse] = await Promise.all([
        apiService.getAccounts(),
        apiService.getRoles(),
        apiService.getDomains()
      ]);
      
      console.log('Accounts response:', accountsResponse.data);
      console.log('Roles response:', rolesResponse.data);
      console.log('Domains response:', domainsResponse.data);
      
      setAccounts(accountsResponse.data || []);
      setRoles(rolesResponse.data || []);
      setDomains(domainsResponse.data || []);
      setError(null);
    } catch (err: any) {
      setError(`${t('accounts.errorLoadingAccounts')}: ${err.message}`);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', account?: Account) => {
    setDialogMode(mode);
    if (account) {
      setSelectedAccount(account);
      setFormData({
        name: account.name,
        state: account.state,
        role_id: account.role_id?.toString() || '',
        domain_id: account.domain_id?.toString() || ''
      });
    } else {
      setSelectedAccount(null);
      setFormData({
        name: '',
        state: 'enabled',
        role_id: '',
        domain_id: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
    setFormData({
      name: '',
      state: 'enabled',
      role_id: '',
      domain_id: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await apiService.createAccount(formData as CreateAccountRequest);
        setSnackbar({ open: true, message: t('accounts.accountCreatedSuccess'), severity: 'success' });
      } else {
        await apiService.updateAccount(selectedAccount!.id, formData as UpdateAccountRequest);
        setSnackbar({ open: true, message: t('accounts.accountUpdatedSuccess'), severity: 'success' });
      }
      handleCloseDialog();
      fetchData();
    } catch (err: any) {
      const errorMessage = dialogMode === 'create' ? t('accounts.errorCreatingAccount') : t('accounts.errorUpdatingAccount');
      setSnackbar({ open: true, message: `${errorMessage}: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteAccount(id);
      setSnackbar({ open: true, message: t('accounts.accountDeletedSuccess'), severity: 'success' });
      fetchData();
    } catch (err: any) {
      setSnackbar({ open: true, message: `${t('accounts.errorDeletingAccount')}: ${err.message}`, severity: 'error' });
    }
  };

  const getRoleName = (roleId?: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : '-';
  };

  const getDomainName = (domainId?: number) => {
    const domain = domains.find(d => d.id === domainId);
    return domain ? domain.name : '-';
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
        return t('accounts.enabled');
      case 'disabled':
        return t('accounts.disabled');
      default:
        return state;
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
          {t('accounts.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            {t('accounts.refresh')}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog('create')}>
            + {t('accounts.newAccount')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('accounts.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('accounts.type')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('accounts.state')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('accounts.domain')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('accounts.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{account.name}</TableCell>
                <TableCell>{getRoleName(account.role_id)}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStateLabel(account.state)} 
                    color={getStateColor(account.state)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{getDomainName(account.domain_id)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('accounts.viewAccount')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('accounts.editAccount')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('edit', account)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('accounts.deleteAccount')}>
                      <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDelete(account.id)}>
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
          {dialogMode === 'create' ? t('accounts.newAccount') : t('accounts.editAccount')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label={t('accounts.name')} 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('accounts.type')}</InputLabel>
              <Select 
                value={formData.role_id} 
                label={t('accounts.type')} 
                onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('accounts.state')}</InputLabel>
              <Select 
                value={formData.state} 
                label={t('accounts.state')} 
                onChange={(e) => setFormData({ ...formData, state: e.target.value as 'enabled' | 'disabled' })}
              >
                <MenuItem value="enabled">{t('accounts.enabled')}</MenuItem>
                <MenuItem value="disabled">{t('accounts.disabled')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t('accounts.domain')}</InputLabel>
              <Select 
                value={formData.domain_id} 
                label={t('accounts.domain')} 
                onChange={(e) => setFormData({ ...formData, domain_id: e.target.value })}
              >
                {domains.map((domain) => (
                  <MenuItem key={domain.id} value={domain.id}>
                    {domain.name}
                  </MenuItem>
                ))}
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

export default AccountsManagement; 