import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip
} from '@mui/material';
import {
  Computer as ComputerIcon,
  Download as DownloadIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const Templates = () => {
  const [subTab, setSubTab] = useState(0);

  const templates = [
    {
      id: 1,
      name: 'Ubuntu',
      description: 'Ubuntu 22.04 LTS - Système d\'exploitation Linux populaire',
      os: 'Linux',
      version: '22.04 LTS',
      category: 'Linux',
      downloadUrl: '#',
      size: '2.5 GB'
    },
    {
      id: 2,
      name: 'CentOS',
      description: 'CentOS 8 - Distribution Linux d\'entreprise',
      os: 'Linux',
      version: '8',
      category: 'Enterprise Linux',
      downloadUrl: '#',
      size: '3.2 GB'
    },
    {
      id: 3,
      name: 'Windows',
      description: 'Windows Server 2022 - Système d\'exploitation Microsoft',
      os: 'Windows',
      version: 'Server 2022',
      category: 'Windows Server',
      downloadUrl: '#',
      size: '8.5 GB'
    }
  ];

  const subTabs = [
    'Featured',
    'Community', 
    'My Templates',
    'Shared'
  ];

  const handleDownload = (template) => {
    console.log(`Téléchargement de ${template.name}`);
    // Ici vous pouvez implémenter la logique de téléchargement
  };

  const handleInfo = (template) => {
    console.log(`Informations sur ${template.name}`);
    // Ici vous pouvez afficher plus d'informations sur le template
  };

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
      </Box>

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
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
          Select a template
        </Typography>
        
        <Grid container spacing={3} justifyContent="center">
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
                    {template.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label={template.os} 
                      size="small" 
                      variant="outlined"
                      color={template.os === 'Linux' ? 'success' : 'primary'}
                    />
                    <Chip 
                      label={template.version} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={template.size} 
                      size="small" 
                      variant="outlined"
                      color="secondary"
                    />
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(template)}
                    fullWidth
                    sx={{ mr: 1 }}
                  >
                    Télécharger
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
      </Box>

      {/* Message si aucun template */}
      {templates.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Aucun template disponible
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Templates; 