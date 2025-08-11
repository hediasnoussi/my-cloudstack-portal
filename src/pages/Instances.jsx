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

const Instances = () => {
  const { t } = useTranslation();
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
  }, []);

  const fetchInstances = async () => {
    try {
      setLoading(true);
      // Simuler des données d'instances pour l'instant
      const mockInstances = [
                 {
           id: 1,
           name: 'Web Server 1',
           template: 'Ubuntu 20.04',
           zone: 'Zone 1',
           service_offering: 'Small',
           ip_address: '192.168.1.100',
           created_at: '2024-01-15T10:30:00Z'
         },
                 {
           id: 2,
           name: 'Database Server',
           template: 'CentOS 8',
           zone: 'Zone 1',
           service_offering: 'Medium',
           ip_address: '192.168.1.101',
           created_at: '2024-01-14T15:45:00Z'
         }
      ];
      setInstances(mockInstances);
      setError(null);
    } catch (err) {
      setError(`${t('common.error')}: ${err.message}`);
      console.error('Error fetching instances:', err);
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
        setSnackbar({ open: true, message: 'Le nom de l\'instance est requis', severity: 'error' });
        return;
      }

      if (dialogMode === 'create') {
        const newInstance = {
          id: Date.now(),
          ...formData,
          ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
          created_at: new Date().toISOString()
        };
        setInstances([...instances, newInstance]);
        setSnackbar({ open: true, message: 'Instance créée avec succès', severity: 'success' });
      } else if (dialogMode === 'edit' && selectedInstance) {
        const updatedInstances = instances.map(instance =>
          instance.id === selectedInstance.id ? { ...instance, ...formData } : instance
        );
        setInstances(updatedInstances);
        setSnackbar({ open: true, message: 'Instance modifiée avec succès', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette instance ?')) {
      try {
        setInstances(instances.filter(instance => instance.id !== id));
        setSnackbar({ open: true, message: 'Instance supprimée avec succès', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
      }
    }
  };

  const handleInstanceAction = (instanceId, action) => {
    const updatedInstances = instances.map(instance => {
      if (instance.id === instanceId) {
        return { ...instance, state: action };
      }
      return instance;
    });
    setInstances(updatedInstances);
    setSnackbar({ 
      open: true, 
      message: `Instance ${action === 'running' ? 'démarrée' : action === 'stopped' ? 'arrêtée' : 'suspendue'} avec succès`, 
      severity: 'success' 
    });
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'running': return 'success';
      case 'stopped': return 'error';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 'running': return 'En cours';
      case 'stopped': return 'Arrêtée';
      case 'suspended': return 'Suspendue';
      default: return state;
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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
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
                      {instance.state === 'stopped' && (
                        <Tooltip title="Démarrer">
                          <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleInstanceAction(instance.id, 'running')}>
                            <StartIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {instance.state === 'running' && (
                        <>
                          <Tooltip title="Suspendre">
                            <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleInstanceAction(instance.id, 'suspended')}>
                              <PauseIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Arrêter">
                            <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleInstanceAction(instance.id, 'stopped')}>
                              <StopIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      <Tooltip title={t('instances.deleteInstance')}>
                        <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDelete(instance.id)}>
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
            Aucune instance trouvée
          </Typography>
        </Box>
      )}

      {/* Dialog pour créer/modifier/voir une instance */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouvelle Instance' : 
           dialogMode === 'edit' ? 'Modifier l\'Instance' : 'Détails de l\'Instance'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de l'instance"
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