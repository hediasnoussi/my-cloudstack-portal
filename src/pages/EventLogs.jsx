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
import cloudstackService from '../services/cloudstackService';

const EventLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    level: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async (isFiltering = false) => {
    try {
      if (isFiltering) {
        setFiltering(true);
      } else {
        setLoading(true);
      }
      console.log('🔄 Chargement des événements CloudStack...');
      
      // Construire les paramètres de filtrage - seulement si non vides
      const params = {};
      if (filters.level && filters.level.trim()) params.level = filters.level;
      if (filters.type && filters.type.trim()) params.type = filters.type;
      if (filters.search && filters.search.trim()) params.keyword = filters.search;
      
      console.log('📋 Paramètres de filtrage:', params);
      const cloudstackEvents = await cloudstackService.getEvents(params);
      console.log('✅ Événements CloudStack récupérés:', cloudstackEvents);
      
      setLogs(cloudstackEvents);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des événements CloudStack:', err);
      setError(`Erreur lors du chargement des événements CloudStack: ${err.message}`);
    } finally {
      if (isFiltering) {
        setFiltering(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    // Rafraîchir les données avec les nouveaux filtres après un délai
    setTimeout(() => fetchLogs(true), 300);
  };

  const clearFilters = () => {
    setFilters({
      level: '',
      type: '',
      search: ''
    });
    // Recharger les données sans filtres
    setTimeout(() => fetchLogs(true), 100);
  };

  const getFilteredLogs = () => {
    return logs.filter(log => {
      // Filtrage par niveau (case-insensitive)
      const matchesLevel = !filters.level || 
        log.level.toLowerCase() === filters.level.toLowerCase();
      
      // Filtrage par type (case-insensitive et recherche partielle)
      const matchesType = !filters.type || 
        log.type.toLowerCase().includes(filters.type.toLowerCase());
      
      // Filtrage par recherche (message, utilisateur, compte, ressource)
      const matchesSearch = !filters.search || 
        log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.user.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.account.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.resourceName.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.resourceType.toLowerCase().includes(filters.search.toLowerCase());
      
      return matchesLevel && matchesType && matchesSearch;
    });
  };

  const getLevelColor = (level) => {
    switch (level?.toUpperCase()) {
      case 'INFO': return 'info';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'error';
      case 'DEBUG': return 'default';
      default: return 'default';
    }
  };

  const getLevelIcon = (level) => {
    switch (level?.toUpperCase()) {
      case 'INFO': return <InfoIcon />;
      case 'WARNING': return <WarningIcon />;
      case 'ERROR': return <ErrorIcon />;
      case 'DEBUG': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const getLevelLabel = (level) => {
    switch (level?.toUpperCase()) {
      case 'INFO': return 'Information';
      case 'WARNING': return 'Avertissement';
      case 'ERROR': return 'Erreur';
      case 'DEBUG': return 'Debug';
      default: return level || 'Inconnu';
    }
  };

  const getTypeLabel = (type) => {
    if (!type) return 'Inconnu';
    
    // Extraire le type principal (avant le point)
    const mainType = type.split('.')[0];
    
    switch (mainType) {
      case 'VM': return 'Machine Virtuelle';
      case 'VOLUME': return 'Volume';
      case 'SNAPSHOT': return 'Snapshot';
      case 'ISO': return 'ISO';
      case 'USER': return 'Utilisateur';
      case 'FIREWALL': return 'Pare-feu';
      case 'MAINT': return 'Maintenance';
      case 'NET': return 'Réseau';
      case 'DISABLE': return 'Désactivation';
      case 'VMSNAPSHOT': return 'Snapshot VM';
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
        <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
          Événements CloudStack
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
          {filtering && (
            <Box display="flex" alignItems="center" ml={2}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              <Typography variant="body2" color="textSecondary">
                Filtrage en cours...
              </Typography>
            </Box>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={filters.level}
                label="Niveau"
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="INFO">Information</MenuItem>
                <MenuItem value="WARNING">Avertissement</MenuItem>
                <MenuItem value="ERROR">Erreur</MenuItem>
                <MenuItem value="DEBUG">Debug</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="VM">Machine Virtuelle</MenuItem>
                <MenuItem value="VOLUME">Volume</MenuItem>
                <MenuItem value="SNAPSHOT">Snapshot</MenuItem>
                <MenuItem value="ISO">ISO</MenuItem>
                <MenuItem value="USER">Utilisateur</MenuItem>
                <MenuItem value="FIREWALL">Pare-feu</MenuItem>
                <MenuItem value="MAINT">Maintenance</MenuItem>
                <MenuItem value="NET">Réseau</MenuItem>
                <MenuItem value="DISABLE">Désactivation</MenuItem>
                <MenuItem value="VMSNAPSHOT">Snapshot VM</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Rechercher"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Message ou utilisateur..."
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
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
                <TableCell>Compte</TableCell>
                <TableCell>Ressource</TableCell>
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
                    <Typography variant="body2" color="textSecondary">
                      {log.account}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={`${log.resourceType}: ${log.resourceName}`}>
                      <Typography variant="body2" color="textSecondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {log.resourceType}: {log.resourceName}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredLogs.length === 0 && !loading && !filtering && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            {logs.length === 0 ? 'Aucun événement CloudStack trouvé' : 'Aucun événement ne correspond aux filtres appliqués'}
          </Typography>
          {filters.level || filters.type || filters.search ? (
            <Typography variant="body2" color="textSecondary" mt={1}>
              Essayez de modifier vos critères de filtrage
            </Typography>
          ) : null}
        </Box>
      )}

      {filteredLogs.length > 0 && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            Affichage de {filteredLogs.length} événement(s) CloudStack
            {filters.level || filters.type || filters.search ? ' (filtrés)' : ''}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EventLogs; 