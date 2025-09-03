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
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Pause as PauseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import cloudstackService from '../services/cloudstackService';

const Instances = () => {
  const { t } = useTranslation();
  const { user, isUser, isAdmin, isSubprovider } = useAuth();
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    template: '',
    zone: '',
    service_offering: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchInstances();
  }, [user]);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des instances CloudStack...');
      
      // Récupérer les vraies instances CloudStack
      const cloudstackInstances = await cloudstackService.getVirtualMachines();
      console.log('✅ Instances CloudStack récupérées:', cloudstackInstances);
      
      // Transformer les données CloudStack en format compatible
      const transformedInstances = cloudstackInstances.map(instance => ({
        id: instance.id,
        name: instance.name || instance.displayname,
        template: instance.templatename,
        zone: instance.zonename,
        service_offering: instance.serviceofferingname,
        ip_address: instance.nic?.[0]?.ipaddress || 'N/A',
        created_at: instance.created,
        owner: instance.account,
        owner_id: instance.userid,
        state: instance.state,
        cpu: instance.cpunumber,
        memory: instance.memory
      }));
      
      console.log('✅ Instances transformées:', transformedInstances);
      setInstances(transformedInstances);
      setError(null);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des instances CloudStack:', error);
      setError('Erreur lors du chargement des instances');
      setInstances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, instance) => {
    setDialogMode(mode);
    if (instance) {
      setSelectedInstance(instance);
             setFormData({
         name: instance.name,
         template: instance.template,
         zone: instance.zone,
         service_offering: instance.service_offering
       });
         } else {
       setSelectedInstance(null);
       setFormData({
         name: '',
         template: '',
         zone: '',
         service_offering: ''
       });
     }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
         setOpenDialog(false);
     setSelectedInstance(null);
           setFormData({
         name: '',
         template: '',
         zone: '',
         service_offering: ''
       });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) {
        setSnackbar({ open: true, message: 'Le nom du VPS est requis', severity: 'error' });
        return;
      }

      if (dialogMode === 'create') {
        // Créer un nouveau VPS via CloudStack
        const vpsData = {
          name: formData.name,
          templateid: formData.template,
          zoneid: formData.zone,
          serviceofferingid: formData.service_offering
        };
        
        await cloudstackService.deployVirtualMachine(vpsData);
        setSnackbar({ open: true, message: 'VPS créé avec succès', severity: 'success' });
        
        // Rafraîchir la liste des VPS
        fetchInstances();
      } else if (dialogMode === 'edit' && selectedInstance) {
        // Note: CloudStack ne permet pas de modifier directement les VPS
        // On peut seulement modifier les métadonnées
        setSnackbar({ open: true, message: 'Modification des VPS non supportée par CloudStack', severity: 'warning' });
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la création/modification du VPS:', err);
      setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce VPS ?')) {
      try {
        await cloudstackService.destroyVirtualMachine(id);
        setSnackbar({ open: true, message: 'VPS supprimé avec succès', severity: 'success' });
        
        // Rafraîchir la liste des VPS
        fetchInstances();
      } catch (err) {
        console.error('Erreur lors de la suppression du VPS:', err);
        setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
      }
    }
  };

  const handleInstanceAction = async (instanceId, action) => {
    try {
      switch (action) {
        case 'running':
          await cloudstackService.startVirtualMachine(instanceId);
          setSnackbar({ open: true, message: 'VPS démarré avec succès', severity: 'success' });
          break;
        case 'stopped':
          await cloudstackService.stopVirtualMachine(instanceId);
          setSnackbar({ open: true, message: 'VPS arrêté avec succès', severity: 'success' });
          break;
        default:
          setSnackbar({ open: true, message: 'Action non supportée', severity: 'warning' });
          return;
      }
      
      // Rafraîchir la liste des VPS
      fetchInstances();
    } catch (err) {
      console.error('Erreur lors de l\'action sur le VPS:', err);
      setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
    }
  };

  const getStateColor = (state) => {
    switch (state?.toLowerCase()) {
      case 'running':
      case 'started':
        return 'success';
      case 'stopped':
      case 'stopping':
        return 'error';
      case 'starting':
        return 'warning';
      case 'destroyed':
        return 'error';
      case 'expunging':
        return 'warning';
      default: 
        return 'default';
    }
  };

  const getStateLabel = (state) => {
    switch (state?.toLowerCase()) {
      case 'running':
      case 'started':
        return 'En cours';
      case 'stopped':
      case 'stopping':
        return 'Arrêté';
      case 'starting':
        return 'Démarrage';
      case 'destroyed':
        return 'Supprimé';
      case 'expunging':
        return 'Suppression';
      default: 
        return state || 'Inconnu';
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
          {t('instances.title')}
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchInstances}
            sx={{ 
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc'
              }
            }}
          >
            {t('instances.refresh')}
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
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('instances.name')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('instances.template')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('instances.zone')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Offre de service</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('instances.ipAddress')}</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>État</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Date de création</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('instances.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {instances.map((instance) => (
                <TableRow key={instance.id} hover>
                  <TableCell>{instance.id}</TableCell>
                  <TableCell>{instance.name}</TableCell>
                  <TableCell>{instance.template}</TableCell>
                  <TableCell>{instance.zone}</TableCell>
                  <TableCell>{instance.service_offering}</TableCell>

                  <TableCell>{instance.ip_address}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStateLabel(instance.state)} 
                      color={getStateColor(instance.state)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(instance.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={t('instances.viewDetails')}>
                        <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('view', instance)}>
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('instances.editInstance')}>
                        <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('edit', instance)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {(instance.state === 'stopped' || instance.state === 'Stopped') && (
                        <Tooltip title="Démarrer">
                          <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleInstanceAction(instance.id, 'running')}>
                            <StartIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {(instance.state === 'running' || instance.state === 'Running') && (
                        <Tooltip title="Arrêter">
                          <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleInstanceAction(instance.id, 'stopped')}>
                            <StopIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('instances.deleteInstance')}>
                        <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleDelete(instance.id)}>
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
      </Paper>

      {instances.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Aucun VPS trouvé
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Créez votre premier VPS pour commencer
          </Typography>
        </Box>
      )}

      {/* Dialog pour créer/modifier/voir une instance */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouveau VPS' : 
           dialogMode === 'edit' ? 'Modifier le VPS' : 'Détails du VPS'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du VPS"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Template"
            fullWidth
            variant="outlined"
            value={formData.template}
            onChange={(e) => setFormData({ ...formData, template: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Zone"
            fullWidth
            variant="outlined"
            value={formData.zone}
            onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Offre de service"
            fullWidth
            variant="outlined"
            value={formData.service_offering}
            onChange={(e) => setFormData({ ...formData, service_offering: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
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

export default Instances; 