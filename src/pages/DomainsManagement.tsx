import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Domain as DomainIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import MainCard from '../components/MainCard';
import { apiService } from '../services/api';

interface Domain {
  id: number;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

const DomainsManagement: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDomains();
      // S'assurer que la réponse est un tableau
      const data = Array.isArray(response.data) ? response.data : [];
      setDomains(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des domaines');
      console.error('Error fetching domains:', err);
      setDomains([]); // Initialiser avec un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (domain?: Domain) => {
    if (domain) {
      setEditingDomain(domain);
      setFormData({
        name: domain.name,
        description: domain.description
      });
    } else {
      setEditingDomain(null);
      setFormData({ name: '', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDomain(null);
    setFormData({ name: '', description: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingDomain) {
        await apiService.updateDomain(editingDomain.id, formData);
      } else {
        await apiService.createDomain(formData);
      }
      handleCloseDialog();
      fetchDomains();
    } catch (err) {
      console.error('Error saving domain:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
      try {
        await apiService.deleteDomain(id);
        fetchDomains();
      } catch (err) {
        console.error('Error deleting domain:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  // Fonctions utilitaires pour les statistiques avec vérification de tableau
  const getActiveDomains = () => {
    return Array.isArray(domains) ? domains.filter(d => d.status && d.status.toLowerCase() === 'active').length : 0;
  };

  const getInactiveDomains = () => {
    return Array.isArray(domains) ? domains.filter(d => d.status && d.status.toLowerCase() === 'inactive').length : 0;
  };

  const getNewDomainsThisMonth = () => {
    if (!Array.isArray(domains)) return 0;
    const now = new Date();
    return domains.filter(d => {
      if (!d.created_at) return false;
      const created = new Date(d.created_at);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Statistiques avec couleurs beiges */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="Total Domaines"
            subtitle={`${domains.length} domaines actifs`}
            sx={{ 
              background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
              border: '2px solid #f0f0d0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <DomainIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {domains.length}
              </Typography>
            </Box>
          </MainCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="Domaines Actifs"
            subtitle="En cours d'utilisation"
            sx={{ 
              background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
              border: '2px solid #f0f0d0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {getActiveDomains()}
              </Typography>
            </Box>
          </MainCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="Domaines Inactifs"
            subtitle="En attente d'activation"
            sx={{ 
              background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
              border: '2px solid #f0f0d0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ErrorIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {getInactiveDomains()}
              </Typography>
            </Box>
          </MainCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MainCard
            title="Nouveaux Domaines"
            subtitle="Créés ce mois"
            sx={{ 
              background: 'linear-gradient(135deg, #f5f5dc 0%, #fafaf0 100%)',
              border: '2px solid #f0f0d0'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AddIcon sx={{ fontSize: 40, color: '#1e3a8a' }} />
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {getNewDomainsThisMonth()}
              </Typography>
            </Box>
          </MainCard>
        </Grid>
      </Grid>

      {/* Alert beige */}
      {error && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            backgroundColor: '#f5f5dc',
            color: '#1e293b',
            border: '1px solid #f0f0d0'
          }}
        >
          {error}
        </Alert>
      )}

      {/* En-tête avec bouton beige */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        p: 3,
        backgroundColor: '#f5f5dc',
        borderRadius: 2,
        border: '1px solid #f0f0d0'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Gestion des Domaines
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#fbbf24',
            color: '#1e293b',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#f59e0b',
            },
            px: 3,
            py: 1.5,
            borderRadius: 2
          }}
        >
          Ajouter un Domaine
        </Button>
      </Box>

      {/* Tableau avec en-têtes beiges */}
      <MainCard>
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  backgroundColor: '#f5f5dc', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  fontSize: '0.9rem'
                }}>
                  Nom
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: '#f5f5dc', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  fontSize: '0.9rem'
                }}>
                  Description
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: '#f5f5dc', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  fontSize: '0.9rem'
                }}>
                  Statut
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: '#f5f5dc', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  fontSize: '0.9rem'
                }}>
                  Date de Création
                </TableCell>
                <TableCell sx={{ 
                  backgroundColor: '#f5f5dc', 
                  fontWeight: 600, 
                  color: '#1e293b',
                  fontSize: '0.9rem'
                }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(domains) && domains.map((domain) => (
                <TableRow key={domain.id} sx={{ '&:hover': { backgroundColor: 'rgba(30, 58, 138, 0.04)' } }}>
                  <TableCell sx={{ fontWeight: 500, color: '#1e293b' }}>
                    {domain.name}
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {domain.description}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={domain.status || 'N/A'}
                      color={getStatusColor(domain.status) as any}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>
                    {new Date(domain.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(domain)}
                        sx={{ 
                          color: '#1e3a8a',
                          '&:hover': { backgroundColor: 'rgba(30, 58, 138, 0.1)' }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(domain.id)}
                        sx={{ 
                          color: '#dc2626',
                          '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.1)' }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>

      {/* Dialog avec accents beiges */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          backgroundColor: '#f5f5dc',
          color: '#1e293b',
          fontWeight: 600,
          borderBottom: '1px solid #f0f0d0'
        }}>
          {editingDomain ? 'Modifier le Domaine' : 'Ajouter un Domaine'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Nom du domaine"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 3,
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #f0f0d0'
        }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#64748b' }}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: '#1e3a8a',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1e40af',
              },
            }}
          >
            {editingDomain ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DomainsManagement; 