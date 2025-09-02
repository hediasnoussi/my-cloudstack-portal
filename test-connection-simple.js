import axios from 'axios';

async function testConnection() {
  console.log('🔍 Test de connexion à l\'API backend...');
  
  try {
    // Test de connexion de base
    const response = await axios.get('http://localhost:3001/test');
    console.log('✅ Connexion API backend réussie:', response.data);
    
    // Test des endpoints principaux
    const endpoints = [
      '/api/global/domains',
      '/api/global/roles', 
      '/api/global/accounts',
      '/api/global/zones',
      '/api/users',
      '/api/projects'
    ];
    
    console.log('\n📊 Test des endpoints...');
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`http://localhost:3001${endpoint}`);
        const count = response.data.data?.length || 0;
        console.log(`✅ ${endpoint}: ${count} élément(s)`);
        
        if (count > 0) {
          const sample = response.data.data.slice(0, 2);
          console.log(`   Exemples:`, sample.map(item => ({
            id: item.id,
            name: item.name || item.username || `ID: ${item.id}`
          })));
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.response?.status || error.message}`);
      }
    }
    
    console.log('\n🎉 Test API terminé avec succès!');
    console.log('\n📱 Vous pouvez maintenant ouvrir votre navigateur et aller à:');
    console.log('   http://localhost:5173');
    console.log('\n🔧 Pour tester l\'interface complète avec vos données!');
    
  } catch (error) {
    console.error('❌ Erreur de connexion API:', error.message);
    console.log('\n💡 Assurez-vous que le backend est démarré sur le port 3001');
    console.log('   cd backend-nodejs && npm start');
  }
}

testConnection();
