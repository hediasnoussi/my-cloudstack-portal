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
  FormHelperText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  History as RevertIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import cloudstackService from '../services/cloudstackService';

const InstanceSnapshots = () => {
  const { t } = useTranslation();
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    volumeid: ''
  });
  const [volumes, setVolumes] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSnapshots();
    fetchVolumes();
  }, []);

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des snapshots CloudStack (utilisés comme VPS snapshots)...');
      
      // Récupérer les snapshots de volumes CloudStack (utilisés comme VPS snapshots)
      const cloudstackSnapshots = await cloudstackService.getSnapshots();
      console.log('✅ Snapshots CloudStack récupérés:', cloudstackSnapshots);
      
      // Transformer les données CloudStack en format compatible
      const transformedSnapshots = cloudstackSnapshots.map(snapshot => ({
        id: snapshot.id,
        name: snapshot.name,
        description: snapshot.description || 'Aucune description',
        instance_name: snapshot.volumeName || 'N/A', // Nom du volume snapshoté (présenté comme VPS)
        state: snapshot.state,
        size: snapshot.size || 'N/A',
        created_at: snapshot.created,
        volumeId: snapshot.volumeId,
        volumeName: snapshot.volumeName,
        account: snapshot.account,
        domain: snapshot.domain,
        revertable: snapshot.revertable,
        type: snapshot.type
      }));
      
      console.log('✅ Snapshots transformés comme VPS snapshots:', transformedSnapshots);
      setSnapshots(transformedSnapshots);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des snapshots CloudStack:', err);
      setError('Erreur lors du chargement des VPS snapshots');
      setSnapshots([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolumes = async () => {
    try {
      console.log('🔄 Chargement des volumes CloudStack...');
      const cloudstackVolumes = await cloudstackService.getVolumes();
      console.log('✅ Volumes CloudStack récupérés:', cloudstackVolumes);
      
      // Filtrer seulement les volumes prêts pour les snapshots
      const readyVolumes = cloudstackVolumes.filter(volume => 
        volume.state === 'Ready' && volume.type === 'DATADISK'
      );
      
      setVolumes(readyVolumes);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des volumes CloudStack:', err);
    }
  };

  const handleOpenDialog = (mode, snapshot) => {
    setDialogMode(mode);
    if (snapshot) {
      setSelectedSnapshot(snapshot);
      setFormData({
        name: snapshot.name,
        description: snapshot.description,
        volumeid: snapshot.volumeid || ''
      });
    } else {
      setSelectedSnapshot(null);
      setFormData({
        name: '',
        description: '',
        volumeid: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSnapshot(null);
    setFormData({
      name: '',
      description: '',
      volumeid: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        // Créer un nouveau snapshot de volume via CloudStack (utilisé comme VPS snapshot)
        const snapshotData = {
          name: formData.name,
          description: formData.description,
          volumeid: formData.volumeid // ID du volume à snapshoter
        };
        
        await cloudstackService.createSnapshot(snapshotData);
        setSnackbar({ open: true, message: 'VPS Snapshot créé avec succès', severity: 'success' });
        
        // Rafraîchir la liste des snapshots
        fetchSnapshots();
      } else {
        // Note: CloudStack ne permet pas de modifier directement les snapshots
        setSnackbar({ open: true, message: 'Modification des VPS snapshots non supportée par CloudStack', severity: 'warning' });
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Erreur lors de la création/modification du VPS snapshot:', err);
      setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce VPS Snapshot ?')) {
      try {
        await cloudstackService.deleteSnapshot(id);
        setSnackbar({ open: true, message: 'VPS Snapshot supprimé avec succès', severity: 'success' });
        
        // Rafraîchir la liste des snapshots
        fetchSnapshots();
      } catch (err) {
        console.error('Erreur lors de la suppression du VPS snapshot:', err);
        setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
      }
    }
  };

  const handleRestore = async (snapshotId) => {
    if (window.confirm('Êtes-vous sûr de vouloir restaurer ce VPS Snapshot ? Cette action remplacera les données actuelles.')) {
      try {
        await cloudstackService.revertSnapshot(snapshotId);
        setSnackbar({ open: true, message: 'VPS Snapshot restauré avec succès', severity: 'success' });
        
        // Rafraîchir la liste des snapshots
        fetchSnapshots();
      } catch (err) {
        console.error('Erreur lors de la restauration du VPS snapshot:', err);
        setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
      }
    }
  };

  const handleDownload = (snapshotId) => {
    setSnackbar({ open: true, message: t('snapshots.download') + ' ' + t('common.success'), severity: 'success' });
  };

  const getStateColor = (state) => {
    switch (state?.toLowerCase()) {
      case 'backedup':
      case 'ready':
        return 'success';
      case 'creating':
      case 'backingup':
        return 'warning';
      case 'error':
      case 'failed':
        return 'error';
      default: 
        return 'default';
    }
  };

  const getStateLabel = (state) => {
    switch (state?.toLowerCase()) {
      case 'backedup':
      case 'ready':
        return 'Prêt';
      case 'creating':
      case 'backingup':
        return 'En cours';
      case 'error':
      case 'failed':
        return 'Erreur';
      default: 
        return state || 'Inconnu';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
          VPS Snapshots
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSnapshots}
            sx={{
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                backgroundColor: '#f8fafc'
              }
            }}
          >
            {t('snapshots.refresh')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
            sx={{
              bgcolor: '#1e40af',
              '&:hover': {
                bgcolor: '#1e3a8a'
              }
            }}
          >
            + {t('snapshots.newSnapshot')}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.id')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.description')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>VPS</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.size')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.status')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.creationDate')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {snapshots.map((snapshot) => (
              <TableRow key={snapshot.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell>{snapshot.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{snapshot.name}</TableCell>
                <TableCell>{snapshot.description}</TableCell>
                <TableCell>{snapshot.instance_name}</TableCell>
                <TableCell>{snapshot.size}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStateLabel(snapshot.state)} 
                    color={getStateColor(snapshot.state)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  {snapshot.created_at ? new Date(snapshot.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('snapshots.view')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('snapshots.edit')}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#6b7280' }}
                        onClick={() => handleOpenDialog('edit', snapshot)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {(snapshot.state === 'ready' || snapshot.state === 'BackedUp') && (
                      <>
                        <Tooltip title={t('snapshots.revert')}>
                          <IconButton 
                            size="small" 
                            sx={{ color: '#6b7280' }}
                            onClick={() => handleRestore(snapshot.id)}
                          >
                            <RevertIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('snapshots.download')}>
                          <IconButton 
                            size="small" 
                            sx={{ color: '#6b7280' }}
                            onClick={() => handleDownload(snapshot.id)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title={t('snapshots.delete')}>
                      <IconButton 
                        size="small" 
                        sx={{ color: '#ef4444' }}
                        onClick={() => handleDelete(snapshot.id)}
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

      {snapshots.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Aucun snapshot trouvé
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Créez votre premier snapshot pour commencer
          </Typography>
        </Box>
      )}

      {/* Dialog pour créer/modifier */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? t('snapshots.newSnapshot') : t('snapshots.edit')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label={t('snapshots.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('snapshots.description')}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Volume à snapshoter</InputLabel>
              <Select
                value={formData.volumeid || ''}
                label="Volume à snapshoter"
                onChange={(e) => setFormData({ ...formData, volumeid: e.target.value })}
              >
                {volumes.map((volume) => (
                  <MenuItem key={volume.id} value={volume.id}>
                    {volume.name} ({volume.size ? Math.round(volume.size / 1024 / 1024 / 1024) + ' GB' : 'N/A'})
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Sélectionnez le volume CloudStack à sauvegarder</FormHelperText>
            </FormControl>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {dialogMode === 'create' ? t('common.save') : t('common.save')}
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

export default InstanceSnapshots; 