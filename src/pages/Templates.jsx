import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Fab,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';
import CreateTemplateDialog from '../components/CreateTemplateDialog';

const Templates = () => {
  const [subTab, setSubTab] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const subTabs = [
    'Featured',
    'Community', 
    'My Templates',
    'Shared'
  ];

  // Récupérer les templates depuis CloudStack
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/cloudstack/templates');
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data || []);
      } else {
        setError(data.error || 'Erreur lors de la récupération des templates');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur lors de la récupération des templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = (newTemplate) => {
    // Ajouter le nouveau template à la liste
    setTemplates(prev => [...prev, newTemplate]);
    // Rafraîchir la liste complète
    fetchTemplates();
  };

  const handleDownload = (template) => {
    console.log(`Téléchargement de ${template.name}`);
    // Ici vous pouvez implémenter la logique de téléchargement
  };

  const handleInfo = (template) => {
    console.log(`Informations sur ${template.name}`);
    // Ici vous pouvez afficher plus d'informations sur le template
  };

  const getTemplateStatusColor = (template) => {
    if (template.isready) return 'success';
    if (template.status === 'Downloading') return 'warning';
    return 'error';
  };

  const getTemplateStatusText = (template) => {
    if (template.isready) return 'Prêt';
    if (template.status === 'Downloading') return 'En cours...';
    return 'Non prêt';
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Chargement des templates...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Templates
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Disc image containing data or bootable media for OS.
        </Typography>
        
        {/* Bouton de rafraîchissement */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchTemplates}
            disabled={loading}
          >
            Rafraîchir
          </Button>
        </Box>
      </Box>

      {/* Affichage des erreurs */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Sous-onglets */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          {subTabs.map((tab, index) => (
            <Button
              key={index}
              variant={subTab === index ? 'contained' : 'outlined'}
              onClick={() => setSubTab(index)}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                py: 1,
                borderRadius: 2,
                '&.MuiButton-contained': {
                  backgroundColor: 'grey.800',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'grey.900'
                  }
                },
                '&.MuiButton-outlined': {
                  borderColor: 'grey.300',
                  color: 'grey.700',
                  '&:hover': {
                    borderColor: 'grey.400',
                    backgroundColor: 'grey.50'
                  }
                }
              }}
            >
              {tab}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Section des cartes de templates */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 600 }}>
            {templates.length > 0 ? `${templates.length} template(s) disponible(s)` : 'Aucun template disponible'}
          </Typography>
          
          {/* Bouton de création */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Créer un template
          </Button>
        </Box>
        
        {templates.length > 0 ? (
          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ComputerIcon sx={{ fontSize: 24, color: 'primary.main', mr: 1 }} />
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                        {template.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {template.displaytext || 'Aucune description'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        label={template.ostypedesc || 'Linux'} 
                        size="small" 
                        variant="outlined"
                        color="success"
                      />
                      <Chip 
                        label={template.format || 'QCOW2'} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={getTemplateStatusText(template)} 
                        size="small" 
                        variant="outlined"
                        color={getTemplateStatusColor(template)}
                      />
                      {template.ispublic && (
                        <Chip 
                          label="Public" 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      )}
                    </Box>

                    {/* Informations techniques */}
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="caption" color="textSecondary" display="block">
                        <strong>Zone:</strong> {template.zonename || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        <strong>Hyperviseur:</strong> {template.hypervisor || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        <strong>Type:</strong> {template.templatetype || 'N/A'}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(template)}
                      fullWidth
                      sx={{ mr: 1 }}
                      disabled={!template.isready}
                    >
                      {template.isready ? 'Télécharger' : 'Non prêt'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<InfoIcon />}
                      onClick={() => handleInfo(template)}
                      size="small"
                    >
                      Info
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={4}>
            <CloudIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Aucun template disponible
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              Créez votre premier template pour commencer à déployer des instances
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
              size="large"
            >
              Créer un template
            </Button>
          </Box>
        )}
      </Box>

      {/* Bouton flottant de création */}
      <Fab
        color="primary"
        aria-label="Créer un template"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Dialog de création de template */}
      <CreateTemplateDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onTemplateCreated={handleCreateTemplate}
      />
    </Box>
  );
};

export default Templates; 