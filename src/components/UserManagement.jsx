import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel,
  Grid,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import hierarchyService from '../services/hierarchyService';

const UserManagement = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' ou 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    max_vps: 0,
    max_cpu: 0,
    max_ram: 0,
    max_storage: 0
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      // Charger les utilisateurs depuis l'API
      const response = await hierarchyService.getMyHierarchy();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        setMessage({ type: 'error', text: response.message || 'Erreur lors du chargement des utilisateurs' });
        setUsers([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'subprovider': return 'Fournisseur Secondaire';
      case 'partner': return 'Partenaire/Agent';
      case 'user': return 'Client Final';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'subprovider': return 'primary';
      case 'partner': return 'warning';
      case 'user': return 'success';
      default: return 'default';
    }
  };

  const getAvailableRoles = () => {
    if (user.role === 'subprovider') {
      return ['partner'];
    } else if (user.role === 'partner') {
      return ['user'];
    }
    return [];
  };

  const getDefaultQuotas = (role) => {
    switch (role) {
      case 'partner':
        return { max_vps: 100, max_cpu: 100, max_ram: 1000, max_storage: 10000 };
      case 'user':
        return { max_vps: 10, max_cpu: 10, max_ram: 100, max_storage: 1000 };
      default:
        return { max_vps: 0, max_cpu: 0, max_ram: 0, max_storage: 0 };
    }
  };

  const handleOpenDialog = (mode, userData = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && userData) {
      setSelectedUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        password: '',
        role: userData.role,
        max_vps: userData.max_vps,
        max_cpu: userData.max_cpu,
        max_ram: userData.max_ram,
        max_storage: userData.max_storage
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: getAvailableRoles()[0] || '',
        ...getDefaultQuotas(getAvailableRoles()[0] || '')
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
      role: '',
      max_vps: 0,
      max_cpu: 0,
      max_ram: 0,
      max_storage: 0
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Mettre à jour automatiquement les quotas par défaut si le rôle change
    if (field === 'role') {
      const defaultQuotas = getDefaultQuotas(value);
      setFormData(prev => ({
        ...prev,
        role: value,
        ...defaultQuotas
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!formData.username || !formData.email || (!selectedUser && !formData.password)) {
        setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
        return;
      }

      setLoading(true);

      if (dialogMode === 'create') {
        // Appel API pour créer l'utilisateur
        const response = await hierarchyService.createChildUser(formData);
        
        if (response.success) {
          setMessage({ type: 'success', text: 'Utilisateur créé avec succès' });
          handleCloseDialog();
          loadUsers(); // Recharger la liste
        } else {
          setMessage({ type: 'error', text: response.message || 'Erreur lors de la création' });
        }
      } else {
        // Appel API pour modifier l'utilisateur
        const response = await hierarchyService.updateChildUser(selectedUser.id, formData);
        
        if (response.success) {
          setMessage({ type: 'success', text: 'Utilisateur modifié avec succès' });
          handleCloseDialog();
          loadUsers(); // Recharger la liste
        } else {
          setMessage({ type: 'error', text: response.message || 'Erreur lors de la modification' });
        }
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        setLoading(true);
        
        // Appel API pour supprimer l'utilisateur
        const response = await hierarchyService.deleteChildUser(userId);
        
        if (response.success) {
          setMessage({ type: 'success', text: 'Utilisateur supprimé avec succès' });
          loadUsers(); // Recharger la liste
        } else {
          setMessage({ type: 'error', text: response.message || 'Erreur lors de la suppression' });
        }
        
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
      } finally {
        setLoading(false);
      }
    }
  };

  const getQuotaPercentage = (used, max) => {
    return max > 0 ? Math.round((used / max) * 100) : 0;
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Chargement des utilisateurs...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Message de notification */}
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      {/* En-tête */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Gestion des {user.role === 'subprovider' ? 'Partenaires' : 'Clients'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez les utilisateurs sous votre responsabilité et leurs quotas
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUsers}
            disabled={loading}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Ajouter un {user.role === 'subprovider' ? 'Partenaire' : 'Client'}
          </Button>
        </Box>
      </Box>

      {/* Table des utilisateurs */}
      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Utilisateur</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Quotas VPS</TableCell>
                  <TableCell>Quotas CPU</TableCell>
                  <TableCell>Quotas RAM</TableCell>
                  <TableCell>Quotas Storage</TableCell>
                  <TableCell>Date création</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: getRoleColor(userItem.role) + '.main', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {userItem.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {userItem.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getRoleDisplayName(userItem.role)} 
                        color={getRoleColor(userItem.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={userItem.status} 
                        color={userItem.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {userItem.used_vps} / {userItem.max_vps}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={getQuotaPercentage(userItem.used_vps, userItem.max_vps)}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {userItem.used_cpu} / {userItem.max_cpu}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={getQuotaPercentage(userItem.used_cpu, userItem.max_cpu)}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {userItem.used_ram} / {userItem.max_ram} GB
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={getQuotaPercentage(userItem.used_ram, userItem.max_ram)}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {userItem.used_storage} / {userItem.max_storage} GB
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={getQuotaPercentage(userItem.used_storage, userItem.max_storage)}
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {userItem.created_at}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="Voir les détails">
                          <IconButton size="small" sx={{ color: '#6b7280' }}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#6b7280' }}
                            onClick={() => handleOpenDialog('edit', userItem)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#6b7280' }}
                            onClick={() => handleDeleteUser(userItem.id)}
                          >
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
        </CardContent>
      </Card>

      {/* Dialog de création/modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' 
            ? `Ajouter un ${user.role === 'subprovider' ? 'Partenaire' : 'Client'}`
            : 'Modifier l\'utilisateur'
          }
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required={dialogMode === 'create'}
                  helperText={dialogMode === 'edit' ? 'Laissez vide pour ne pas changer' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Rôle</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    label="Rôle"
                  >
                    {getAvailableRoles().map(role => (
                      <MenuItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Quotas */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Quotas de ressources
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max VPS"
                  type="number"
                  value={formData.max_vps}
                  onChange={(e) => handleInputChange('max_vps', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max CPU"
                  type="number"
                  value={formData.max_cpu}
                  onChange={(e) => handleInputChange('max_cpu', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max RAM (GB)"
                  type="number"
                  value={formData.max_ram}
                  onChange={(e) => handleInputChange('max_ram', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Max Storage (GB)"
                  type="number"
                  value={formData.max_storage}
                  onChange={(e) => handleInputChange('max_storage', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            startIcon={<SaveIcon />}
          >
            {dialogMode === 'create' ? 'Créer' : 'Modifier'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
