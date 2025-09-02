const cloudstackAPI = require('./cloudstack-api');

async function testNetworkIntegration() {
  console.log('🚀 Test d\'intégration CloudStack pour les réseaux, VPC et IP publiques\n');

  try {
    // Test 1: Récupération des VPCs
    console.log('📋 Test 1: Récupération des VPCs');
    console.log('=' .repeat(50));
    const vpcs = await cloudstackAPI.getVPCs();
    console.log(`✅ ${vpcs.length} VPCs trouvés`);
    if (vpcs.length > 0) {
      console.log('Exemple de VPC:', {
        id: vpcs[0].id,
        name: vpcs[0].name,
        displaytext: vpcs[0].displaytext,
        cidr: vpcs[0].cidr,
        state: vpcs[0].state,
        zoneid: vpcs[0].zoneid
      });
    }
    console.log();

    // Test 2: Récupération des réseaux
    console.log('📋 Test 2: Récupération des réseaux');
    console.log('=' .repeat(50));
    const networks = await cloudstackAPI.getNetworksDetailed();
    console.log(`✅ ${networks.length} réseaux trouvés`);
    if (networks.length > 0) {
      console.log('Exemple de réseau:', {
        id: networks[0].id,
        name: networks[0].name,
        displaytext: networks[0].displaytext,
        type: networks[0].type,
        state: networks[0].state,
        zoneid: networks[0].zoneid,
        vpcid: networks[0].vpcid
      });
    }
    console.log();

    // Test 3: Récupération des IP publiques
    console.log('📋 Test 3: Récupération des IP publiques');
    console.log('=' .repeat(50));
    const publicIPs = await cloudstackAPI.getPublicIPs();
    console.log(`✅ ${publicIPs.length} IP publiques trouvées`);
    if (publicIPs.length > 0) {
      console.log('Exemple d\'IP publique:', {
        id: publicIPs[0].id,
        ipaddress: publicIPs[0].ipaddress,
        state: publicIPs[0].state,
        associatednetworkid: publicIPs[0].associatednetworkid,
        vpcid: publicIPs[0].vpcid,
        zoneid: publicIPs[0].zoneid
      });
    }
    console.log();

    // Test 4: Récupération des groupes de sécurité
    console.log('📋 Test 4: Récupération des groupes de sécurité');
    console.log('=' .repeat(50));
    const securityGroups = await cloudstackAPI.getSecurityGroups();
    console.log(`✅ ${securityGroups.length} groupes de sécurité trouvés`);
    if (securityGroups.length > 0) {
      console.log('Exemple de groupe de sécurité:', {
        id: securityGroups[0].id,
        name: securityGroups[0].name,
        description: securityGroups[0].description,
        account: securityGroups[0].account,
        domain: securityGroups[0].domain
      });
    }
    console.log();

    // Test 5: Récupération des zones (nécessaire pour créer des ressources)
    console.log('📋 Test 5: Récupération des zones');
    console.log('=' .repeat(50));
    const zones = await cloudstackAPI.getZones();
    console.log(`✅ ${zones.length} zones trouvées`);
    if (zones.length > 0) {
      console.log('Exemple de zone:', {
        id: zones[0].id,
        name: zones[0].name,
        displaytext: zones[0].displaytext,
        state: zones[0].state
      });
    }
    console.log();

    // Test 6: Récupération des VPC offerings (nécessaire pour créer des VPCs)
    console.log('📋 Test 6: Récupération des VPC offerings');
    console.log('=' .repeat(50));
    try {
      const vpcOfferings = await cloudstackAPI.makeRequest('listVPCOfferings');
      const offerings = vpcOfferings.listvpcofferingsresponse?.vpcoffering || [];
      console.log(`✅ ${offerings.length} VPC offerings trouvés`);
      if (offerings.length > 0) {
        console.log('Exemple de VPC offering:', {
          id: offerings[0].id,
          name: offerings[0].name,
          displaytext: offerings[0].displaytext,
          state: offerings[0].state
        });
      }
    } catch (error) {
      console.log('⚠️ Aucun VPC offering trouvé ou erreur:', error.message);
    }
    console.log();

    // Test 7: Récupération des network offerings (nécessaire pour créer des réseaux)
    console.log('📋 Test 7: Récupération des network offerings');
    console.log('=' .repeat(50));
    try {
      const networkOfferings = await cloudstackAPI.makeRequest('listNetworkOfferings');
      const offerings = networkOfferings.listnetworkofferingsresponse?.networkoffering || [];
      console.log(`✅ ${offerings.length} network offerings trouvés`);
      if (offerings.length > 0) {
        console.log('Exemple de network offering:', {
          id: offerings[0].id,
          name: offerings[0].name,
          displaytext: offerings[0].displaytext,
          state: offerings[0].state,
          guestiptype: offerings[0].guestiptype
        });
      }
    } catch (error) {
      console.log('⚠️ Aucun network offering trouvé ou erreur:', error.message);
    }
    console.log();

    // Test 8: Test de création d'un groupe de sécurité (si autorisé)
    console.log('📋 Test 8: Test de création d\'un groupe de sécurité');
    console.log('=' .repeat(50));
    const testSecurityGroupName = `test-sg-${Date.now()}`;
    try {
      const result = await cloudstackAPI.makeRequest('createSecurityGroup', {
        name: testSecurityGroupName,
        description: 'Groupe de sécurité de test pour l\'intégration'
      });
      console.log('✅ Groupe de sécurité créé avec succès');
      console.log('Détails:', result.createsecuritygroupresponse);
      
      // Supprimer le groupe de sécurité de test
      console.log('🗑️ Suppression du groupe de sécurité de test...');
      await cloudstackAPI.makeRequest('deleteSecurityGroup', { 
        id: result.createsecuritygroupresponse.securitygroup.id 
      });
      console.log('✅ Groupe de sécurité de test supprimé');
    } catch (error) {
      console.log('⚠️ Impossible de créer un groupe de sécurité de test:', error.message);
    }
    console.log();

    // Test 9: Test d'association d'une IP publique (si autorisé)
    console.log('📋 Test 9: Test d\'association d\'une IP publique');
    console.log('=' .repeat(50));
    if (zones.length > 0) {
      try {
        const result = await cloudstackAPI.associatePublicIP({
          zoneid: zones[0].id
        });
        console.log('✅ IP publique associée avec succès');
        console.log('Détails:', result);
        
        // Libérer l'IP publique de test
        console.log('🗑️ Libération de l\'IP publique de test...');
        await cloudstackAPI.releasePublicIP(result.ipaddress.id);
        console.log('✅ IP publique de test libérée');
      } catch (error) {
        console.log('⚠️ Impossible d\'associer une IP publique de test:', error.message);
      }
    } else {
      console.log('⚠️ Aucune zone disponible pour tester l\'association d\'IP publique');
    }
    console.log();

    // Résumé des tests
    console.log('📊 Résumé des tests');
    console.log('=' .repeat(50));
    console.log(`✅ VPCs: ${vpcs.length} trouvés`);
    console.log(`✅ Réseaux: ${networks.length} trouvés`);
    console.log(`✅ IP publiques: ${publicIPs.length} trouvées`);
    console.log(`✅ Groupes de sécurité: ${securityGroups.length} trouvés`);
    console.log(`✅ Zones: ${zones.length} trouvées`);
    console.log('\n🎉 Tous les tests d\'intégration CloudStack pour les réseaux sont terminés !');

  } catch (error) {
    console.error('❌ Erreur lors des tests d\'intégration:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Fonction pour tester les endpoints API
async function testAPIEndpoints() {
  console.log('\n🌐 Test des endpoints API réseau\n');
  
  const baseUrl = 'http://localhost:3000/api';
  
  try {
    // Test des endpoints VPC
    console.log('📋 Test des endpoints VPC');
    console.log('=' .repeat(50));
    
    const vpcsResponse = await fetch(`${baseUrl}/network/vpcs`);
    const vpcsData = await vpcsResponse.json();
    console.log(`GET /network/vpcs: ${vpcsResponse.status} - ${vpcsData.success ? '✅' : '❌'}`);
    if (vpcsData.success) {
      console.log(`   ${vpcsData.count} VPCs récupérés`);
    }
    
    // Test des endpoints réseaux
    console.log('\n📋 Test des endpoints réseaux');
    console.log('=' .repeat(50));
    
    const networksResponse = await fetch(`${baseUrl}/network/guest-networks`);
    const networksData = await networksResponse.json();
    console.log(`GET /network/guest-networks: ${networksResponse.status} - ${networksData.success ? '✅' : '❌'}`);
    if (networksData.success) {
      console.log(`   ${networksData.count} réseaux récupérés`);
    }
    
    // Test des endpoints IP publiques
    console.log('\n📋 Test des endpoints IP publiques');
    console.log('=' .repeat(50));
    
    const publicIPsResponse = await fetch(`${baseUrl}/network/public-ip-addresses`);
    const publicIPsData = await publicIPsResponse.json();
    console.log(`GET /network/public-ip-addresses: ${publicIPsResponse.status} - ${publicIPsData.success ? '✅' : '❌'}`);
    if (publicIPsData.success) {
      console.log(`   ${publicIPsData.count} IP publiques récupérées`);
    }
    
    // Test des endpoints groupes de sécurité
    console.log('\n📋 Test des endpoints groupes de sécurité');
    console.log('=' .repeat(50));
    
    const securityGroupsResponse = await fetch(`${baseUrl}/network/security-groups`);
    const securityGroupsData = await securityGroupsResponse.json();
    console.log(`GET /network/security-groups: ${securityGroupsResponse.status} - ${securityGroupsData.success ? '✅' : '❌'}`);
    if (securityGroupsData.success) {
      console.log(`   ${securityGroupsData.count} groupes de sécurité récupérés`);
    }
    
    console.log('\n🎉 Tous les tests des endpoints API sont terminés !');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests des endpoints API:', error);
  }
}

// Exécuter les tests
async function runAllTests() {
  await testNetworkIntegration();
  await testAPIEndpoints();
}

// Vérifier si le script est exécuté directement
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testNetworkIntegration,
  testAPIEndpoints,
  runAllTests
};
