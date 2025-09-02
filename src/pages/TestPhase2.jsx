import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  Paper,
  Divider
} from '@mui/material';
import RoleBasedDashboard from './RoleBasedDashboard';
import QuotaManager from '../components/QuotaManager';
import UserManagement from '../components/UserManagement';

const TestPhase2 = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { label: 'Dashboard Adaptatif', component: <RoleBasedDashboard /> },
    { label: 'Gestion des Quotas', component: <QuotaManager /> },
    { label: 'Gestion des Utilisateurs', component: <UserManagement /> }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          🚀 Phase 2 : Test des Interfaces Adaptées
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Testez les composants de la Phase 2 : Dashboard adaptatif, gestion des quotas et gestion des utilisateurs
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Phase 2 tabs">
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ mt: 2 }}>
          {tabs[activeTab].component}
        </Box>

        <Divider sx={{ mt: 4 }} />
        
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            📋 Instructions de test :
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • <strong>Dashboard Adaptatif</strong> : Vérifiez que l'interface s'adapte à votre rôle
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • <strong>Gestion des Quotas</strong> : Testez l'affichage et la modification des quotas (admin uniquement)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            • <strong>Gestion des Utilisateurs</strong> : Testez la création/modification d'utilisateurs selon votre rôle
          </Typography>
          
          <Typography variant="body2" color="primary" sx={{ mt: 2, fontStyle: 'italic' }}>
            💡 Note : Ces composants utilisent des données simulées pour le moment. 
            Les vrais appels API seront implémentés dans la Phase 3.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestPhase2;
