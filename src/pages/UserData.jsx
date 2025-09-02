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
import cloudstackService from '../services/cloudstackService';

const UserData = () => {
  const [userDataItems, setUserDataItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    displaytext: '',
    templateid: '1',
    userdata: '',
    account: 'admin',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchUserDataItems();
  }, []);

  const fetchUserDataItems = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await cloudstackService.getUserData();
      setUserDataItems(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des user data:', err);
      setError('Erreur lors de la récupération des user data');
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des user data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, item = null) => {
    setDialogMode(mode);
    setSelectedItem(item);
    if (mode === 'create') {
      setFormData({
        name: '',
        displaytext: '',
        templateid: '1',
        userdata: '',
        account: 'admin',
        domain: 'ROOT'
      });
    } else if (item) {
              setFormData({
          name: item.name,
          displaytext: item.displaytext || item.name,
          templateid: item.templateid || '1',
          userdata: item.userdata || '',
          account: item.account,
          domain: item.domain
        });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({
      name: '',
      displaytext: '',
      templateid: '1',
      userdata: '',
      account: 'admin',
      domain: 'ROOT'
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        if (!formData.name || !formData.displaytext) {
          throw new Error('Le nom et la description sont requis');
        }

        // Pour CloudStack, nous ne pouvons pas créer de templates directement sans image source
        // Nous allons plutôt créer une instance avec user data
        const vmData = {
          name: formData.name,
          displayname: formData.displaytext,
          templateid: formData.templateid,
          serviceofferingid: '1', // Service offering par défaut
          zoneid: '1', // Zone par défaut
          userdata: formData.userdata,
          account: formData.account,
          domainid: 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
        };

        console.log('📄 Création d\'une instance avec user data:', vmData);

        // Utiliser le service de création d'instances existant
        await cloudstackService.deployVirtualMachine(vmData);

        console.log('✅ Instance avec user data créée avec succès');

        setSnackbar({ 
          open: true, 
          message: 'Instance avec user data créée avec succès', 
          severity: 'success' 
        });

        await fetchUserDataItems();
      } else if (dialogMode === 'edit' && selectedItem) {
        if (!formData.displaytext) {
          throw new Error('La description est requise');
        }

        // Pour les instances existantes, nous ne pouvons pas modifier le user data
        // Nous pouvons seulement afficher les informations
        setSnackbar({ 
          open: true, 
          message: 'Le user data ne peut pas être modifié après la création de l\'instance', 
          severity: 'warning' 
        });
      }
      handleCloseDialog();
    } catch (err) {
      console.error('❌ Erreur lors de la gestion du user data:', err);
      setSnackbar({ 
        open: true, 
        message: `Erreur: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('🗑️ Suppression du template avec user data CloudStack:', id);
      
      await cloudstackService.deleteUserDataTemplate(id);
      
      console.log('✅ Template avec user data supprimé avec succès');
      
      await fetchUserDataItems();
      
      setSnackbar({ 
        open: true, 
        message: 'Template avec user data supprimé avec succès', 
        severity: 'success' 
      });
    } catch (err) {
      console.error('❌ Erreur lors de la suppression du template avec user data:', err);
      setSnackbar({ 
        open: true, 
        message: `Erreur lors de la suppression du template avec user data: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'Ready':
      case 'enabled':
        return 'success';
      case 'Creating':
      case 'Processing':
        return 'warning';
      case 'Error':
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const formatUserData = (userdata) => {
    if (!userdata) return 'Aucune';
    if (userdata.length > 50) {
      return userdata.substring(0, 50) + '...';
    }
    return userdata;
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
          📄 User Data CloudStack
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUserDataItems}
            sx={{ mr: 2 }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Créer une Instance avec User Data
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
                <TableCell>Type</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>User Data</TableCell>
                <TableCell>Compte</TableCell>
                <TableCell>Domaine</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userDataItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DataIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {item.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.type} 
                      color={item.type === 'Template' ? 'primary' : 'secondary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={item.source} 
                      color="default"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={item.userdata || 'Aucune'}>
                      <span>{formatUserData(item.userdata)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{item.account}</TableCell>
                  <TableCell>{item.domain}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.state} 
                      color={getStateColor(item.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(item.created)}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog('view', item)}
                      title="Voir les détails"
                    >
                      <ViewIcon />
                    </IconButton>
                    {item.source === 'template' && (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog('edit', item)}
                          title="Modifier"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item.id)}
                          title="Supprimer"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog pour créer/modifier un template avec user data */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Créer une Instance avec User Data' : 
           dialogMode === 'edit' ? 'Modifier l\'Instance avec User Data' : 
           'Détails de l\'Instance avec User Data'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nom de l'instance"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={dialogMode === 'view'}
            />
            
            <TextField
              fullWidth
              label="Description"
              value={formData.displaytext}
              onChange={(e) => setFormData({ ...formData, displaytext: e.target.value })}
              sx={{ mb: 2 }}
              required
              disabled={dialogMode === 'view'}
            />
            
            <TextField
              fullWidth
              label="Template ID"
              value={formData.templateid || '1'}
              onChange={(e) => setFormData({ ...formData, templateid: e.target.value })}
              sx={{ mb: 2 }}
              disabled={dialogMode === 'view'}
              helperText="ID du template à utiliser (ex: 1 pour le template par défaut)"
            />
            
            <TextField
              fullWidth
              label="User Data Script"
              value={formData.userdata}
              onChange={(e) => setFormData({ ...formData, userdata: e.target.value })}
              multiline
              rows={8}
              sx={{ mb: 2 }}
              disabled={dialogMode === 'view'}
              placeholder="#!/bin/bash&#10;# Script d'initialisation&#10;echo 'Démarrage du script user data...'&#10;# Ajoutez vos commandes d'initialisation ici"
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Compte</InputLabel>
              <Select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                label="Compte"
                disabled={dialogMode === 'view'}
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
                disabled={dialogMode === 'view'}
              >
                <MenuItem value="ROOT">ROOT</MenuItem>
                <MenuItem value="Domain1">Domain1</MenuItem>
                <MenuItem value="Domain2">Domain2</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Fermer' : 'Annuler'}
          </Button>
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