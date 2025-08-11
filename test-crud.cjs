const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Test des opérations CRUD pour les domaines
async function testDomainCRUD() {
  console.log('🧪 Test des opérations CRUD pour les domaines...\n');

  try {
    // Test 1: Récupérer tous les domaines
    console.log('1. Test GET /api/global/domains');
    const getResponse = await axios.get(`${API_BASE_URL}/api/global/domains`);
    console.log('✅ GET domains:', getResponse.data);
    console.log('');

    // Test 2: Créer un nouveau domaine
    console.log('2. Test POST /api/global/domains');
    const createResponse = await axios.post(`${API_BASE_URL}/api/global/domains`, {
      name: 'test-domain-' + Date.now()
    });
    console.log('✅ CREATE domain:', createResponse.data);
    const newDomainId = createResponse.data.id;
    console.log('');

    // Test 3: Récupérer le domaine créé
    console.log('3. Test GET /api/global/domains/' + newDomainId);
    const getByIdResponse = await axios.get(`${API_BASE_URL}/api/global/domains/${newDomainId}`);
    console.log('✅ GET domain by ID:', getByIdResponse.data);
    console.log('');

    // Test 4: Modifier le domaine
    console.log('4. Test PUT /api/global/domains/' + newDomainId);
    const updateResponse = await axios.put(`${API_BASE_URL}/api/global/domains/${newDomainId}`, {
      name: 'updated-test-domain-' + Date.now()
    });
    console.log('✅ UPDATE domain:', updateResponse.data);
    console.log('');

    // Test 5: Supprimer le domaine
    console.log('5. Test DELETE /api/global/domains/' + newDomainId);
    const deleteResponse = await axios.delete(`${API_BASE_URL}/api/global/domains/${newDomainId}`);
    console.log('✅ DELETE domain:', deleteResponse.data);
    console.log('');

    console.log('🎉 Tous les tests CRUD pour les domaines ont réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test CRUD:', error.response?.data || error.message);
  }
}

// Test des opérations CRUD pour les rôles
async function testRoleCRUD() {
  console.log('\n🧪 Test des opérations CRUD pour les rôles...\n');

  try {
    // Test 1: Récupérer tous les rôles
    console.log('1. Test GET /api/global/roles');
    const getResponse = await axios.get(`${API_BASE_URL}/api/global/roles`);
    console.log('✅ GET roles:', getResponse.data);
    console.log('');

    // Test 2: Créer un nouveau rôle
    console.log('2. Test POST /api/global/roles');
    const createResponse = await axios.post(`${API_BASE_URL}/api/global/roles`, {
      name: 'test-role-' + Date.now(),
      type: 'User',
      description: 'Test role',
      state: 'enabled'
    });
    console.log('✅ CREATE role:', createResponse.data);
    const newRoleId = createResponse.data.id;
    console.log('');

    // Test 3: Modifier le rôle
    console.log('3. Test PUT /api/global/roles/' + newRoleId);
    const updateResponse = await axios.put(`${API_BASE_URL}/api/global/roles/${newRoleId}`, {
      name: 'updated-test-role-' + Date.now(),
      description: 'Updated test role'
    });
    console.log('✅ UPDATE role:', updateResponse.data);
    console.log('');

    // Test 4: Supprimer le rôle
    console.log('4. Test DELETE /api/global/roles/' + newRoleId);
    const deleteResponse = await axios.delete(`${API_BASE_URL}/api/global/roles/${newRoleId}`);
    console.log('✅ DELETE role:', deleteResponse.data);
    console.log('');

    console.log('🎉 Tous les tests CRUD pour les rôles ont réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test CRUD des rôles:', error.response?.data || error.message);
  }
}

// Test des opérations CRUD pour les comptes
async function testAccountCRUD() {
  console.log('\n🧪 Test des opérations CRUD pour les comptes...\n');

  try {
    // Test 1: Récupérer tous les comptes
    console.log('1. Test GET /api/global/accounts');
    const getResponse = await axios.get(`${API_BASE_URL}/api/global/accounts`);
    console.log('✅ GET accounts:', getResponse.data);
    console.log('');

    // Test 2: Créer un nouveau compte
    console.log('2. Test POST /api/global/accounts');
    const createResponse = await axios.post(`${API_BASE_URL}/api/global/accounts`, {
      name: 'test-account-' + Date.now(),
      state: 'enabled'
    });
    console.log('✅ CREATE account:', createResponse.data);
    const newAccountId = createResponse.data.id;
    console.log('');

    // Test 3: Modifier le compte
    console.log('3. Test PUT /api/global/accounts/' + newAccountId);
    const updateResponse = await axios.put(`${API_BASE_URL}/api/global/accounts/${newAccountId}`, {
      name: 'updated-test-account-' + Date.now()
    });
    console.log('✅ UPDATE account:', updateResponse.data);
    console.log('');

    // Test 4: Supprimer le compte
    console.log('4. Test DELETE /api/global/accounts/' + newAccountId);
    const deleteResponse = await axios.delete(`${API_BASE_URL}/api/global/accounts/${newAccountId}`);
    console.log('✅ DELETE account:', deleteResponse.data);
    console.log('');

    console.log('🎉 Tous les tests CRUD pour les comptes ont réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test CRUD des comptes:', error.response?.data || error.message);
  }
}

// Test des opérations CRUD pour les zones
async function testZoneCRUD() {
  console.log('\n🧪 Test des opérations CRUD pour les zones...\n');

  try {
    // Test 1: Récupérer toutes les zones
    console.log('1. Test GET /api/global/zones');
    const getResponse = await axios.get(`${API_BASE_URL}/api/global/zones`);
    console.log('✅ GET zones:', getResponse.data);
    console.log('');

    // Test 2: Créer une nouvelle zone
    console.log('2. Test POST /api/global/zones');
    const createResponse = await axios.post(`${API_BASE_URL}/api/global/zones`, {
      name: 'test-zone-' + Date.now()
    });
    console.log('✅ CREATE zone:', createResponse.data);
    const newZoneId = createResponse.data.id;
    console.log('');

    // Test 3: Modifier la zone
    console.log('3. Test PUT /api/global/zones/' + newZoneId);
    const updateResponse = await axios.put(`${API_BASE_URL}/api/global/zones/${newZoneId}`, {
      name: 'updated-test-zone-' + Date.now()
    });
    console.log('✅ UPDATE zone:', updateResponse.data);
    console.log('');

    // Test 4: Supprimer la zone
    console.log('4. Test DELETE /api/global/zones/' + newZoneId);
    const deleteResponse = await axios.delete(`${API_BASE_URL}/api/global/zones/${newZoneId}`);
    console.log('✅ DELETE zone:', deleteResponse.data);
    console.log('');

    console.log('🎉 Tous les tests CRUD pour les zones ont réussi !');

  } catch (error) {
    console.error('❌ Erreur lors du test CRUD des zones:', error.response?.data || error.message);
  }
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests CRUD...\n');
  
  await testDomainCRUD();
  await testRoleCRUD();
  await testAccountCRUD();
  await testZoneCRUD();
  
  console.log('\n✨ Tous les tests sont terminés !');
}

runAllTests().catch(console.error); 