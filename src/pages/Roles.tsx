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

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRoles();
      setRoles(response.data.data || []);
      setError(null);
    } catch (err: any) {
      setError(`Erreur lors du chargement des rôles: ${err.message}`);
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
        description: role.description || ''
      });
    } else {
      setSelectedRole(null);
      setFormData({
        name: '',
        type: '',
        description: ''
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
      description: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await apiService.createRole(formData);
        setSnackbar({ open: true, message: 'Rôle créé avec succès', severity: 'success' });
      } else if (dialogMode === 'edit' && selectedRole) {
        await apiService.updateRole(selectedRole.id, formData);
        setSnackbar({ open: true, message: 'Rôle modifié avec succès', severity: 'success' });
      }
      handleCloseDialog();
      fetchRoles();
    } catch (err: any) {
      setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      try {
        await apiService.deleteRole(id);
        setSnackbar({ open: true, message: 'Rôle supprimé avec succès', severity: 'success' });
        fetchRoles();
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
          Gestion des Rôles
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchRoles}
            sx={{ mr: 2 }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Nouveau Rôle
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
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={role.type || 'Standard'}
                      color={role.type === 'Admin' ? 'error' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{role.description || 'Aucune description'}</TableCell>
                  <TableCell>
                    <Chip label="Actif" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Voir">
                      <IconButton size="small" onClick={() => handleOpenDialog('view', role)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => handleOpenDialog('edit', role)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small" onClick={() => handleDelete(role.id)}>
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

      {roles.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Aucun rôle trouvé
          </Typography>
        </Box>
      )}

      {/* Dialog pour créer/modifier/voir un rôle */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouveau Rôle' : 
           dialogMode === 'edit' ? 'Modifier le Rôle' : 'Détails du Rôle'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du rôle"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              disabled={dialogMode === 'view'}
            >
              <MenuItem value="">Standard</MenuItem>
              <MenuItem value="Admin">Administrateur</MenuItem>
              <MenuItem value="User">Utilisateur</MenuItem>
              <MenuItem value="DomainAdmin">Admin de Domaine</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={dialogMode === 'view'}
          />
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

export default Roles; 