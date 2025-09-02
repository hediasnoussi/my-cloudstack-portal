const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAuthentication() {
  console.log('🧪 Test de l\'authentification JWT...\n');
  
  try {
    // Test 1: Connexion avec un utilisateur valide
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
      
      // Test 2: Accès à une route protégée avec le token
      console.log('\n2. Test d\'accès à une route protégée...');
      const protectedResponse = await axios.get(`${BASE_URL}/quotas/my-quotas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (protectedResponse.data.success !== undefined) {
        console.log('✅ Route protégée accessible !');
        console.log('📊 Données reçues:', protectedResponse.data);
      } else {
        console.log('⚠️ Route accessible mais format de réponse inattendu');
      }
      
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
testAuthentication().catch(console.error);
