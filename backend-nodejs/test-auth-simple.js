const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function waitForServer() {
  console.log('⏳ Attente du serveur backend...');
  
  for (let i = 0; i < 10; i++) {
    try {
      await axios.get(`${BASE_URL.replace('/api', '')}/health`);
      console.log('✅ Serveur backend prêt !');
      return true;
    } catch (error) {
      console.log(`⏳ Tentative ${i + 1}/10...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('❌ Serveur backend non accessible après 10 tentatives');
  return false;
}

async function testAuth() {
  console.log('🧪 Test de l\'authentification JWT...\n');
  
  // Attendre que le serveur soit prêt
  if (!(await waitForServer())) {
    return;
  }
  
  try {
    // Test de connexion
    console.log('1. Test de connexion...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Connexion réussie !');
      console.log('👤 Utilisateur:', loginResponse.data.data.user.username);
      console.log('🔑 Rôle:', loginResponse.data.data.user.role);
      
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
testAuth().catch(console.error);
