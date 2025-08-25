const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testRealUsers() {
  console.log('🧪 Test avec les vrais utilisateurs de la base...\n');
  
  const testUsers = [
    { username: 'admin', password: 'admin123' },
    { username: 'admin', password: 'password' },
    { username: 'admin', password: 'admin' },
    { username: 'subprovider1', password: 'password' },
    { username: 'partner1', password: 'password' },
    { username: 'client1', password: 'password' }
  ];
  
  for (const user of testUsers) {
    try {
      console.log(`🔐 Test de connexion: ${user.username} / ${user.password}`);
      
      const response = await axios.post(`${BASE_URL}/login`, user, { timeout: 5000 });
      
      if (response.data.success) {
        console.log('✅ CONNEXION RÉUSSIE !');
        console.log('👤 Utilisateur:', response.data.data.user.username);
        console.log('🔑 Rôle:', response.data.data.user.role);
        console.log('🎫 Token JWT généré');
        
        // Test d'accès à une route protégée
        const token = response.data.data.token;
        console.log('\n🔒 Test d\'accès à une route protégée...');
        
        try {
          const protectedResponse = await axios.get(`${BASE_URL}/quotas/my-quotas`, {
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 5000
          });
          
          console.log('✅ Route protégée accessible !');
          console.log('📊 Données:', JSON.stringify(protectedResponse.data, null, 2));
          
        } catch (protectedError) {
          console.log('❌ Erreur route protégée:', protectedError.response?.data || protectedError.message);
        }
        
        break; // Arrêter après la première connexion réussie
        
      } else {
        console.log('❌ Échec:', response.data.message);
      }
      
    } catch (error) {
      if (error.response) {
        console.log('❌ Erreur HTTP:', error.response.status, '-', error.response.data.message);
      } else {
        console.log('❌ Erreur:', error.message);
      }
    }
    
    console.log('---');
  }
}

testRealUsers().catch(console.error);
