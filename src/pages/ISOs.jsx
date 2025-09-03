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
  Alert, 
  CircularProgress, 
  Snackbar
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  Image as ImageIcon
} from '@mui/icons-material';
import cloudstackService from '../services/cloudstackService';

const ISOs = () => {
  const [isos, setIsos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchIsos();
  }, []);

  const fetchIsos = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des ISOs CloudStack...');
      const cloudstackIsos = await cloudstackService.getISOs();
      console.log('✅ ISOs CloudStack récupérés:', cloudstackIsos);
      
      // Transformer les données CloudStack en format compatible
      const transformedIsos = cloudstackIsos.map(iso => ({
        id: iso.id,
        name: iso.name,
        description: iso.displaytext || 'Aucune description',
        size: iso.size || 'N/A',
        format: iso.format || 'ISO',
        state: iso.state,
        account: iso.account,
        domain: iso.domain,
        zone: iso.zoneName || 'N/A',
        created: iso.created,
        ostype: iso.ostypename || 'N/A',
        ispublic: iso.ispublic,
        isfeatured: iso.isfeatured,
        isready: iso.isready
      }));
      
      setIsos(transformedIsos);
      setError('');
    } catch (err) {
      console.error('❌ Erreur lors du chargement des ISOs CloudStack:', err);
      setError('Erreur lors du chargement des ISOs CloudStack');
    } finally {
      setLoading(false);
    }
  };





  const getStateColor = (state) => {
    switch (state) {
      case 'Ready': return 'success';
      case 'Uploading': return 'warning';
      case 'Failed': return 'error';
      case 'Processing': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
          Gestion des ISOs CloudStack
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchIsos}
          >
            Actualiser
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
                    <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Taille</TableCell>
            <TableCell>État</TableCell>
            <TableCell>Type d'OS</TableCell>
            <TableCell>Zone</TableCell>
            <TableCell>Compte</TableCell>
            <TableCell>Créé le</TableCell>
            
          </TableRow>
        </TableHead>
            <TableBody>
              {isos.map((iso) => (
                <TableRow key={iso.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {iso.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{iso.description}</TableCell>
                  <TableCell>{iso.size}</TableCell>
                  <TableCell>
                    <Chip 
                      label={iso.state} 
                      color={getStateColor(iso.state)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{iso.ostype}</TableCell>
                  <TableCell>{iso.zone}</TableCell>
                  <TableCell>{iso.account}</TableCell>
                  <TableCell>{formatDate(iso.created)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

export default ISOs; 