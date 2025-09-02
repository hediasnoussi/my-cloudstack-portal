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
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import cloudstackService from '../services/cloudstackService';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    account: 'admin',
    domainid: 'b4dc6fd1-820c-11f0-b443-0050568aa465'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les utilisateurs et comptes en parallèle
      const [usersData, accountsData] = await Promise.all([
        cloudstackService.getUsers(),
        cloudstackService.getAccounts()
      ]);
      
      setUsers(usersData);
      setAccounts(accountsData);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      setError('Erreur lors de la récupération des données utilisateurs');
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des données utilisateurs',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: '',
        account: user.account,
        domainid: user.domainid
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        account: 'admin',
        domainid: 'b4dc6fd1-820c-11f0-b443-0050568aa465'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      account: 'admin',
      domainid: 'b4dc6fd1-820c-11f0-b443-0050568aa465'
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        if (!formData.username || !formData.password || !formData.firstname || !formData.lastname || !formData.email) {
          throw new Error('Tous les champs sont requis');
        }

        const userData = {
          username: formData.username,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          account: formData.account,
          domainid: formData.domainid
        };

        console.log('🚀 Création de l\'utilisateur CloudStack avec les données:', userData);

        await cloudstackService.createUser(userData);

        console.log('✅ Utilisateur créé avec succès');

        setSnackbar({
          open: true,
          message: 'Utilisateur créé avec succès',
          severity: 'success'
        });

        await fetchData();
      } else if (dialogMode === 'edit' && selectedUser) {
        if (!formData.firstname || !formData.lastname || !formData.email) {
          throw new Error('Prénom, nom et email sont requis');
        }

        const userData = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email
        };

        console.log('✏️ Mise à jour de l\'utilisateur CloudStack:', selectedUser.id);

        await cloudstackService.updateUser(selectedUser.id, userData);

        console.log('✅ Utilisateur mis à jour avec succès');

        setSnackbar({
          open: true,
          message: 'Utilisateur mis à jour avec succès',
          severity: 'success'
        });

        await fetchData();
      }

      handleCloseDialog();
    } catch (err) {
      console.error('❌ Erreur lors de la gestion de l\'utilisateur:', err);
      setSnackbar({
        open: true,
        message: `Erreur: ${err.message}`,
        severity: 'error'
      });
    }
  };

  const handleDelete = async (userId) => {
    try {
      console.log('🗑️ Suppression de l\'utilisateur CloudStack:', userId);
      
      await cloudstackService.deleteUser(userId);
      
      console.log('✅ Utilisateur supprimé avec succès');
      
      await fetchData();
      
      setSnackbar({
        open: true,
        message: 'Utilisateur supprimé avec succès',
        severity: 'success'
      });
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de l\'utilisateur:', err);
      setSnackbar({
        open: true,
        message: `Erreur lors de la suppression de l'utilisateur: ${err.message}`,
        severity: 'error'
      });
    }
  };

  const handleToggleStatus = async (userId, currentState) => {
    try {
      const enabled = currentState === 'enabled';
      console.log('🔄 Mise à jour du statut utilisateur:', userId, 'enabled:', !enabled);
      
      await cloudstackService.updateUserStatus(userId, !enabled);
      
      console.log('✅ Statut utilisateur mis à jour avec succès');
      
      await fetchData();
      
      setSnackbar({
        open: true,
        message: `Utilisateur ${!enabled ? 'activé' : 'désactivé'} avec succès`,
        severity: 'success'
      });
    } catch (err) {
      console.error('❌ Erreur lors de la mise à jour du statut utilisateur:', err);
      setSnackbar({
        open: true,
        message: `Erreur lors de la mise à jour du statut: ${err.message}`,
        severity: 'error'
      });
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'enabled':
        return 'success';
      case 'disabled':
        return 'warning';
      case 'locked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getAccountTypeLabel = (accounttype) => {
    switch (accounttype) {
      case 0:
        return 'Utilisateur';
      case 1:
        return 'Admin';
      case 2:
        return 'Admin Domaine';
      default:
        return 'Inconnu';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          👥 Utilisateurs CloudStack
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            sx={{ mr: 2 }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Créer un Utilisateur
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Nom Complet</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Compte</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Domaine</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.account}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getAccountTypeLabel(user.accounttype)} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.domain}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.state} 
                      color={getStateColor(user.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(user.created)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleToggleStatus(user.id, user.state)}
                      title={user.state === 'enabled' ? 'Désactiver' : 'Activer'}
                    >
                      <Switch
                        checked={user.state === 'enabled'}
                        size="small"
                        readOnly
                      />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog('edit', user)}
                      title="Modifier"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
                      title="Supprimer"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog pour créer/modifier un utilisateur */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Créer un Utilisateur' : 'Modifier l\'Utilisateur'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={dialogMode === 'edit'}
            />
            
            <TextField
              fullWidth
              label="Prénom"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Nom"
              value={formData.lastname}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            
            {dialogMode === 'create' && (
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                sx={{ mb: 2 }}
                required
              />
            )}
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Compte</InputLabel>
              <Select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                label="Compte"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.name}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'create' ? 'Créer' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
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

export default UsersManagement;