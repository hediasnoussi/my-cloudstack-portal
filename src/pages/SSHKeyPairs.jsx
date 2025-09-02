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
  Tabs,
  Tab
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon, 
  Refresh as RefreshIcon, 
  VpnKey as KeyIcon, 
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import cloudstackService from '../services/cloudstackService';

const SSHKeyPairs = () => {
  const [sshKeyPairs, setSshKeyPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedKey, setSelectedKey] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [tabValue, setTabValue] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    publicKey: '',
    account: 'admin',
    domain: 'ROOT'
  });

  useEffect(() => {
    fetchSshKeyPairs();
  }, []);

  const fetchSshKeyPairs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await cloudstackService.getSSHKeyPairs();
      setSshKeyPairs(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des clés SSH:', err);
      setError('Erreur lors de la récupération des clés SSH');
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des clés SSH',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, key = null) => {
    setDialogMode(mode);
    setTabValue(0);
    if (mode === 'edit' && key) {
      setSelectedKey(key);
      setFormData({
        name: key.name,
        description: key.description || '',
        publicKey: '',
        account: key.account,
        domain: key.domain
      });
    } else {
      setSelectedKey(null);
      setFormData({
        name: '',
        description: '',
        publicKey: '',
        account: 'admin',
        domain: 'ROOT'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedKey(null);
    setFormData({
      name: '',
      description: '',
      publicKey: '',
      account: 'admin',
      domain: 'ROOT'
    });
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        if (!formData.name) {
          throw new Error('Le nom de la clé SSH est requis');
        }

        if (tabValue === 0) {
          // Créer une nouvelle paire de clés
          const keyData = {
            name: formData.name,
            account: formData.account,
            domainid: 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
          };

          console.log('🚀 Création de la paire de clés SSH avec les données:', keyData);

          const result = await cloudstackService.createSSHKeyPair(keyData);

          console.log('✅ Paire de clés SSH créée avec succès');

          // Afficher la clé privée dans une notification
          if (result.keypair && result.keypair.privatekey) {
            setSnackbar({ 
              open: true, 
              message: 'Paire de clés SSH créée avec succès. Clé privée générée.', 
              severity: 'success' 
            });
          }
        } else {
          // Importer une clé publique existante
          if (!formData.publicKey) {
            throw new Error('La clé publique est requise');
          }

          const keyData = {
            name: formData.name,
            publickey: formData.publicKey,
            account: formData.account,
            domainid: 'b4dc6fd1-820c-11f0-b443-0050568aa465' // ROOT domain
          };

          console.log('📥 Import de la clé SSH avec les données:', keyData);

          await cloudstackService.registerSSHKeyPair(keyData);

          console.log('✅ Clé SSH importée avec succès');

          setSnackbar({ 
            open: true, 
            message: 'Clé SSH importée avec succès', 
            severity: 'success' 
          });
        }

        await fetchSshKeyPairs();
      }
      handleCloseDialog();
    } catch (err) {
      console.error('❌ Erreur lors de la gestion de la clé SSH:', err);
      setSnackbar({ 
        open: true, 
        message: `Erreur: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  const handleDelete = async (name) => {
    try {
      console.log('🗑️ Suppression de la clé SSH CloudStack:', name);
      
      await cloudstackService.deleteSSHKeyPair(name);
      
      console.log('✅ Clé SSH supprimée avec succès');
      
      await fetchSshKeyPairs();
      
      setSnackbar({ 
        open: true, 
        message: 'Clé SSH supprimée avec succès', 
        severity: 'success' 
      });
    } catch (err) {
      console.error('❌ Erreur lors de la suppression de la clé SSH:', err);
      setSnackbar({ 
        open: true, 
        message: `Erreur lors de la suppression de la clé SSH: ${err.message}`, 
        severity: 'error' 
      });
    }
  };

  const handleDownloadPrivateKey = (key) => {
    if (key.privatekey) {
      const blob = new Blob([key.privatekey], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${key.name}.pem`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
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

  const formatFingerprint = (fingerprint) => {
    if (fingerprint && fingerprint.length > 30) {
      return fingerprint.substring(0, 30) + '...';
    }
    return fingerprint;
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
          🔑 Clés SSH CloudStack
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSshKeyPairs}
            sx={{ mr: 2 }}
          >
            Actualiser
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('create')}
          >
            Créer une Clé SSH
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
                <TableCell>Empreinte</TableCell>
                <TableCell>Compte</TableCell>
                <TableCell>Domaine</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sshKeyPairs.map((key) => (
                <TableRow key={key.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <KeyIcon sx={{ mr: 1, color: 'primary.main' }} />
                      {key.name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={key.fingerprint}>
                      <span>{formatFingerprint(key.fingerprint)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{key.account}</TableCell>
                  <TableCell>{key.domain}</TableCell>
                  <TableCell>
                    <Chip 
                      label={key.state} 
                      color={getStateColor(key.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(key.created)}</TableCell>
                  <TableCell>
                    {key.privatekey && (
                      <IconButton
                        color="primary"
                        onClick={() => handleDownloadPrivateKey(key)}
                        title="Télécharger la clé privée"
                      >
                        <DownloadIcon />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(key.name)}
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

      {/* Dialog pour créer/importer une clé SSH */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Créer une Clé SSH' : 'Modifier la Clé SSH'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
              <Tab label="Créer une nouvelle paire" />
              <Tab label="Importer une clé existante" />
            </Tabs>
            
            <TextField
              fullWidth
              label="Nom de la clé SSH"
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
              rows={2}
              sx={{ mb: 2 }}
            />
            
            {tabValue === 1 && (
              <TextField
                fullWidth
                label="Clé publique SSH"
                value={formData.publicKey}
                onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
                multiline
                rows={8}
                placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
                sx={{ mb: 2 }}
                required
              />
            )}
            
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

export default SSHKeyPairs; 