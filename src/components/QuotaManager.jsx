import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Storage as StorageIcon,
  Memory as MemoryIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import quotaService from '../services/quotaService';

const QuotaManager = ({ onQuotaUpdate }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [quotas, setQuotas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editQuotas, setEditQuotas] = useState({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadQuotas();
  }, []);

  const loadQuotas = async () => {
    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      const response = await quotaService.getMyQuotas();
      if (response.success) {
        setQuotas(response.data);
        setEditQuotas(response.data);
      } else {
        setMessage({ type: 'error', text: response.message || 'Erreur lors du chargement des quotas' });
        // Valeurs par défaut en cas d'erreur
        const defaultQuotas = {
          max_vps: user.role === 'admin' ? 10000 : user.role === 'subprovider' ? 1000 : user.role === 'partner' ? 100 : 10,
          max_cpu: user.role === 'admin' ? 10000 : user.role === 'subprovider' ? 1000 : user.role === 'partner' ? 100 : 10,
          max_ram: user.role === 'admin' ? 100000 : user.role === 'subprovider' ? 10000 : user.role === 'partner' ? 1000 : 100,
          max_storage: user.role === 'admin' ? 1000000 : user.role === 'subprovider' ? 100000 : user.role === 'partner' ? 10000 : 1000,
          used_vps: 0,
          used_cpu: 0,
          used_ram: 0,
          used_storage: 0
        };
        setQuotas(defaultQuotas);
        setEditQuotas(defaultQuotas);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des quotas:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
      // Valeurs par défaut en cas d'erreur
      const defaultQuotas = {
        max_vps: user.role === 'admin' ? 10000 : user.role === 'admin' ? 1000 : user.role === 'partner' ? 100 : 10,
        max_cpu: user.role === 'admin' ? 10000 : user.role === 'admin' ? 1000 : user.role === 'partner' ? 100 : 10,
        max_ram: user.role === 'admin' ? 100000 : user.role === 'admin' ? 10000 : user.role === 'partner' ? 1000 : 100,
        max_storage: user.role === 'admin' ? 1000000 : user.role === 'admin' ? 100000 : user.role === 'partner' ? 10000 : 1000,
        used_vps: 0,
        used_cpu: 0,
        used_ram: 0,
        used_storage: 0
      };
      setQuotas(defaultQuotas);
      setEditQuotas(defaultQuotas);
    } finally {
      setLoading(false);
    }
  };

  const getQuotaPercentage = (used, max) => {
    return max > 0 ? Math.round((used / max) * 100) : 0;
  };

  const getQuotaColor = (percentage) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const getQuotaStatus = (percentage) => {
    if (percentage >= 90) return 'Critique';
    if (percentage >= 75) return 'Attention';
    return 'Normal';
  };

  const handleEditQuota = (quotaType) => {
    setSelectedQuota(quotaType);
    setOpenEditDialog(true);
  };

  const handleSaveQuota = async () => {
    try {
      setLoading(true);
      
      // Appel API pour mettre à jour les quotas
      const response = await quotaService.updateUserQuotas(user.id, editQuotas);
      
      if (response.success) {
        const updatedQuotas = { ...quotas, ...editQuotas };
        setQuotas(updatedQuotas);
        setEditQuotas(updatedQuotas);
        setOpenEditDialog(false);
        setMessage({ type: 'success', text: 'Quotas mis à jour avec succès' });
        
        if (onQuotaUpdate) {
          onQuotaUpdate(updatedQuotas);
        }
      } else {
        setMessage({ type: 'error', text: response.message || 'Erreur lors de la mise à jour des quotas' });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des quotas:', error);
      setMessage({ type: 'error', text: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditQuotas(quotas);
    setOpenEditDialog(false);
  };

  const renderQuotaCard = (title, used, max, unit, icon, quotaType) => {
    const percentage = getQuotaPercentage(used, max);
    const color = getQuotaColor(percentage);
    const status = getQuotaStatus(percentage);
    
    return (
      <Card sx={{ height: '100%', position: 'relative' }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center">
              {icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {title}
              </Typography>
            </Box>
            {user.role === 'admin' && (
              <IconButton 
                size="small" 
                onClick={() => handleEditQuota(quotaType)}
                sx={{ color: '#6b7280' }}
              >
                <EditIcon />
              </IconButton>
            )}
          </Box>
          
          <Typography variant="h4" color="primary" gutterBottom>
            {used} / {max} {unit}
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            color={color}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {percentage}% utilisé
            </Typography>
            <Chip 
              label={status} 
              color={color}
              size="small"
              icon={percentage >= 75 ? <WarningIcon /> : <CheckCircleIcon />}
            />
          </Box>
          
          {percentage >= 75 && (
            <Alert severity="warning" sx={{ mt: 2 }} size="small">
              {percentage >= 90 
                ? 'Quota critique atteint !' 
                : 'Quota d\'attention atteint.'
              }
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderEditDialog = () => {
    if (!selectedQuota) return null;

    const quotaLabels = {
      max_vps: 'Nombre maximum de VPS',
      max_cpu: 'Nombre maximum de CPU',
      max_ram: 'RAM maximum (GB)',
      max_storage: 'Stockage maximum (GB)'
    };

    const currentValue = editQuotas[selectedQuota];
    const usedValue = quotas[`used_${selectedQuota.replace('max_', '')}`] || 0;

    return (
      <Dialog open={openEditDialog} onClose={handleCancelEdit} maxWidth="sm" fullWidth>
        <DialogTitle>
          Modifier le quota - {quotaLabels[selectedQuota]}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Valeur actuelle utilisée: {usedValue}
            </Typography>
            
            <TextField
              fullWidth
              label={quotaLabels[selectedQuota]}
              type="number"
              value={currentValue}
              onChange={(e) => setEditQuotas({
                ...editQuotas,
                [selectedQuota]: parseInt(e.target.value) || 0
              })}
              inputProps={{ min: usedValue }}
              helperText={`La valeur doit être au moins ${usedValue} (valeur actuellement utilisée)`}
              sx={{ mt: 2 }}
            />
            
            {currentValue < usedValue && (
              <Alert severity="error" sx={{ mt: 2 }}>
                La valeur ne peut pas être inférieure à la valeur actuellement utilisée ({usedValue})
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit} startIcon={<CancelIcon />}>
            Annuler
          </Button>
          <Button 
            onClick={handleSaveQuota} 
            variant="contained" 
            startIcon={<SaveIcon />}
            disabled={currentValue < usedValue}
          >
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (!quotas) {
    return (
      <Alert severity="error">
        Impossible de charger les quotas
      </Alert>
    );
  }

  return (
    <Box>
      {/* Message de notification */}
      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      {/* En-tête */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h5" gutterBottom>
            Gestion des Quotas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos limites de ressources et surveillez votre utilisation
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadQuotas}
          disabled={loading}
        >
          Actualiser
        </Button>
      </Box>

      {/* Cartes de quotas */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {renderQuotaCard(
            'VPS', 
            quotas.used_vps, 
            quotas.max_vps, 
            'VPS', 
            <StorageIcon color="primary" />,
            'max_vps'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderQuotaCard(
            'CPU', 
            quotas.used_cpu, 
            quotas.max_cpu, 
            'CPU', 
            <MemoryIcon color="primary" />,
            'max_cpu'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderQuotaCard(
            'RAM', 
            quotas.used_ram, 
            quotas.max_ram, 
            'GB', 
            <MemoryIcon color="primary" />,
            'max_ram'
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderQuotaCard(
            'Stockage', 
            quotas.used_storage, 
            quotas.max_storage, 
            'GB', 
            <StorageIcon color="primary" />,
            'max_storage'
          )}
        </Grid>
      </Grid>

      {/* Informations supplémentaires */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Informations sur les quotas
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • <strong>Normal (0-74%)</strong> : Utilisation normale des ressources
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • <strong>Attention (75-89%)</strong> : Approche de la limite, surveillance recommandée
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • <strong>Critique (90-100%)</strong> : Limite atteinte, action immédiate requise
          </Typography>
          
          {user.role === 'admin' && (
            <Typography variant="body2" color="primary" sx={{ mt: 2, fontStyle: 'italic' }}>
              💡 En tant qu'administrateur, vous pouvez modifier les quotas en cliquant sur l'icône d'édition
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Dialog d'édition */}
      {renderEditDialog()}
    </Box>
  );
};

export default QuotaManager;
