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
  Group as GroupIcon, 
  Settings as SettingsIcon 
} from '@mui/icons-material';
import cloudstackService from '../services/cloudstackService';

const InstanceGroups = () => {
  const [instanceGroups, setInstanceGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    account: 'admin',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchInstanceGroups();
  }, []);

  const fetchInstanceGroups = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await cloudstackService.getInstanceGroups();
      setInstanceGroups(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des groupes d\'instances:', err);
      setError('Erreur lors de la récupération des groupes d\'instances');
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des groupes d\'instances',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, group = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && group) {
      setSelectedGroup(group);
      setFormData({
        name: group.name,
        description: group.description || '',
        account: group.account,
        domain: group.domain
      });
    } else {
      setSelectedGroup(null);
      setFormData({
        name: '',
        description: '',
        account: 'admin',
        domain: 'ROOT'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroup(null);
    setFormData({
      name: '',
      description: '',
      account: 'admin',
      domain: 'ROOT'
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        if (!formData.name) {
          throw new Error('Le nom du groupe est requis');
        }

        const groupData = {
          name: formData.name,
          account: formData.account,
          domainid: 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
        };

        console.log('🚀 Création du groupe d\'instances avec les données:', groupData);

        await cloudstackService.createInstanceGroup(groupData);

        console.log('✅ Groupe d\'instances créé avec succès');

        await fetchInstanceGroups();

        setSnackbar({ 
          open: true, 
          message: 'Groupe d\'instances créé avec succès', 
          severity: 'success' 
        });
      } else if (dialogMode === 'edit') {
        if (!formData.name) {
          throw new Error('Le nom du groupe est requis');
        }

        const groupData = {
          name: formData.name
        };

        console.log('✏️ Mise à jour du groupe d\'instances:', selectedGroup.id);

        await cloudstackService.updateInstanceGroup(selectedGroup.id, groupData);

        console.log('✅ Groupe d\'instances mis à jour avec succès');

        await fetchInstanceGroups();

        setSnackbar({ 
          open: true, 
          message: 'Groupe d\'instances mis à jour avec succès', 
          severity: 'success' 
        });
      }
      handleCloseDialog();
    } catch (err) {
      console.error('❌ Erreur lors de la gestion du groupe d\'instances:', err);
      setSnackbar({ 
        open: true, 
        message: `Erreur: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('🗑️ Suppression du groupe d\'instances CloudStack:', id);
      
      await cloudstackService.deleteInstanceGroup(id);
      
      console.log('✅ Groupe d\'instances supprimé avec succès');
      
      await fetchInstanceGroups();
      
      setSnackbar({ 
        open: true, 
        message: 'Groupe d\'instances supprimé avec succès', 
        severity: 'success' 
      });
    } catch (err) {
      console.error('❌ Erreur lors de la suppression du groupe d\'instances:', err);
      setSnackbar({ 
        open: true, 
        message: `Erreur lors de la suppression du groupe d'instances: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Error':
        return 'error';
      default:
        return 'default';
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
          👥 Groupes d'Instances CloudStack
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInstanceGroups}
            sx={{ mr: 2 }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Créer un Groupe
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
                <TableCell>Nom</TableCell>
                <TableCell>Compte</TableCell>
                <TableCell>Domaine</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Instances</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instanceGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.account}</TableCell>
                  <TableCell>{group.domain}</TableCell>
                  <TableCell>
                    <Chip 
                      label={group.state} 
                      color={getStateColor(group.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{group.virtualMachineCount}</TableCell>
                  <TableCell>{formatDate(group.created)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog('edit', group)}
                      title="Modifier"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(group.id)}
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

      {/* Dialog pour créer/éditer un groupe */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Créer un Groupe d\'Instances' : 'Modifier le Groupe'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom du groupe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Compte</InputLabel>
              <Select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                label="Compte"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user1">User1</MenuItem>
                <MenuItem value="user2">User2</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Domaine</InputLabel>
              <Select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                label="Domaine"
              >
                <MenuItem value="ROOT">ROOT</MenuItem>
                <MenuItem value="Domain1">Domain1</MenuItem>
                <MenuItem value="Domain2">Domain2</MenuItem>
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

export default InstanceGroups; 