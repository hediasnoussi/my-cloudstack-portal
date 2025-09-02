const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Démarrage du serveur CloudStack complet...');

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test
app.get('/test', (req, res) => {
  res.json({ message: 'API CloudStack is working!' });
});

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'CloudStack Portal API - Version Complète',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      stats: '/api/global/cloudstack/stats',
      volumes: '/api/global/cloudstack/volumes',
      vms: '/api/global/cloudstack/virtual-machines'
    }
  });
});

console.log('✅ Routes de base configurées');

// Charger le contrôleur CloudStack
try {
  console.log('🔄 Chargement du contrôleur CloudStack...');
  const cloudstackController = require('./controllers/cloudstackController');
  console.log('✅ Contrôleur CloudStack chargé');
  
  // Routes CloudStack avec le vrai contrôleur
  app.get('/api/global/cloudstack/stats', cloudstackController.getDashboardStats);
  app.get('/api/global/cloudstack/domains', cloudstackController.getCloudStackDomains);
  app.get('/api/global/cloudstack/accounts', cloudstackController.getCloudStackAccounts);
  app.get('/api/global/cloudstack/projects', cloudstackController.getCloudStackProjects);
  app.get('/api/global/cloudstack/virtual-machines', cloudstackController.getCloudStackVirtualMachines);
  app.get('/api/global/cloudstack/volumes', cloudstackController.getCloudStackVolumes);
  app.get('/api/global/cloudstack/networks', cloudstackController.getCloudStackNetworks);
  app.get('/api/global/cloudstack/security-groups', cloudstackController.getCloudStackSecurityGroups);
  app.get('/api/global/cloudstack/templates', cloudstackController.getCloudStackTemplates);
  app.get('/api/global/cloudstack/service-offerings', cloudstackController.getCloudStackServiceOfferings);
  app.get('/api/global/cloudstack/zones', cloudstackController.getCloudStackZones);
  
  // Actions sur les instances
  app.post('/api/global/cloudstack/virtual-machines', cloudstackController.deployCloudStackVirtualMachine);
  app.post('/api/global/cloudstack/virtual-machines/:id/start', cloudstackController.startCloudStackVirtualMachine);
  app.post('/api/global/cloudstack/virtual-machines/:id/stop', cloudstackController.stopCloudStackVirtualMachine);
  app.post('/api/global/cloudstack/virtual-machines/:id/reboot', cloudstackController.rebootCloudStackVirtualMachine);
  app.delete('/api/global/cloudstack/virtual-machines/:id', cloudstackController.destroyCloudStackVirtualMachine);
  
  // Gestion des volumes
  app.post('/api/global/cloudstack/volumes', cloudstackController.createCloudStackVolume);
  app.post('/api/global/cloudstack/volumes/:id/attach', cloudstackController.attachCloudStackVolume);
  app.post('/api/global/cloudstack/volumes/:id/detach', cloudstackController.detachCloudStackVolume);
  app.delete('/api/global/cloudstack/volumes/:id', cloudstackController.deleteCloudStackVolume);
  
  // Gestion des réseaux
  app.post('/api/global/cloudstack/networks', cloudstackController.createCloudStackNetwork);
  app.delete('/api/global/cloudstack/networks/:id', cloudstackController.deleteCloudStackNetwork);
  
  // Gestion des groupes de sécurité
  app.post('/api/global/cloudstack/security-groups', cloudstackController.createCloudStackSecurityGroup);
  app.delete('/api/global/cloudstack/security-groups/:id', cloudstackController.deleteCloudStackSecurityGroup);
  
  console.log('✅ Routes CloudStack configurées');
} catch (error) {
  console.log('❌ Erreur lors du chargement du contrôleur CloudStack:', error.message);
  console.log('❌ Stack:', error.stack);
  
  // Routes de fallback
  app.get('/api/global/cloudstack/stats', (req, res) => {
    res.json({ error: 'Contrôleur non disponible', message: error.message });
  });
  
  app.get('/api/global/cloudstack/volumes', (req, res) => {
    res.json({ error: 'Contrôleur non disponible', message: error.message });
  });
}

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// Route 404 pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

console.log('🚀 Démarrage de l\'écoute sur le port', PORT);

// Démarrer le serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at: http://127.0.0.1:${PORT}`);
  console.log('🎉 Serveur CloudStack complet prêt !');
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Le port ${PORT} est déjà utilisé !`);
  } else {
    console.error('❌ Erreur du serveur:', error);
  }
  process.exit(1);
});

console.log('✅ Script server-cloudstack.js terminé');
