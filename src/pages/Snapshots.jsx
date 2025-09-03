import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import cloudstackService from '../services/cloudstackService';

const Snapshots = () => {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Test direct de l'API
  const testAPI = async () => {
    try {
      console.log('🧪 Test direct de l\'API...');
      const response = await fetch('/api/global/cloudstack/snapshots');
      const data = await response.json();
      console.log('✅ Test API réussi:', data);
      return data;
    } catch (error) {
      console.error('❌ Test API échoué:', error);
      return null;
    }
  };

  const fetchSnapshots = async () => {
    try {
      setLoading(true);
      console.log('🔄 Début du chargement des snapshots...');
      
      // Test direct d'abord
      const testData = await testAPI();
      if (testData) {
        console.log('📸 Test API - Snapshots récupérés:', testData);
        setSnapshots(testData);
        console.log('✅ Snapshots mis à jour via test API');
        return;
      }
      
      // Fallback vers le service
      const data = await cloudstackService.getSnapshots();
      console.log('📸 Service API - Snapshots récupérés:', data);
      console.log('📊 Nombre de snapshots:', data.length);
      setSnapshots(data);
      console.log('✅ Snapshots mis à jour via service');
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des snapshots:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la récupération des snapshots',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      console.log('🏁 Chargement des snapshots terminé');
    }
  };

  useEffect(() => {
    console.log('🚀 Page Snapshots chargée - Début du chargement des données');
    fetchSnapshots();
    
    // Test immédiat de l'API
    setTimeout(() => {
      console.log('⏰ Test différé de l\'API...');
      testAPI();
    }, 1000);
    
    // Rafraîchir automatiquement toutes les 30 secondes
    const interval = setInterval(() => {
      console.log('🔄 Rafraîchissement automatique des snapshots...');
      fetchSnapshots();
    }, 30000);
    
    return () => {
      console.log('🧹 Nettoyage de l\'intervalle de rafraîchissement');
      clearInterval(interval);
    };
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'BackedUp':
        return 'success';
      case 'Creating':
        return 'warning';
      case 'Error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
        VPS Snapshots
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSnapshots}
        >
          Actualiser
        </Button>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Typography>Chargement des snapshots...</Typography>
          ) : (
            <>
              {console.log('🎨 Rendu de la page - Nombre de snapshots:', snapshots.length)}
              {console.log('📋 Snapshots à afficher:', snapshots)}
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom</TableCell>
                      <TableCell>Volume</TableCell>
                      <TableCell>État</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Créé le</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {snapshots.map((snapshot) => (
                      <TableRow key={snapshot.id}>
                        <TableCell>{snapshot.name}</TableCell>
                        <TableCell>{snapshot.volumeName}</TableCell>
                        <TableCell>
                          <Chip 
                            label={snapshot.state === 'Creating' ? 'En cours de création...' : snapshot.state} 
                            color={getStateColor(snapshot.state)}
                            size="small"
                            icon={snapshot.state === 'Creating' ? <RefreshIcon /> : undefined}
                          />
                        </TableCell>
                        <TableCell>{snapshot.type}</TableCell>
                        <TableCell>{formatDate(snapshot.created)}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            title="Restaurer"
                          >
                            <RestoreIcon />
                          </IconButton>
                          <IconButton
                            color="error"
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
            </>
          )}
        </CardContent>
      </Card>

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

export default Snapshots; 