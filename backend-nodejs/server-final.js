const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🚀 Démarrage du serveur CloudStack final...');

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
    message: 'CloudStack Portal API - Version Finale',
    version: '2.0.0',
    status: 'running'
  });
});

console.log('✅ Routes de base configurées');

// Charger le contrôleur CloudStack
try {
  console.log('🔄 Chargement du contrôleur CloudStack...');
  const cloudstackController = require('./controllers/cloudstackController');
  console.log('✅ Contrôleur CloudStack chargé');
  
  // Routes GET CloudStack
  app.get('/api/global/cloudstack/stats', cloudstackController.getDashboardStats);
  app.get('/api/global/cloudstack/domains', cloudstackController.getCloudStackDomains);
  app.get('/api/global/cloudstack/accounts', cloudstackController.getCloudStackAccounts);
  app.get('/api/global/cloudstack/projects', cloudstackController.getCloudStackProjects);
  app.get('/api/global/cloudstack/virtual-machines', cloudstackController.getCloudStackVirtualMachines);
  app.get('/api/global/cloudstack/volumes', cloudstackController.getCloudStackVolumes);
  app.get('/api/global/cloudstack/snapshots', cloudstackController.getCloudStackSnapshots);
  app.get('/api/global/cloudstack/instance-groups', cloudstackController.getCloudStackInstanceGroups);
  app.get('/api/global/cloudstack/ssh-key-pairs', cloudstackController.getCloudStackSSHKeyPairs);
  app.get('/api/global/cloudstack/users', cloudstackController.getCloudStackUsers);
  app.get('/api/global/cloudstack/accounts', cloudstackController.getCloudStackAccounts);
  app.get('/api/global/cloudstack/user-data', cloudstackController.getCloudStackUserData);
  app.get('/api/global/cloudstack/os-types', cloudstackController.getCloudStackOSTypes);
  app.get('/api/global/cloudstack/networks', cloudstackController.getCloudStackNetworks);
  app.get('/api/global/cloudstack/security-groups', cloudstackController.getCloudStackSecurityGroups);
  app.get('/api/global/cloudstack/templates', cloudstackController.getCloudStackTemplates);
  app.get('/api/global/cloudstack/service-offerings', cloudstackController.getCloudStackServiceOfferings);
  app.get('/api/global/cloudstack/zones', cloudstackController.getCloudStackZones);
  
  // Nouvelles routes pour VPC et IP publiques
  app.get('/api/global/cloudstack/vpcs', cloudstackController.getCloudStackVPCs);
  app.get('/api/global/cloudstack/public-ips', cloudstackController.getCloudStackPublicIPs);
  app.get('/api/global/cloudstack/networks-detailed', cloudstackController.getCloudStackNetworksDetailed);
  app.get('/api/global/cloudstack/network-acls', cloudstackController.getCloudStackNetworkACLs);
  
  // Routes POST CloudStack
  app.post('/api/global/cloudstack/virtual-machines', cloudstackController.deployCloudStackVirtualMachine);
  app.post('/api/global/cloudstack/volumes', cloudstackController.createCloudStackVolume);
  app.post('/api/global/cloudstack/snapshots', cloudstackController.createCloudStackSnapshot);
  app.post('/api/global/cloudstack/instance-groups', cloudstackController.createCloudStackInstanceGroup);
  app.post('/api/global/cloudstack/ssh-key-pairs', cloudstackController.createCloudStackSSHKeyPair);
  app.post('/api/global/cloudstack/ssh-key-pairs/register', cloudstackController.registerCloudStackSSHKeyPair);
  app.post('/api/global/cloudstack/users', cloudstackController.createCloudStackUser);
  app.post('/api/global/cloudstack/accounts', cloudstackController.createCloudStackAccount);
  app.post('/api/global/cloudstack/user-data', cloudstackController.createCloudStackUserDataTemplate);
  app.post('/api/global/cloudstack/networks', cloudstackController.createCloudStackNetwork);
  app.post('/api/global/cloudstack/security-groups', cloudstackController.createCloudStackSecurityGroup);
  
  // Nouvelles routes POST pour VPC et IP publiques
  app.post('/api/global/cloudstack/vpcs', cloudstackController.createCloudStackVPC);
  app.post('/api/global/cloudstack/public-ips/associate', cloudstackController.associateCloudStackPublicIP);
  app.post('/api/global/cloudstack/networks/isolated', cloudstackController.createCloudStackIsolatedNetwork);
  app.post('/api/global/cloudstack/networks/shared', cloudstackController.createCloudStackSharedNetwork);
  app.post('/api/global/cloudstack/network-acls', cloudstackController.createCloudStackNetworkACL);
  
  // Routes DELETE CloudStack
  app.delete('/api/global/cloudstack/volumes/:id', cloudstackController.deleteCloudStackVolume);
  app.delete('/api/global/cloudstack/snapshots/:id', cloudstackController.deleteCloudStackSnapshot);
  app.delete('/api/global/cloudstack/instance-groups/:id', cloudstackController.deleteCloudStackInstanceGroup);
  app.delete('/api/global/cloudstack/ssh-key-pairs/:name', cloudstackController.deleteCloudStackSSHKeyPair);
  app.delete('/api/global/cloudstack/users/:id', cloudstackController.deleteCloudStackUser);
  app.delete('/api/global/cloudstack/accounts/:id', cloudstackController.deleteCloudStackAccount);
  app.delete('/api/global/cloudstack/user-data/:id', cloudstackController.deleteCloudStackUserDataTemplate);
  app.delete('/api/global/cloudstack/networks/:id', cloudstackController.deleteCloudStackNetwork);
  app.delete('/api/global/cloudstack/security-groups/:id', cloudstackController.deleteCloudStackSecurityGroup);
  
  // Nouvelles routes DELETE pour VPC et IP publiques
  app.delete('/api/global/cloudstack/vpcs/:id', cloudstackController.deleteCloudStackVPC);
  app.delete('/api/global/cloudstack/public-ips/:id', cloudstackController.releaseCloudStackPublicIP);
  app.delete('/api/global/cloudstack/network-acls/:id', cloudstackController.deleteCloudStackNetworkACL);
  
  // Routes PUT CloudStack
  app.put('/api/global/cloudstack/snapshots/:id/revert', cloudstackController.revertCloudStackSnapshot);
  app.put('/api/global/cloudstack/instance-groups/:id', cloudstackController.updateCloudStackInstanceGroup);
  app.put('/api/global/cloudstack/users/:id', cloudstackController.updateCloudStackUser);
  app.put('/api/global/cloudstack/users/:id/status', cloudstackController.updateCloudStackUserStatus);
  app.put('/api/global/cloudstack/user-data/:id', cloudstackController.updateCloudStackUserDataTemplate);
  
  // Nouvelles routes PUT pour VPC et IP publiques
  app.put('/api/global/cloudstack/vpcs/:id', cloudstackController.updateCloudStackVPC);
  app.put('/api/global/cloudstack/public-ips/:id/disassociate', cloudstackController.disassociateCloudStackPublicIP);
  app.put('/api/global/cloudstack/networks/:id', cloudstackController.updateCloudStackNetwork);
  
  console.log('✅ Routes CloudStack configurées');
} catch (error) {
  console.log('❌ Erreur lors du chargement du contrôleur CloudStack:', error.message);
  
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

console.log('🚀 Démarrage de l\'écoute sur le port', PORT);

// Démarrer le serveur
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at: http://127.0.0.1:${PORT}`);
  console.log('🎉 Serveur CloudStack final prêt !');
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

console.log('✅ Script server-final.js terminé');
