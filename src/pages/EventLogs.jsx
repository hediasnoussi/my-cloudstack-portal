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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const EventLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Simuler des données de logs pour l'instant
      const mockLogs = [
        {
          id: 1,
          timestamp: '2024-01-15T14:30:00Z',
          level: 'info',
          type: 'instance',
          message: 'Instance "Web Server 1" démarrée avec succès',
          user: 'admin',
          details: 'Instance ID: 1, Zone: Zone 1'
        },
        {
          id: 2,
          timestamp: '2024-01-15T14:25:00Z',
          level: 'warning',
          type: 'storage',
          message: 'Espace disque faible sur le volume principal',
          user: 'system',
          details: 'Volume: /dev/sda1, Usage: 85%'
        },
        {
          id: 3,
          timestamp: '2024-01-15T14:20:00Z',
          level: 'error',
          type: 'network',
          message: 'Échec de connexion au réseau externe',
          user: 'system',
          details: 'Interface: eth0, Error: Connection timeout'
        },
        {
          id: 4,
          timestamp: '2024-01-15T14:15:00Z',
          level: 'success',
          type: 'user',
          message: 'Utilisateur "john.doe" connecté avec succès',
          user: 'john.doe',
          details: 'IP: 192.168.1.50, Session ID: 12345'
        }
      ];
      setLogs(mockLogs);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des logs: ${err.message}`);
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      level: '',
      type: '',
      search: ''
    });
  };

  const getFilteredLogs = () => {
    return logs.filter(log => {
      const matchesLevel = !filters.level || log.level === filters.level;
      const matchesType = !filters.type || log.type === filters.type;
      const matchesSearch = !filters.search || 
        log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.user.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesLevel && matchesType && matchesSearch;
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'success';
      default: return 'default';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'info': return <InfoIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
      case 'success': return <SuccessIcon />;
      default: return <InfoIcon />;
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'info': return 'Information';
      case 'warning': return 'Avertissement';
      case 'error': return 'Erreur';
      case 'success': return 'Succès';
      default: return level;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'instance': return 'Instance';
      case 'storage': return 'Stockage';
      case 'network': return 'Réseau';
      case 'user': return 'Utilisateur';
      case 'system': return 'Système';
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

  const filteredLogs = getFilteredLogs();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Logs d'Événements
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchLogs}
            sx={{ mr: 2 }}
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

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filtres</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={filters.level}
                label="Niveau"
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="info">Information</MenuItem>
                <MenuItem value="warning">Avertissement</MenuItem>
                <MenuItem value="error">Erreur</MenuItem>
                <MenuItem value="success">Succès</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="instance">Instance</MenuItem>
                <MenuItem value="storage">Stockage</MenuItem>
                <MenuItem value="network">Réseau</MenuItem>
                <MenuItem value="user">Utilisateur</MenuItem>
                <MenuItem value="system">Système</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Rechercher"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Message ou utilisateur..."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              fullWidth
            >
              Effacer les filtres
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Horodatage</TableCell>
                <TableCell>Niveau</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Utilisateur</TableCell>
                <TableCell>Détails</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={getLevelIcon(log.level)}
                      label={getLevelLabel(log.level)} 
                      color={getLevelColor(log.level)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getTypeLabel(log.type)} 
                      variant="outlined"
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {log.message}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {log.user}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={log.details}>
                      <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.details}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredLogs.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            {logs.length === 0 ? 'Aucun log trouvé' : 'Aucun log ne correspond aux filtres'}
          </Typography>
        </Box>
      )}

      {filteredLogs.length > 0 && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Affichage de {filteredLogs.length} log(s) sur {logs.length} total
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EventLogs; 