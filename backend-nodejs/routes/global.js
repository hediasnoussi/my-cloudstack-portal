const express = require('express');
const router = express.Router();

// Endpoint pour les domaines
router.get('/domains', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'focustechnology.com', status: 'active', description: 'Domaine principal' },
      { id: 2, name: 'cloud.focustechnology.com', status: 'active', description: 'Sous-domaine cloud' }
    ]
  });
});

// Endpoint pour les rôles
router.get('/roles', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'admin', description: 'Administrateur système' },
      { id: 2, name: 'user', description: 'Utilisateur standard' },
      { id: 3, name: 'subprovider', description: 'Fournisseur secondaire' },
      { id: 4, name: 'partner', description: 'Partenaire commercial' }
    ]
  });
});

// Endpoint pour les comptes
router.get('/accounts', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Focus Technology Solutions', status: 'active', type: 'enterprise' },
      { id: 2, name: 'CloudStack Portal', status: 'active', type: 'service' }
    ]
  });
});

// Endpoint pour les zones
router.get('/zones', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Zone 1', status: 'active', description: 'Zone principale' },
      { id: 2, name: 'Zone 2', status: 'active', description: 'Zone secondaire' }
    ]
  });
});

module.exports = router; 