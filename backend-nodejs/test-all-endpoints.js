const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Configuration pour les tests
const testConfig = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Fonction de test avec gestion d'erreur
async function testEndpoint(name, method, url, data = null) {
  try {
    console.log(`🧪 Test: ${name}`);
    console.log(`   ${method.toUpperCase()} ${url}`);
    
    const config = { ...testConfig, method, url };
    if (data) config.data = data;
    
    const response = await axios(config);
    
    console.log(`   ✅ Succès (${response.status})`);
    if (response.data && typeof response.data === 'object') {
      console.log(`   📊 Données: ${JSON.stringify(response.data).substring(0, 100)}...`);
    }
    return true;
  } catch (error) {
    console.log(`   ❌ Échec: ${error.message}`);
    if (error.response) {
      console.log(`   📊 Status: ${error.response.status}`);
      console.log(`   📊 Erreur: ${JSON.stringify(error.response.data).substring(0, 100)}...`);
    }
    return false;
  }
}

// Tests des endpoints de base
async function testBasicEndpoints() {
  console.log('\n🔍 === TESTS DES ENDPOINTS DE BASE ===\n');
  
  await testEndpoint('Test de base', 'GET', `${BASE_URL}/test`);
  await testEndpoint('Informations API', 'GET', `${BASE_URL}/`);
}

// Tests des endpoints CloudStack
async function testCloudStackEndpoints() {
  console.log('\n🔍 === TESTS DES ENDPOINTS CLOUDSTACK ===\n');
  
  await testEndpoint('Liste des instances', 'GET', `${BASE_URL}/api/cloudstack/instances`);
  await testEndpoint('Liste des templates', 'GET', `${BASE_URL}/api/cloudstack/templates`);
  await testEndpoint('Liste des offres de service', 'GET', `${BASE_URL}/api/cloudstack/service-offerings`);
  await testEndpoint('Liste des zones', 'GET', `${BASE_URL}/api/cloudstack/zones`);
  await testEndpoint('Statistiques des instances', 'GET', `${BASE_URL}/api/cloudstack/instances-stats`);
}

// Tests des endpoints globaux
async function testGlobalEndpoints() {
  console.log('\n🔍 === TESTS DES ENDPOINTS GLOBAUX ===\n');
  
  await testEndpoint('Statistiques globales', 'GET', `${BASE_URL}/api/global/stats`);
  await testEndpoint('Domaines CloudStack', 'GET', `${BASE_URL}/api/global/domains`);
  await testEndpoint('Comptes CloudStack', 'GET', `${BASE_URL}/api/global/accounts`);
  await testEndpoint('Projets CloudStack', 'GET', `${BASE_URL}/api/global/projects`);
  await testEndpoint('Instances CloudStack', 'GET', `${BASE_URL}/api/global/virtual-machines`);
  await testEndpoint('Volumes CloudStack', 'GET', `${BASE_URL}/api/global/volumes`);
  await testEndpoint('Réseaux CloudStack', 'GET', `${BASE_URL}/api/global/networks`);
  await testEndpoint('Groupes de sécurité', 'GET', `${BASE_URL}/api/global/security-groups`);
}

// Tests des endpoints compute (base de données locale)
async function testComputeEndpoints() {
  console.log('\n🔍 === TESTS DES ENDPOINTS COMPUTE (DB LOCALE) ===\n');
  
  await testEndpoint('Liste des instances (DB)', 'GET', `${BASE_URL}/api/compute/instances`);
  await testEndpoint('Liste des snapshots', 'GET', `${BASE_URL}/api/compute/instance-snapshots`);
  await testEndpoint('Liste des clusters Kubernetes', 'GET', `${BASE_URL}/api/compute/kubernetes-clusters`);
  await testEndpoint('Liste des groupes autoscaling', 'GET', `${BASE_URL}/api/compute/autoscaling-groups`);
  await testEndpoint('Liste des groupes d\'instances', 'GET', `${BASE_URL}/api/compute/instance-groups`);
  await testEndpoint('Liste des clés SSH', 'GET', `${BASE_URL}/api/compute/ssh-key-pairs`);
  await testEndpoint('Liste des user-data', 'GET', `${BASE_URL}/api/compute/user-data`);
}

