const express = require('express');
const router = express.Router();
const cloudstackController = require('../controllers/cloudstackController');

// ===== ROUTES CLOUDSTACK DIRECT =====

// Statistiques du dashboard
router.get('/cloudstack/stats', cloudstackController.getDashboardStats);

// Récupération des ressources
router.get('/cloudstack/domains', cloudstackController.getCloudStackDomains);
router.get('/cloudstack/accounts', cloudstackController.getCloudStackAccounts);
router.get('/cloudstack/projects', cloudstackController.getCloudStackProjects);
router.get('/cloudstack/virtual-machines', cloudstackController.getCloudStackVirtualMachines);
router.get('/cloudstack/volumes', cloudstackController.getCloudStackVolumes);
router.get('/cloudstack/networks', cloudstackController.getCloudStackNetworks);
router.get('/cloudstack/security-groups', cloudstackController.getCloudStackSecurityGroups);

// Nouvelles routes pour la gestion d'instances
router.get('/cloudstack/templates', cloudstackController.getCloudStackTemplates);
router.get('/cloudstack/service-offerings', cloudstackController.getCloudStackServiceOfferings);
router.get('/cloudstack/zones', cloudstackController.getCloudStackZones);

// Actions sur les instances
router.post('/cloudstack/virtual-machines', cloudstackController.deployCloudStackVirtualMachine);
router.post('/cloudstack/virtual-machines/:id/start', cloudstackController.startCloudStackVirtualMachine);
router.post('/cloudstack/virtual-machines/:id/stop', cloudstackController.stopCloudStackVirtualMachine);
router.post('/cloudstack/virtual-machines/:id/reboot', cloudstackController.rebootCloudStackVirtualMachine);
router.delete('/cloudstack/virtual-machines/:id', cloudstackController.destroyCloudStackVirtualMachine);

// Gestion des volumes
router.post('/cloudstack/volumes', cloudstackController.createCloudStackVolume);
router.post('/cloudstack/volumes/:id/attach', cloudstackController.attachCloudStackVolume);
router.post('/cloudstack/volumes/:id/detach', cloudstackController.detachCloudStackVolume);
router.delete('/cloudstack/volumes/:id', cloudstackController.deleteCloudStackVolume);

// Gestion des réseaux
router.post('/cloudstack/networks', cloudstackController.createCloudStackNetwork);
router.delete('/cloudstack/networks/:id', cloudstackController.deleteCloudStackNetwork);

// Gestion des groupes de sécurité
router.post('/cloudstack/security-groups', cloudstackController.createCloudStackSecurityGroup);
router.delete('/cloudstack/security-groups/:id', cloudstackController.deleteCloudStackSecurityGroup);

// Gestion des templates
router.post('/cloudstack/templates', cloudstackController.createCloudStackTemplate);
router.get('/cloudstack/ostypes', cloudstackController.getCloudStackOsTypes);

// ===== ROUTES DE COMPATIBILITÉ (DONNÉES MOCK) =====

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