const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testAuthRobust() {
  console.log('🧪 Test robuste de l\'authentification JWT...\n');
  
  try {
    // Test 1: Vérifier que le serveur répond
    console.log('1. Test de connectivité du serveur...');
    try {
      const healthCheck = await axios.get('http://localhost:3001', { timeout: 5000 });
      console.log('✅ Serveur accessible sur le port 3001');
    } catch (error) {
      console.log('❌ Serveur non accessible sur le port 3001');
      console.log('   Erreur:', error.message);
      return;
    }
    
    // Test 2: Test de connexion
    console.log('\n2. Test de connexion...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      username: 'admin',
      password: 'admin123'
    }, { timeout: 10000 });
    
    console.log('📡 Réponse reçue du serveur');
    console.log('📊 Status:', loginResponse.status);
    console.log('📝 Données:', JSON.stringify(loginResponse.data, null, 2));
    
    if (loginResponse.data.success) {
      console.log('✅ Connexion réussie !');
      console.log('👤 Utilisateur:', loginResponse.data.data.user.username);
      console.log('🔑 Rôle:', loginResponse.data.data.user.role);
      console.log('🎫 Token JWT généré');
      
      const token = loginResponse.data.data.token;
      
      // Test 3: Accès à une route protégée
      console.log('\n3. Test d\'accès à une route protégée...');
      const protectedResponse = await axios.get(`${BASE_URL}/quotas/my-quotas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      });
      
      console.log('✅ Route protégée accessible !');
      console.log('📊 Réponse:', JSON.stringify(protectedResponse.data, null, 2));
      
    } else {
      console.log('❌ Échec de la connexion:', loginResponse.data.message);
    }
    
  } catch (error) {
    console.log('\n❌ Erreur détaillée:');
    
    if (error.response) {
      // Erreur de réponse du serveur
      console.log('📡 Erreur HTTP:', error.response.status);
      console.log('📝 Message:', error.response.data);
      console.log('🔗 URL:', error.config.url);
      console.log('📋 Headers:', error.config.headers);
    } else if (error.request) {
      // Erreur de requête (pas de réponse)
      console.log('📡 Pas de réponse du serveur');
      console.log('🔗 URL tentée:', error.config.url);
      console.log('⏱️ Timeout:', error.config.timeout);
    } else {
      // Autre erreur
      console.log('❌ Erreur:', error.message);
    }
    
    console.log('\n🔍 Stack trace:', error.stack);
  }
}

// Exécuter le test
testAuthRobust().catch(console.error);
