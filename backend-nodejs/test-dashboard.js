const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function testDashboardEndpoints() {
  console.log('🧪 Test des endpoints du dashboard...\n');

  try {
    // Test des endpoints simples
    console.log('1️⃣ Test de /api/simple/domains...');
    const domainsResponse = await axios.get(`${API_BASE_URL}/api/simple/domains`);
    console.log('✅ Domains:', domainsResponse.data);

    console.log('\n2️⃣ Test de /api/simple/roles...');
    const rolesResponse = await axios.get(`${API_BASE_URL}/api/simple/roles`);
    console.log('✅ Roles:', rolesResponse.data);

    console.log('\n3️⃣ Test de /api/simple/accounts...');
    const accountsResponse = await axios.get(`${API_BASE_URL}/api/simple/accounts`);
    console.log('✅ Accounts:', accountsResponse.data);

    console.log('\n4️⃣ Test de /api/simple/zones...');
    const zonesResponse = await axios.get(`${API_BASE_URL}/api/simple/zones`);
    console.log('✅ Zones:', zonesResponse.data);

    console.log('\n5️⃣ Test de /api/global/domains...');
    try {
      const globalDomainsResponse = await axios.get(`${API_BASE_URL}/api/global/domains`);
      console.log('✅ Global Domains:', globalDomainsResponse.data);
    } catch (error) {
      console.log('❌ Global Domains error:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n6️⃣ Test de /api/global/roles...');
    try {
      const globalRolesResponse = await axios.get(`${API_BASE_URL}/api/global/roles`);
      console.log('✅ Global Roles:', globalRolesResponse.data);
    } catch (error) {
      console.log('❌ Global Roles error:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n7️⃣ Test de /api/global/accounts...');
    try {
      const globalAccountsResponse = await axios.get(`${API_BASE_URL}/api/global/accounts`);
      console.log('✅ Global Accounts:', globalAccountsResponse.data);
    } catch (error) {
      console.log('❌ Global Accounts error:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n8️⃣ Test de /api/global/zones...');
    try {
      const globalZonesResponse = await axios.get(`${API_BASE_URL}/api/global/zones`);
      console.log('✅ Global Zones:', globalZonesResponse.data);
    } catch (error) {
      console.log('❌ Global Zones error:', error.response?.status, error.response?.data?.message || error.message);
    }

    console.log('\n🎯 Tests terminés !');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testDashboardEndpoints();
