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
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Cloud as CloudIcon,
  Domain as DomainIcon,
  People as PeopleIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';

const TestData: React.FC = () => {
  const [domains, setDomains] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('Testing...');

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Test de connexion API
      const testResponse = await apiService.testConnection();
      setApiStatus(`✅ API connectée: ${testResponse.data.message}`);
      
      // Récupérer les domaines
      const domainsResponse = await apiService.getDomains();
      setDomains(domainsResponse.data.data || []);
      
      // Récupérer les utilisateurs
      const usersResponse = await apiService.getUsers();
      setUsers(usersResponse.data.data || []);
      
      // Récupérer les comptes
      const accountsResponse = await apiService.getAccounts();
      setAccounts(accountsResponse.data.data || []);
      
    } catch (err: any) {
      setError(`Erreur API: ${err.message}`);
      setApiStatus('❌ API non connectée');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
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
          Test des Données API
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={testApiConnection}
        >
          Actualiser
        </Button>
      </Box>

      {/* Status API */}
      <Alert severity={apiStatus.includes('✅') ? 'success' : 'error'} sx={{ mb: 3 }}>
        {apiStatus}
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DomainIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{domains.length}</Typography>
                  <Typography variant="body2" color="textSecondary">Domaines</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{users.length}</Typography>
                  <Typography variant="body2" color="textSecondary">Utilisateurs</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <SecurityIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">{accounts.length}</Typography>
                  <Typography variant="body2" color="textSecondary">Comptes</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CloudIcon color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">3</Typography>
                  <Typography variant="body2" color="textSecondary">Zones</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tableau des Domaines */}
      <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Domaines</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Ajouter
          </Button>
        </Box>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {domains.map((domain) => (
                <TableRow key={domain.id} hover>
                  <TableCell>{domain.id}</TableCell>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>
                    <Chip label="Actif" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Voir">
                      <IconButton size="small">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Tableau des Utilisateurs */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Utilisateurs</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Ajouter
          </Button>
        </Box>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom d'utilisateur</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={user.role === 'admin' ? 'error' : 'default'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Voir">
                      <IconButton size="small">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TestData; 