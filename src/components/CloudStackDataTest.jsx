import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  Cloud as CloudIcon,
  Computer as ComputerIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import cloudstackService from '../services/cloudstackService';

const CloudStackDataTest = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [instances, setInstances] = useState([]);
  const [domains, setDomains] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement de toutes les données CloudStack...');
      
      // Charger toutes les données en parallèle
      const [statsData, instancesData, domainsData, accountsData] = await Promise.all([
        cloudstackService.getDashboardStats(),
        cloudstackService.getVirtualMachines(),
        cloudstackService.getDomains(),
        cloudstackService.getAccounts()
      ]);
      
      setStats(statsData);
      setInstances(instancesData);
      setDomains(domainsData);
      setAccounts(accountsData);
      
      console.log('✅ Toutes les données CloudStack chargées:', {
        stats: statsData,
        instances: instancesData,
        domains: domainsData,
        accounts: accountsData
      });
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAllData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={handleRefresh}>
          Réessayer
        </Button>
      }>
        Erreur lors du chargement des données CloudStack: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          🌐 Test des Données CloudStack
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Actualiser
        </Button>
      </Box>

      {/* Statistiques */}
      {stats && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              📊 Statistiques CloudStack
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <CloudIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h4">{stats.domains}</Typography>
                  <Typography variant="body2">Domaines</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <ComputerIcon sx={{ fontSize: 40, color: 'success.main' }} />
                  <Typography variant="h4">{stats.instances}</Typography>
                  <Typography variant="body2">Instances</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <StorageIcon sx={{ fontSize: 40, color: 'warning.main' }} />
                  <Typography variant="h4">{stats.volumes}</Typography>
                  <Typography variant="body2">Volumes</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <NetworkIcon sx={{ fontSize: 40, color: 'info.main' }} />
                  <Typography variant="h4">{stats.networks}</Typography>
                  <Typography variant="body2">Réseaux</Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Instances */}
      {instances.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🖥️ Instances CloudStack ({instances.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>État</TableCell>
                    <TableCell>CPU</TableCell>
                    <TableCell>RAM (MB)</TableCell>
                    <TableCell>Template</TableCell>
                    <TableCell>Zone</TableCell>
                    <TableCell>Créé le</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instances.map((instance) => (
                    <TableRow key={instance.id}>
                      <TableCell>{instance.name || instance.displayname}</TableCell>
                      <TableCell>
                        <Chip
                          label={instance.state}
                          color={
                            instance.state === 'Running' ? 'success' :
                            instance.state === 'Stopped' ? 'error' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{instance.cpunumber}</TableCell>
                      <TableCell>{instance.memory}</TableCell>
                      <TableCell>{instance.templatename}</TableCell>
                      <TableCell>{instance.zonename}</TableCell>
                      <TableCell>
                        {new Date(instance.created).toLocaleDateString('fr-FR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Domaines */}
      {domains.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🌐 Domaines CloudStack ({domains.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Chemin</TableCell>
                    <TableCell>État</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {domains.map((domain) => (
                    <TableRow key={domain.id}>
                      <TableCell>{domain.name}</TableCell>
                      <TableCell>{domain.id}</TableCell>
                      <TableCell>{domain.path}</TableCell>
                      <TableCell>
                        <Chip
                          label={domain.state || 'Active'}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Comptes */}
      {accounts.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              👥 Comptes CloudStack ({accounts.length})
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>État</TableCell>
                    <TableCell>Domaine</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.accounttype}</TableCell>
                      <TableCell>
                        <Chip
                          label={account.state || 'Active'}
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{account.domain}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {!stats && instances.length === 0 && domains.length === 0 && accounts.length === 0 && (
        <Alert severity="info">
          Aucune donnée CloudStack disponible. Vérifiez votre connexion.
        </Alert>
      )}
    </Box>
  );
};

export default CloudStackDataTest;
