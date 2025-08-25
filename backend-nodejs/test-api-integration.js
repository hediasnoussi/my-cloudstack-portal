const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Test des endpoints de quotas
async function testQuotasAPI() {
  console.log('🧪 Test des API de quotas...\n');
  
  try {
    // Test GET /api/quotas/my-quotas
    console.log('1. Test GET /api/quotas/my-quotas');
    const myQuotas = await axios.get(`${BASE_URL}/quotas/my-quotas`);
    console.log('✅ Succès:', myQuotas.data);
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
  
  try {
    // Test GET /api/quotas/all
    console.log('\n2. Test GET /api/quotas/all');
    const allQuotas = await axios.get(`${BASE_URL}/quotas/all`);
    console.log('✅ Succès:', allQuotas.data);
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
}

// Test des endpoints de hiérarchie
async function testHierarchyAPI() {
  console.log('\n🧪 Test des API de hiérarchie...\n');
  
  try {
    // Test GET /api/hierarchy/my-hierarchy
    console.log('1. Test GET /api/hierarchy/my-hierarchy');
    const myHierarchy = await axios.get(`${BASE_URL}/hierarchy/my-hierarchy`);
    console.log('✅ Succès:', myHierarchy.data);
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
  
  try {
    // Test GET /api/hierarchy/stats
    console.log('\n2. Test GET /api/hierarchy/stats');
    const stats = await axios.get(`${BASE_URL}/hierarchy/stats`);
    console.log('✅ Succès:', stats.data);
  } catch (error) {
    console.log('❌ Erreur:', error.response?.data || error.message);
  }
}

// Test principal
async function runTests() {
  console.log('🚀 Démarrage des tests d\'intégration API...\n');
  
  await testQuotasAPI();
  await testHierarchyAPI();
  
  console.log('\n✨ Tests terminés !');
}

// Exécuter les tests
runTests().catch(console.error);
