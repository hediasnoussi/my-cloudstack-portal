import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Cloud as CloudIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import cloudstackService from '../services/cloudstackService';
import MainCard from '../components/MainCard';

const PartnerVPS = () => {
  const { t } = useTranslation();
  const { user, isPartner } = useAuth();
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
      console.log('🔄 Chargement des instances CloudStack pour Partner...');
      
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

  // Statistiques pour les cartes KPI
  const totalInstances = instances.length;
  const runningInstances = instances.filter(inst => inst.state?.toLowerCase() === 'running').length;
  const stoppedInstances = instances.filter(inst => inst.state?.toLowerCase() === 'stopped').length;
  const totalCPU = instances.reduce((acc, inst) => acc + (inst.cpu || 0), 0);
  const totalMemory = instances.reduce((acc, inst) => acc + (inst.memory || 0), 0);

  const kpiCards = [
    {
      title: "Total VPS",
      value: totalInstances.toString(),
      trend: runningInstances > 0 ? Math.round((runningInstances / totalInstances) * 100) : 0,
      trendUp: true,
      extra: runningInstances.toString(),
      extraText: "VPS actifs",
      color: "primary",
      icon: <ComputerIcon />
    },
    {
      title: "VPS en cours",
      value: runningInstances.toString(),
      trend: totalInstances > 0 ? Math.round((runningInstances / totalInstances) * 100) : 0,
      trendUp: true,
      extra: stoppedInstances.toString(),
      extraText: "VPS arrêtés",
      color: "success",
      icon: <TrendingUpIcon />
    },
    {
      title: "CPU Total",
      value: totalCPU.toString(),
      trend: 0,
      trendUp: true,
      extra: "vCPU",
      extraText: "Processeurs virtuels",
      color: "info",
      icon: <CloudIcon />
    },
    {
      title: "RAM Total",
      value: `${Math.round(totalMemory / 1024)} GB`,
      trend: 0,
      trendUp: true,
      extra: `${totalMemory} MB`,
      extraText: "Mémoire totale",
      color: "warning",
      icon: <StorageIcon />
    }
  ];


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
        
        {/* Header avec titre et boutons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
            Mes VPS CloudStack
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('create', null)}
              sx={{ 
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' }
              }}
            >
              Nouveau VPS
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <MainCard sx={{ mb: 2, p: 1, bgcolor: 'transparent', boxShadow: 'none' }}>
          <Grid container spacing={1}>
            {kpiCards.map((card, idx) => (
              <Grid item xs={12} sm={6} lg={3} key={idx}>
                <Card sx={{ height: '100%', p: 1 }}>
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {card.icon}
                      <Typography variant="h6" color="textSecondary" sx={{ ml: 1 }}>
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {card.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {card.trendUp ? (
                        <TrendingUpIcon color="success" />
                      ) : (
                        <TrendingDownIcon color="error" />
                      )}
                      <Typography variant="body2" color={card.trendUp ? 'success.main' : 'error.main'}>
                        {card.trend}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {card.extraText} <Box component="span" sx={{ color: card.trendUp ? 'success.main' : 'warning.main', fontWeight: 600 }}>{card.extra}</Box>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MainCard>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Table des VPS */}
        <MainCard title="Liste de mes VPS" sx={{ p: 1 }}>
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Nom</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Template</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Zone</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Offre de service</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>IP Address</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>État</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Date de création</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
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
                          <Tooltip title="Voir les détails">
                            <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('view', instance)}>
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Modifier">
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
                          <Tooltip title="Supprimer">
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
        </MainCard>

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

export default PartnerVPS;
