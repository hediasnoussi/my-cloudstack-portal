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
  History as RevertIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
    instance_name: '',
    state: 'ready'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchSnapshots();
  }, []);

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      // Simuler des données de snapshots
      const mockSnapshots = [
        {
          id: 1,
          name: 'Web Server Backup',
          description: 'Snapshot avant mise à jour système',
          instance_name: 'Web Server 1',
          state: 'ready',
          size: '2.5 GB',
          created_at: '15/01/2024'
        },
        {
          id: 2,
          name: 'Database Snapshot',
          description: 'Sauvegarde de la base de données',
          instance_name: 'Database Server',
          state: 'inProgress',
          size: '5.2 GB',
          created_at: '14/01/2024'
        }
      ];
      setSnapshots(mockSnapshots);
      setError(null);
    } catch (err) {
      setError(`${t('common.error')}: ${err.message}`);
      console.error('Error fetching snapshots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, snapshot) => {
    setDialogMode(mode);
    if (snapshot) {
      setSelectedSnapshot(snapshot);
      setFormData({
        name: snapshot.name,
        description: snapshot.description,
        instance_name: snapshot.instance_name,
        state: snapshot.state
      });
    } else {
      setSelectedSnapshot(null);
      setFormData({
        name: '',
        description: '',
        instance_name: '',
        state: 'ready'
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
      instance_name: '',
      state: 'ready'
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        // Simuler la création
        const newSnapshot = {
          id: Date.now(),
          ...formData,
          size: '0 GB',
          created_at: new Date().toLocaleDateString('fr-FR')
        };
        setSnapshots([...snapshots, newSnapshot]);
        setSnackbar({ open: true, message: t('snapshots.newSnapshot') + ' ' + t('common.success'), severity: 'success' });
      } else {
        // Simuler la modification
        setSnapshots(snapshots.map(s => s.id === selectedSnapshot.id ? { ...s, ...formData } : s));
        setSnackbar({ open: true, message: t('snapshots.edit') + ' ' + t('common.success'), severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: t('common.error'), severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      setSnapshots(snapshots.filter(s => s.id !== id));
      setSnackbar({ open: true, message: t('snapshots.delete') + ' ' + t('common.success'), severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: t('common.error'), severity: 'error' });
    }
  };

  const handleRestore = (snapshotId) => {
    setSnackbar({ open: true, message: t('snapshots.revert') + ' ' + t('common.success'), severity: 'success' });
  };

  const handleDownload = (snapshotId) => {
    setSnackbar({ open: true, message: t('snapshots.download') + ' ' + t('common.success'), severity: 'success' });
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'ready':
        return 'success';
      case 'inProgress':
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
        return t('snapshots.ready');
      case 'inProgress':
        return t('snapshots.inProgress');
      case 'error':
        return t('snapshots.error');
      default:
        return state;
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
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {t('snapshots.title')}
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
              <TableCell sx={{ fontWeight: 600, color: '#374151' }}>{t('snapshots.instance')}</TableCell>
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
                <TableCell>{snapshot.created_at}</TableCell>
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
                    {snapshot.state === 'ready' && (
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
            <TextField
              fullWidth
              label={t('snapshots.instance')}
              value={formData.instance_name}
              onChange={(e) => setFormData({ ...formData, instance_name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>{t('snapshots.status')}</InputLabel>
              <Select
                value={formData.state}
                label={t('snapshots.status')}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              >
                <MenuItem value="ready">{t('snapshots.ready')}</MenuItem>
                <MenuItem value="inProgress">{t('snapshots.inProgress')}</MenuItem>
                <MenuItem value="error">{t('snapshots.error')}</MenuItem>
              </Select>
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