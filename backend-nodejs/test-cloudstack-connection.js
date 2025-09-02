require('dotenv').config();
const cloudstackAPI = require('./cloudstack-api');

async function testCloudStackConnection() {
  console.log('🧪 Test de connexion CloudStack...\n');
  
  try {
    // Test 1: Vérifier la configuration
    console.log('📋 Configuration actuelle:');
    console.log(`   API URL: ${process.env.CLOUDSTACK_API_URL || 'Non définie'}`);
    console.log(`   API Key: ${process.env.CLOUDSTACK_API_KEY ? '✅ Définie' : '❌ Non définie'}`);
    console.log(`   Secret Key: ${process.env.CLOUDSTACK_SECRET_KEY ? '✅ Définie' : '❌ Non définie'}\n`);
    
    if (!process.env.CLOUDSTACK_API_KEY || !process.env.CLOUDSTACK_SECRET_KEY) {
      console.log('❌ Erreur: CLOUDSTACK_API_KEY et CLOUDSTACK_SECRET_KEY doivent être définies dans le fichier .env');
      return;
    }
    
    // Test 2: Test de connexion simple
    console.log('🔌 Test de connexion à l\'API CloudStack...');
    const response = await cloudstackAPI.makeRequest('listCapabilities');
    
    if (response.listcapabilitiesresponse) {
      console.log('✅ Connexion réussie !');
      console.log(`   Version CloudStack: ${response.listcapabilitiesresponse.capability?.[0]?.version || 'Non disponible'}`);
    } else {
      console.log('❌ Réponse inattendue de l\'API');
      console.log('Réponse:', JSON.stringify(response, null, 2));
    }
    
    // Test 3: Récupérer les domaines
    console.log('\n🌐 Test de récupération des domaines...');
    const domains = await cloudstackAPI.getDomains();
    console.log(`✅ ${domains.length} domaines récupérés`);
    
    // Test 4: Récupérer les zones
    console.log('\n📍 Test de récupération des zones...');
    const zones = await cloudstackAPI.makeRequest('listZones');
    if (zones.listzonesresponse?.zone) {
      console.log(`✅ ${zones.listzonesresponse.zone.length} zones récupérées`);
      zones.listzonesresponse.zone.forEach(zone => {
        console.log(`   - ${zone.name} (${zone.state})`);
      });
    }
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggestions de résolution:');
      console.log('   1. Vérifiez que le serveur CloudStack est démarré');
      console.log('   2. Vérifiez l\'URL dans CLOUDSTACK_API_URL');
      console.log('   3. Vérifiez que le port est accessible');
    } else if (error.message.includes('CloudStack Error')) {
      console.log('\n💡 Suggestions de résolution:');
      console.log('   1. Vérifiez vos clés API CloudStack');
      console.log('   2. Vérifiez les permissions de votre compte');
      console.log('   3. Vérifiez que l\'API est activée');
    }
  }
}

// Exécuter le test
testCloudStackConnection();
