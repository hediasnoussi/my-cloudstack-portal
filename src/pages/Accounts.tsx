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
import { Account, CreateAccountRequest, UpdateAccountRequest } from '../types';
import { apiService } from '../services/api';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [domains, setDomains] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState({
    name: '',
    domain_id: '',
    role_id: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchAccounts();
    fetchDomains();
    fetchRoles();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAccounts();
      setAccounts(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(`Erreur lors du chargement des comptes: ${err.message}`);
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDomains = async () => {
    try {
      const response = await apiService.getDomains();
      setDomains(response.data.data || []);
    } catch (err) {
      console.error('Error fetching domains:', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await apiService.getRoles();
      setRoles(response.data.data || []);
    } catch (err) {
      console.error('Error fetching roles:', err);
    }
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', account?: Account) => {
    setDialogMode(mode);
    if (account) {
      setSelectedAccount(account);
      setFormData({
        name: account.name,
        domain_id: account.domain_id?.toString() || '',
        role_id: account.role_id?.toString() || ''
      });
    } else {
      setSelectedAccount(null);
      setFormData({
        name: '',
        domain_id: '',
        role_id: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
    setFormData({
      name: '',
      domain_id: '',
      role_id: ''
    });
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        domain_id: formData.domain_id ? parseInt(formData.domain_id) : undefined,
        role_id: formData.role_id ? parseInt(formData.role_id) : undefined
      };

      if (dialogMode === 'create') {
        await apiService.createAccount(submitData);
        setSnackbar({ open: true, message: 'Compte créé avec succès', severity: 'success' });
      } else if (dialogMode === 'edit' && selectedAccount) {
        await apiService.updateAccount(selectedAccount.id, submitData);
        setSnackbar({ open: true, message: 'Compte modifié avec succès', severity: 'success' });
      }
      handleCloseDialog();
      fetchAccounts();
    } catch (err: any) {
      setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      try {
        await apiService.deleteAccount(id);
        setSnackbar({ open: true, message: 'Compte supprimé avec succès', severity: 'success' });
        fetchAccounts();
      } catch (err: any) {
        setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Gestion des Comptes
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAccounts}
            sx={{ mr: 2 }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Nouveau Compte
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Domaine</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>
                    {account.domain_id ? 
                      domains.find(dom => dom.id === account.domain_id)?.name || account.domain_id :
                      'Aucun'
                    }
                  </TableCell>
                  <TableCell>
                    {account.role_id ? 
                      roles.find(role => role.id === account.role_id)?.name || account.role_id :
                      'Aucun'
                    }
                  </TableCell>
                  <TableCell>
                    <Chip label="Actif" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Voir">
                      <IconButton size="small" onClick={() => handleOpenDialog('view', account)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => handleOpenDialog('edit', account)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small" onClick={() => handleDelete(account.id)}>
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

      {accounts.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Aucun compte trouvé
          </Typography>
        </Box>
      )}

      {/* Dialog pour créer/modifier/voir un compte */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouveau Compte' : 
           dialogMode === 'edit' ? 'Modifier le Compte' : 'Détails du Compte'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du compte"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Domaine</InputLabel>
            <Select
              value={formData.domain_id}
              label="Domaine"
              onChange={(e) => setFormData({ ...formData, domain_id: e.target.value })}
              disabled={dialogMode === 'view'}
            >
              <MenuItem value="">Aucun domaine</MenuItem>
              {domains.map((domain) => (
                <MenuItem key={domain.id} value={domain.id.toString()}>
                  {domain.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Rôle</InputLabel>
            <Select
              value={formData.role_id}
              label="Rôle"
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
              disabled={dialogMode === 'view'}
            >
              <MenuItem value="">Aucun rôle</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {dialogMode === 'create' ? 'Créer' : 'Modifier'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Accounts; 