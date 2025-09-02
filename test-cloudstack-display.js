import axios from 'axios';

async function testCloudStackDisplay() {
  console.log('🌐 Test de l\'affichage des données CloudStack...\n');
  
  try {
    // Test 1: Vérifier que le backend fonctionne
    console.log('1️⃣ Test du backend...');
    const backendTest = await axios.get('http://localhost:3001/test');
    console.log('✅ Backend OK:', backendTest.data);
    
    // Test 2: Récupérer les statistiques CloudStack
    console.log('\n2️⃣ Test des statistiques CloudStack...');
    const stats = await axios.get('http://localhost:3001/api/global/cloudstack/stats');
    console.log('✅ Statistiques CloudStack:', stats.data);
    
    // Test 3: Récupérer les instances CloudStack
    console.log('\n3️⃣ Test des instances CloudStack...');
    const instances = await axios.get('http://localhost:3001/api/global/cloudstack/virtual-machines');
    console.log(`✅ ${instances.data.length} instances CloudStack récupérées`);
    
    if (instances.data.length > 0) {
      const firstInstance = instances.data[0];
      console.log('   Exemple d\'instance:', {
        name: firstInstance.name,
        state: firstInstance.state,
        cpu: firstInstance.cpunumber,
        memory: firstInstance.memory,
        template: firstInstance.templatename
      });
    }
    
    // Test 4: Récupérer les domaines CloudStack
    console.log('\n4️⃣ Test des domaines CloudStack...');
    const domains = await axios.get('http://localhost:3001/api/global/cloudstack/domains');
    console.log(`✅ ${domains.data.length} domaines CloudStack récupérés`);
    
    // Test 5: Récupérer les comptes CloudStack
    console.log('\n5️⃣ Test des comptes CloudStack...');
    const accounts = await axios.get('http://localhost:3001/api/global/cloudstack/accounts');
    console.log(`✅ ${accounts.data.length} comptes CloudStack récupérés`);
    
    // Test 6: Vérifier que le frontend est accessible
    console.log('\n6️⃣ Test du frontend...');
    const frontendTest = await axios.get('http://localhost:5173');
    console.log('✅ Frontend accessible (code:', frontendTest.status, ')');
    
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n📱 Vous pouvez maintenant :');
    console.log('   1. Ouvrir http://localhost:5173/cloudstack-test');
    console.log('   2. Voir les vraies données CloudStack affichées');
    console.log('   3. Tester les actions sur les instances');
    
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Suggestions :');
      console.log('   - Vérifiez que le backend est démarré : cd backend-nodejs && npm start');
      console.log('   - Vérifiez que le frontend est démarré : npm run dev');
    }
  }
}

testCloudStackDisplay();