// Tests des endpoints storage
async function testStorageEndpoints() {
  console.log('\n🔍 === TESTS DES ENDPOINTS STORAGE ===\n');
  
  await testEndpoint('Liste des volumes', 'GET', `${BASE_URL}/api/storage/volumes`);
  await testEndpoint('Liste des snapshots', 'GET', `${BASE_URL}/api/storage/snapshots`);
  await testEndpoint('Liste des templates', 'GET', `${BASE_URL}/api/storage/templates`);
  await testEndpoint('Liste des ISOs', 'GET', `${BASE_URL}/api/storage/isos`);
}

// Tests des endpoints network
async function testNetworkEndpoints() {
  console.log('\n🔍 === TESTS DES ENDPOINTS NETWORK ===\n');
  
  await testEndpoint('Liste des VPCs', 'GET', `${BASE_URL}/api/network/vpcs`);
  await testEndpoint('Liste des sous-réseaux', 'GET', `${BASE_URL}/api/network/subnets`);
  await testEndpoint('Liste des groupes de sécurité', 'GET', `${BASE_URL}/api/network/security-groups`);
  await testEndpoint('Liste des équilibreurs de charge', 'GET', `${BASE_URL}/api/network/load-balancers`);
  await testEndpoint('Liste des passerelles', 'GET', `${BASE_URL}/api/network/gateways`);
}

// Tests des endpoints projets et utilisateurs
async function testProjectUserEndpoints() {
  console.log('\n🔍 === TESTS DES ENDPOINTS PROJETS ET UTILISATEURS ===\n');
  
  await testEndpoint('Liste des projets', 'GET', `${BASE_URL}/api/projects`);
  await testEndpoint('Liste des utilisateurs', 'GET', `${BASE_URL}/api/users`);
  await testEndpoint('Liste des quotas', 'GET', `${BASE_URL}/api/quotas`);
}

// Test de création d'instance (simulation)
async function testInstanceCreation() {
  console.log('\n🔍 === TEST DE CRÉATION D\'INSTANCE ===\n');
  
  const instanceData = {
    name: 'test-instance',
    displayname: 'Instance de test',
    serviceofferingid: '1', // À adapter selon votre environnement
    templateid: '1', // À adapter selon votre environnement
    zoneid: '1', // À adapter selon votre environnement
    startvm: false
  };
  
  await testEndpoint('Création d\'instance', 'POST', `${BASE_URL}/api/cloudstack/instances`, instanceData);
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 === DÉMARRAGE DES TESTS COMPLETS DE L\'API ===\n');
  
  try {
    // Tests de base
    await testBasicEndpoints();
    
    // Tests CloudStack
    await testCloudStackEndpoints();
    
    // Tests des autres endpoints
    await testGlobalEndpoints();
    await testComputeEndpoints();
    await testStorageEndpoints();
    await testNetworkEndpoints();
    await testProjectUserEndpoints();
    
    // Test de création (optionnel)
    // await testInstanceCreation();
    
    console.log('\n🎉 === TOUS LES TESTS TERMINÉS ===');
    console.log('\n💡 Conseils:');
    console.log('   - Vérifiez que le serveur backend est démarré sur le port 3001');
    console.log('   - Vérifiez que votre fichier .env est configuré');
    console.log('   - Vérifiez la connexion à CloudStack');
    console.log('   - Les erreurs 404 sont normales si certaines tables n\'existent pas encore');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'exécution des tests:', error.message);
  }
}

// Vérifier si le serveur est accessible avant de lancer les tests
async function checkServerAvailability() {
  try {
    console.log('🔍 Vérification de la disponibilité du serveur...');
    const response = await axios.get(`${BASE_URL}/test`, { timeout: 5000 });
    console.log('✅ Serveur accessible');
    return true;
  } catch (error) {
    console.log('❌ Serveur non accessible');
    console.log('💡 Assurez-vous que le serveur backend est démarré:');
    console.log('   cd backend-nodejs && npm start');
    return false;
  }
}

// Point d'entrée
async function main() {
  const serverAvailable = await checkServerAvailability();
  
  if (serverAvailable) {
    await runAllTests();
  } else {
    console.log('\n🛑 Impossible de continuer sans serveur accessible');
    process.exit(1);
  }
}

// Exécuter les tests
main();

