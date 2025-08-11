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
  Link as AttachIcon,
  LinkOff as DetachIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Volumes = () => {
  const { t } = useTranslation();
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    type: 'data',
    zone: '',
    state: 'ready'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchVolumes();
  }, []);

  const fetchVolumes = async () => {
    try {
      setLoading(true);
      // Simuler des données de volumes
      const mockVolumes = [
        {
          id: 1,
          name: 'Data Volume 1',
          size: '100 GB',
          type: 'data',
          zone: 'Zone 1',
          state: 'ready',
          attached_to: 'Web Server 1',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Backup Volume',
          size: '500 GB',
          type: 'backup',
          zone: 'Zone 1',
          state: 'creating',
          attached_to: null,
          created_at: '2024-01-14T15:45:00Z'
        }
      ];
      setVolumes(mockVolumes);
      setError(null);
    } catch (err) {
      setError(`${t('volumes.errorLoadingVolumes')}: ${err.message}`);
      console.error('Error fetching volumes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, volume) => {
    setDialogMode(mode);
    if (volume) {
      setSelectedVolume(volume);
      setFormData({
        name: volume.name,
        size: volume.size,
        type: volume.type,
        zone: volume.zone,
        state: volume.state
      });
    } else {
      setSelectedVolume(null);
      setFormData({
        name: '',
        size: '',
        type: 'data',
        zone: '',
        state: 'ready'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVolume(null);
    setFormData({
      name: '',
      size: '',
      type: 'data',
      zone: '',
      state: 'ready'
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        // Simuler la création d'un volume
        const newVolume = {
          id: Date.now(),
          ...formData,
          created_at: new Date().toISOString()
        };
        setVolumes([...volumes, newVolume]);
        setSnackbar({ open: true, message: t('volumes.volumeCreatedSuccess'), severity: 'success' });
      } else {
        // Simuler la mise à jour d'un volume
        setVolumes(volumes.map(v => v.id === selectedVolume.id ? { ...v, ...formData } : v));
        setSnackbar({ open: true, message: t('volumes.volumeUpdatedSuccess'), severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      const errorMessage = dialogMode === 'create' ? t('volumes.errorCreatingVolume') : t('volumes.errorUpdatingVolume');
      setSnackbar({ open: true, message: `${errorMessage}: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      setVolumes(volumes.filter(v => v.id !== id));
      setSnackbar({ open: true, message: t('volumes.volumeDeletedSuccess'), severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `${t('volumes.errorDeletingVolume')}: ${err.message}`, severity: 'error' });
    }
  };

  const handleAttach = (volumeId) => {
    try {
      setVolumes(volumes.map(v => v.id === volumeId ? { ...v, state: 'attaching' } : v));
      setSnackbar({ open: true, message: t('volumes.volumeAttachedSuccess'), severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `${t('volumes.errorAttachingVolume')}: ${err.message}`, severity: 'error' });
    }
  };

  const handleDetach = (volumeId) => {
    try {
      setVolumes(volumes.map(v => v.id === volumeId ? { ...v, state: 'detaching' } : v));
      setSnackbar({ open: true, message: t('volumes.volumeDetachedSuccess'), severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: `${t('volumes.errorDetachingVolume')}: ${err.message}`, severity: 'error' });
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'ready':
        return 'success';
      case 'creating':
      case 'attaching':
      case 'detaching':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 'ready':
        return t('volumes.ready');
      case 'creating':
        return t('volumes.creating');
      case 'attaching':
        return t('volumes.attaching');
      case 'detaching':
        return t('volumes.detaching');
      case 'destroying':
        return t('volumes.destroying');
      case 'error':
        return t('volumes.error');
      default:
        return state;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'data':
        return t('volumes.data');
      case 'backup':
        return t('volumes.backup');
      case 'root':
        return t('volumes.root');
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {t('volumes.title')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchVolumes}>
            {t('volumes.refresh')}
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog('create')}>
            + {t('volumes.newVolume')}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8fafc' }}>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.name')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.size')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.type')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.zone')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.state')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.attachedTo')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.createdAt')}</TableCell>
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('volumes.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {volumes.map((volume) => (
              <TableRow key={volume.id} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{volume.name}</TableCell>
                <TableCell>{volume.size}</TableCell>
                <TableCell>
                  <Chip 
                    label={getTypeLabel(volume.type)} 
                    color="primary" 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{volume.zone}</TableCell>
                <TableCell>
                  <Chip 
                    label={getStateLabel(volume.state)} 
                    color={getStateColor(volume.state)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{volume.attached_to || '-'}</TableCell>
                <TableCell>{new Date(volume.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={t('volumes.viewVolume')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('volumes.editVolume')}>
                      <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleOpenDialog('edit', volume)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {volume.state === 'ready' && !volume.attached_to && (
                      <Tooltip title={t('volumes.attach')}>
                        <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleAttach(volume.id)}>
                          <AttachIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {volume.state === 'ready' && volume.attached_to && (
                      <Tooltip title={t('volumes.detach')}>
                        <IconButton size="small" sx={{ color: '#6b7280' }} onClick={() => handleDetach(volume.id)}>
                          <DetachIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title={t('volumes.deleteVolume')}>
                      <IconButton size="small" sx={{ color: '#ef4444' }} onClick={() => handleDelete(volume.id)}>
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? t('volumes.newVolume') : t('volumes.editVolume')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label={t('volumes.name')} 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label={t('volumes.size')} 
              value={formData.size} 
              onChange={(e) => setFormData({ ...formData, size: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('volumes.type')}</InputLabel>
              <Select 
                value={formData.type} 
                label={t('volumes.type')} 
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="data">{t('volumes.data')}</MenuItem>
                <MenuItem value="backup">{t('volumes.backup')}</MenuItem>
                <MenuItem value="root">{t('volumes.root')}</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              fullWidth 
              label={t('volumes.zone')} 
              value={formData.zone} 
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth>
              <InputLabel>{t('volumes.state')}</InputLabel>
              <Select 
                value={formData.state} 
                label={t('volumes.state')} 
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              >
                <MenuItem value="ready">{t('volumes.ready')}</MenuItem>
                <MenuItem value="creating">{t('volumes.creating')}</MenuItem>
                <MenuItem value="error">{t('volumes.error')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Volumes; 