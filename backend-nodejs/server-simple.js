const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Démarrage du serveur CloudStack simplifié...');

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middleware de base configuré');

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'CloudStack Portal API - Version Simplifiée',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      cloudstack: '/api/global/cloudstack/*'
    }
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API CloudStack is working!' });
});

console.log('✅ Routes de base configurées');

// Routes CloudStack uniquement
try {
  console.log('🔄 Chargement des routes CloudStack...');
  const cloudstackController = require('./controllers/cloudstackController');
  
  // Routes CloudStack directes
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
  
  // Gestion des templates
  app.post('/api/global/cloudstack/templates', cloudstackController.createCloudStackTemplate);
  app.get('/api/global/cloudstack/ostypes', cloudstackController.getCloudStackOsTypes);
  
  console.log('✅ Routes CloudStack chargées');
} catch (error) {
  console.log('❌ Error loading CloudStack routes:', error.message);
  console.log('❌ Stack:', error.stack);
  process.exit(1);
}

console.log('✅ Toutes les routes CloudStack ont été chargées');

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
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
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
  console.log(`🌐 Server accessible at: http://127.0.0.1:${PORT}`);
  console.log('🎉 Serveur CloudStack prêt !');
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

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});

console.log('✅ Script server-simple.js terminé - Serveur en cours d\'exécution...');

