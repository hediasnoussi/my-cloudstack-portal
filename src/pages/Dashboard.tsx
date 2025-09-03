import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import cloudstackService from '../services/cloudstackService';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAgent } = useAuth();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const vpsCreationDetails = location.state?.vpsCreated ? location.state : null;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement des données CloudStack...');

      // Récupérer toutes les données en parallèle
      const [instances, volumes, snapshots, events, isos] = await Promise.all([
        cloudstackService.getVirtualMachines(),
        cloudstackService.getVolumes(),
        cloudstackService.getSnapshots(),
        cloudstackService.getEvents(),
        cloudstackService.getISOs()
      ]);

      const cloudStackData = {
        instances: {
          total: instances.length,
          running: instances.filter((inst: any) => inst.state === 'Running').length,
          stopped: instances.filter((inst: any) => inst.state === 'Stopped').length,
          error: instances.filter((inst: any) => inst.state === 'Error').length
        },
        volumes: {
          total: volumes.length,
          attached: volumes.filter((vol: any) => vol.vmname).length,
          detached: volumes.filter((vol: any) => !vol.vmname).length
        },
        snapshots: { total: snapshots.length },
        events: {
          total: events.length,
          info: events.filter((event: any) => event.level === 'INFO').length,
          warning: events.filter((event: any) => event.level === 'WARNING').length,
          error: events.filter((event: any) => event.level === 'ERROR').length
        },
        isos: { total: isos.length }
      };

      setData(cloudStackData);
      setLastUpdate(new Date());
      console.log('✅ Données CloudStack récupérées:', cloudStackData);

    } catch (err) {
      console.error('❌ Erreur lors du chargement des données CloudStack:', err);
      setError(`Erreur lors du chargement des données: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Chargement des données CloudStack...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
            Dashboard CloudStack
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchData}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          Données en temps réel de votre infrastructure CloudStack
        </Typography>

      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* VPS Creation Success Alert */}
      {vpsCreationDetails && (
        <Alert 
          severity="success" 
          icon={<CheckCircleIcon />}
          sx={{ mb: 4 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {t('vpsDetails.creationSuccess')}
          </Typography>
          <Typography variant="body2">
            {t('vpsDetails.creationMessage')}
          </Typography>
        </Alert>
      )}

      {/* Données CloudStack */}
      {data ? (
        <Box>
          {/* KPIs Principaux */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ComputerIcon sx={{ fontSize: 32, color: '#64748b', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {data.instances.total}
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  VPS Total
                </Typography>
                <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                  <Chip label={`${data.instances.running} actifs`} variant="outlined" size="small" />
                  <Chip label={`${data.instances.stopped} arrêtés`} variant="outlined" size="small" />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <StorageIcon sx={{ fontSize: 32, color: '#64748b', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {data.volumes.total}
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  Volumes
                </Typography>
                <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
                  <Chip label={`${data.volumes.attached} attachés`} variant="outlined" size="small" />
                  <Chip label={`${data.volumes.detached} détachés`} variant="outlined" size="small" />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CloudIcon sx={{ fontSize: 32, color: '#64748b', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {data.snapshots.total}
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  Snapshots
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Sauvegardes disponibles
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 32, color: '#64748b', mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {data.isos.total}
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  ISOs
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Images disponibles
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Événements */}
          <Card sx={{ mb: 4, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 3, color: '#1e293b', fontWeight: 600 }}>
                Événements CloudStack ({data.events.total} total)
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                <Box display="flex" alignItems="center" p={2} sx={{ bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <InfoIcon sx={{ mr: 2, color: '#64748b' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {data.events.info}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Informations
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" p={2} sx={{ bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <WarningIcon sx={{ mr: 2, color: '#64748b' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {data.events.warning}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avertissements
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" p={2} sx={{ bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                  <ErrorIcon sx={{ mr: 2, color: '#64748b' }} />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {data.events.error}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Erreurs
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>


        </Box>
      ) : (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="h6">Aucune donnée CloudStack disponible</Typography>
          <Typography variant="body2">
            Les données CloudStack n'ont pas pu être récupérées. Vérifiez la connexion à l'API CloudStack.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default Dashboard; 