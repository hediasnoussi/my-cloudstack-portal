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
  Router as RouterIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

const Networks = () => {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [dialogMode, setDialogMode] = useState('create');
  const [formData, setFormData] = useState({
    name: '',
    cidr: '',
    gateway: '',
    type: 'isolated',
    zone: '',
    state: 'implemented'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchNetworks();
  }, []);

  const fetchNetworks = async () => {
    try {
      setLoading(true);
      // Simuler des données de réseaux
      const mockNetworks = [
        {
          id: 1,
          name: 'Default Network',
          cidr: '192.168.1.0/24',
          gateway: '192.168.1.1',
          type: 'isolated',
          zone: 'Zone 1',
          state: 'implemented',
          vlan: '100',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'DMZ Network',
          cidr: '10.0.1.0/24',
          gateway: '10.0.1.1',
          type: 'shared',
          zone: 'Zone 1',
          state: 'creating',
          vlan: '200',
          created_at: '2024-01-14T15:45:00Z'
        }
      ];
      setNetworks(mockNetworks);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des réseaux: ${err.message}`);
      console.error('Error fetching networks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, network) => {
    setDialogMode(mode);
    if (network) {
      setSelectedNetwork(network);
      setFormData({
        name: network.name,
        cidr: network.cidr,
        gateway: network.gateway,
        type: network.type,
        zone: network.zone,
        state: network.state
      });
    } else {
      setSelectedNetwork(null);
      setFormData({
        name: '',
        cidr: '',
        gateway: '',
        type: 'isolated',
        zone: '',
        state: 'implemented'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNetwork(null);
    setFormData({
      name: '',
      cidr: '',
      gateway: '',
      type: 'isolated',
      zone: '',
      state: 'implemented'
    });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim() || !formData.cidr.trim() || !formData.gateway.trim()) {
        setSnackbar({ open: true, message: 'Le nom, CIDR et gateway sont requis', severity: 'error' });
        return;
      }

      if (dialogMode === 'create') {
        const newNetwork = {
          id: Date.now(),
          ...formData,
          vlan: Math.floor(Math.random() * 1000) + 100,
          created_at: new Date().toISOString()
        };
        setNetworks([...networks, newNetwork]);
        setSnackbar({ open: true, message: 'Réseau créé avec succès', severity: 'success' });
      } else if (dialogMode === 'edit' && selectedNetwork) {
        const updatedNetworks = networks.map(network =>
          network.id === selectedNetwork.id ? { ...network, ...formData } : network
        );
        setNetworks(updatedNetworks);
        setSnackbar({ open: true, message: 'Réseau modifié avec succès', severity: 'success' });
      }
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce réseau ?')) {
      try {
        setNetworks(networks.filter(network => network.id !== id));
        setSnackbar({ open: true, message: 'Réseau supprimé avec succès', severity: 'success' });
      } catch (err) {
        setSnackbar({ open: true, message: `Erreur: ${err.message}`, severity: 'error' });
      }
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'implemented': return 'success';
      case 'creating': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStateLabel = (state) => {
    switch (state) {
      case 'implemented': return 'Implémenté';
      case 'creating': return 'En cours';
      case 'error': return 'Erreur';
      default: return state;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'isolated': return 'Isolé';
      case 'shared': return 'Partagé';
      case 'vpc': return 'VPC';
      default: return type;
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
          Gestion des Réseaux
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchNetworks}
            sx={{ mr: 2 }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Nouveau Réseau
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
                <TableCell>CIDR</TableCell>
                <TableCell>Gateway</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>VLAN</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Date de création</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {networks.map((network) => (
                <TableRow key={network.id} hover>
                  <TableCell>{network.id}</TableCell>
                  <TableCell>{network.name}</TableCell>
                  <TableCell>{network.cidr}</TableCell>
                  <TableCell>{network.gateway}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getTypeLabel(network.type)} 
                      variant="outlined"
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{network.zone}</TableCell>
                  <TableCell>{network.vlan}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getStateLabel(network.state)} 
                      color={getStateColor(network.state)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(network.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Voir">
                      <IconButton size="small" onClick={() => handleOpenDialog('view', network)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton size="small" onClick={() => handleOpenDialog('edit', network)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Configuration">
                      <IconButton size="small">
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small" onClick={() => handleDelete(network.id)}>
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

      {networks.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Aucun réseau trouvé
          </Typography>
        </Box>
      )}

      {/* Dialog pour créer/modifier/voir un réseau */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouveau Réseau' : 
           dialogMode === 'edit' ? 'Modifier le Réseau' : 'Détails du Réseau'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du réseau"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="CIDR (ex: 192.168.1.0/24)"
            fullWidth
            variant="outlined"
            value={formData.cidr}
            onChange={(e) => setFormData({ ...formData, cidr: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Gateway"
            fullWidth
            variant="outlined"
            value={formData.gateway}
            onChange={(e) => setFormData({ ...formData, gateway: e.target.value })}
            disabled={dialogMode === 'view'}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth disabled={dialogMode === 'view'} sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              label="Type"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="isolated">Isolé</MenuItem>
              <MenuItem value="shared">Partagé</MenuItem>
              <MenuItem value="vpc">VPC</MenuItem>
            </Select>
          </FormControl>
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
          <FormControl fullWidth disabled={dialogMode === 'view'}>
            <InputLabel>État</InputLabel>
            <Select
              value={formData.state}
              label="État"
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            >
              <MenuItem value="implemented">Implémenté</MenuItem>
              <MenuItem value="creating">En cours</MenuItem>
              <MenuItem value="error">Erreur</MenuItem>
            </Select>
          </FormControl>
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

export default Networks; 