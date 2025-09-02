const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAPI() {
  try {
    console.log('🧪 Test de l\'API...\n');

    // Test 1: Endpoint de base
    console.log('1. Test endpoint de base...');
    const testResponse = await axios.get(`${BASE_URL}/test`);
    console.log('✅ Test endpoint:', testResponse.data);

    // Test 2: Endpoint global
    console.log('\n2. Test endpoint global...');
    const globalResponse = await axios.get(`${BASE_URL}/api/global/domains`);
    console.log('✅ Global domains:', globalResponse.data);

    // Test 3: Endpoint accounts
    console.log('\n3. Test endpoint accounts...');
    const accountsResponse = await axios.get(`${BASE_URL}/api/global/accounts`);
    console.log('✅ Accounts:', accountsResponse.data);

    // Test 4: Endpoint projects
    console.log('\n4. Test endpoint projects...');
    const projectsResponse = await axios.get(`${BASE_URL}/api/projects`);
    console.log('✅ Projects:', projectsResponse.data);

    // Test 5: Endpoint users
    console.log('\n5. Test endpoint users...');
    const usersResponse = await axios.get(`${BASE_URL}/api/users`);
    console.log('✅ Users:', usersResponse.data);

    // Test 6: Test de connexion utilisateur
    console.log('\n6. Test de connexion utilisateur...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
        username: 'admin',
        password: 'admin123'
      });
      console.log('✅ Login successful:', loginResponse.data);
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Erreur API:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('URL:', error.config?.url);
  }
}

testAPI(); 