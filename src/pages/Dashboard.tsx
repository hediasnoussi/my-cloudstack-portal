import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Paper,
  Button,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Computer as ComputerIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAgent } = useAuth();
  
  const vpsCreationDetails = location.state?.vpsCreated ? location.state : null;

  const getStatusColor = () => {
    return vpsCreationDetails?.startInstance ? 'success' : 'warning';
  };

  const getStatusText = () => {
    return vpsCreationDetails?.startInstance ? 'En cours de démarrage' : 'Arrêté';
  };

  const getStatusIcon = () => {
    return vpsCreationDetails?.startInstance ? <PlayArrowIcon /> : <StopIcon />;
  };

  return (
    <Box>
      {/* En-tête du Dashboard */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
          {t('dashboard.title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b' }}>
          {t('dashboard.welcome')}
        </Typography>
      </Box>

      {/* VPS Creation Success Alert for Agents */}
      {isAgent() && vpsCreationDetails && (
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

      {/* VPS Details Card for Agents */}
      {isAgent() && vpsCreationDetails && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 3 }}>
            {vpsCreationDetails.vpsName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip
              icon={getStatusIcon()}
              label={getStatusText()}
              color={getStatusColor()}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3, mb: 3 }}>
            <Box>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ComputerIcon color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('vpsDetails.template')}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {vpsCreationDetails.template}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <StorageIcon color="primary" />
                    <Typography variant="subtitle2" color="textSecondary">
                      {t('vpsDetails.computeOffering')}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {vpsCreationDetails.computeOffering}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              disabled={vpsCreationDetails.startInstance}
            >
              {t('vpsDetails.startVps')}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<StopIcon />}
              disabled={!vpsCreationDetails.startInstance}
            >
              {t('vpsDetails.stopVps')}
            </Button>
          </Box>
        </Paper>
      )}

      {/* KPIs en haut */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
          border: '1px solid #f0f0d0',
          borderRadius: 2
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1e293b', mb: 2, fontWeight: 600 }}>
              Croissance Infrastructure
            </Typography>
            <Typography variant="h3" sx={{ color: '#22c55e', fontWeight: 700, mb: 1 }}>
              +45.14%
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Augmentation des ressources
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
          border: '1px solid #f0f0d0',
          borderRadius: 2
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1e293b', mb: 2, fontWeight: 600 }}>
              Ratio d'Utilisation
            </Typography>
            <Typography variant="h3" sx={{ color: '#fbbf24', fontWeight: 700, mb: 1 }}>
              0.58%
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Efficacité des ressources
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
          border: '1px solid #f0f0d0',
          borderRadius: 2
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: '#1e293b', mb: 2, fontWeight: 600 }}>
              Cas de Risque
            </Typography>
            <Chip 
              label="Faible" 
              color="success"
              sx={{ 
                fontSize: '1.2rem', 
                fontWeight: 600,
                height: 40,
                '& .MuiChip-label': { px: 2 }
              }}
            />
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
              Sécurité optimale
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Contenu principal */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <Card sx={{ height: '400px', p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
            Évolution des Ressources
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            Tendances mensuelles
          </Typography>
          <Box sx={{ 
            height: 300, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 58, 138, 0.1) 100%)',
            borderRadius: 2,
            border: '1px solid rgba(30, 58, 138, 0.2)'
          }}>
            <Typography variant="h6" sx={{ color: '#1e293b' }}>
              Graphique d'Évolution
            </Typography>
          </Box>
        </Card>

        <Card sx={{ height: '400px', p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
            Aperçu des Ressources
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            Statistiques de cette semaine
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              67
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Instances actives
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard; 