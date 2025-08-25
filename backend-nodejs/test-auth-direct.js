const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAuthDirect() {
  console.log('🧪 Test direct de l\'authentification JWT...\n');
  
  try {
    // Test de connexion direct
    console.log('1. Test de connexion...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Connexion réussie !');
      console.log('👤 Utilisateur:', loginResponse.data.data.user.username);
      console.log('🔑 Rôle:', loginResponse.data.data.user.role);
      console.log('🎫 Token JWT généré');
      
      const token = loginResponse.data.data.token;
      
      // Test d'accès à une route protégée
      console.log('\n2. Test d\'accès à une route protégée...');
      const protectedResponse = await axios.get(`${BASE_URL}/quotas/my-quotas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Route protégée accessible !');
      console.log('📊 Réponse:', JSON.stringify(protectedResponse.data, null, 2));
      
    } else {
      console.log('❌ Échec de la connexion:', loginResponse.data.message);
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Erreur HTTP:', error.response.status);
      console.log('📝 Message:', error.response.data);
    } else {
      console.log('❌ Erreur de connexion:', error.message);
    }
  }
}

// Exécuter le test
testAuthDirect().catch(console.error);
