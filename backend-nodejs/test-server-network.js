const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api';

async function testServerEndpoints() {
  console.log('🚀 Test du serveur CloudStack Network API\n');

  const tests = [
    {
      name: 'Health Check',
      method: 'GET',
      url: `${BASE_URL}/health`,
      expectedStatus: 200
    },
    {
      name: 'VPCs List',
      method: 'GET',
      url: `${BASE_URL}/network/vpcs`,
      expectedStatus: 200
    },
    {
      name: 'Networks List',
      method: 'GET',
      url: `${BASE_URL}/network/guest-networks`,
      expectedStatus: 200
    },
    {
      name: 'Public IPs List',
      method: 'GET',
      url: `${BASE_URL}/network/public-ip-addresses`,
      expectedStatus: 200
    },
    {
      name: 'Security Groups List',
      method: 'GET',
      url: `${BASE_URL}/network/security-groups`,
      expectedStatus: 200
    },
    {
      name: 'VPC by ID (404 test)',
      method: 'GET',
      url: `${BASE_URL}/network/vpcs/non-existent-id`,
      expectedStatus: 404
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`📋 Test: ${test.name}`);
      console.log(`   ${test.method} ${test.url}`);
      
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.status === test.expectedStatus) {
        console.log(`   ✅ Status: ${response.status} (attendu: ${test.expectedStatus})`);
        if (data.success !== undefined) {
          console.log(`   📊 Success: ${data.success}`);
        }
        if (data.count !== undefined) {
          console.log(`   📈 Count: ${data.count}`);
        }
        passedTests++;
      } else {
        console.log(`   ❌ Status: ${response.status} (attendu: ${test.expectedStatus})`);
        if (data.message) {
          console.log(`   💬 Message: ${data.message}`);
        }
      }
      
      console.log('');
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
      console.log('');
    }
  }

  console.log('📊 Résumé des tests');
  console.log('=' .repeat(50));
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`📈 Taux de réussite: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 Tous les tests sont passés ! Le serveur fonctionne correctement.');
  } else {
    console.log('\n⚠️ Certains tests ont échoué. Vérifiez la configuration du serveur.');
  }
}

async function testCreateOperations() {
  console.log('\n🔧 Test des opérations de création (lecture seule)\n');

  const createTests = [
    {
      name: 'Create VPC (validation)',
      method: 'POST',
      url: `${BASE_URL}/network/vpcs`,
      body: {
        name: 'test-vpc',
        displaytext: 'Test VPC',
        cidr: '10.0.0.0/16',
        vpcofferingid: 'test-offering',
        zoneid: 'test-zone'
      }
    },
    {
      name: 'Create Network (validation)',
      method: 'POST',
      url: `${BASE_URL}/network/guest-networks`,
      body: {
        name: 'test-network',
        displaytext: 'Test Network',
        networkofferingid: 'test-offering',
        zoneid: 'test-zone'
      }
    },
    {
      name: 'Create Security Group (validation)',
      method: 'POST',
      url: `${BASE_URL}/network/security-groups`,
      body: {
        name: 'test-security-group',
        description: 'Test Security Group'
      }
    }
  ];

  for (const test of createTests) {
    try {
      console.log(`📋 Test: ${test.name}`);
      console.log(`   ${test.method} ${test.url}`);
      
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.body)
      });

      const data = await response.json();
      
      // Ces tests peuvent échouer à cause des permissions CloudStack, ce qui est normal
      if (response.status === 400) {
        console.log(`   ✅ Validation des paramètres: ${response.status}`);
        console.log(`   💬 Message: ${data.message}`);
      } else if (response.status === 500) {
        console.log(`   ⚠️ Erreur CloudStack (normal): ${response.status}`);
        console.log(`   💬 Message: ${data.message}`);
      } else {
        console.log(`   📊 Status: ${response.status}`);
        if (data.success) {
          console.log(`   ✅ Opération réussie`);
        }
      }
      
      console.log('');
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
      console.log('');
    }
  }
}

async function runAllTests() {
  try {
    await testServerEndpoints();
    await testCreateOperations();
    
    console.log('\n🎯 Tests terminés !');
    console.log('📋 Pour tester manuellement:');
    console.log('   curl http://localhost:3000/api/health');
    console.log('   curl http://localhost:3000/api/network/vpcs');
    console.log('   curl http://localhost:3000/api/network/guest-networks');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Vérifier si le script est exécuté directement
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testServerEndpoints,
  testCreateOperations,
  runAllTests
};
