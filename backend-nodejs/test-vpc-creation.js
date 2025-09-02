const cloudstackAPI = require('./cloudstack-api');

async function testVPCCreation() {
  console.log('🧪 Test de création de VPC avec les bons paramètres CloudStack\n');

  try {
    // 1. Récupérer les VPC offerings disponibles
    console.log('📋 1. Récupération des VPC offerings');
    console.log('=' .repeat(50));
    const vpcOfferings = await cloudstackAPI.makeRequest('listVPCOfferings');
    const offerings = vpcOfferings.listvpcofferingsresponse?.vpcoffering || [];
    console.log(`✅ ${offerings.length} VPC offerings disponibles`);
    
    if (offerings.length === 0) {
      console.log('❌ Aucun VPC offering disponible - Impossible de créer un VPC');
      return;
    }
    
    // Afficher les offerings
    offerings.forEach((offering, index) => {
      console.log(`   ${index + 1}. ID: ${offering.id}, Name: ${offering.name}, State: ${offering.state}`);
    });
    console.log();

    // 2. Récupérer les zones disponibles
    console.log('📋 2. Récupération des zones');
    console.log('=' .repeat(50));
    const zones = await cloudstackAPI.getZones();
    console.log(`✅ ${zones.length} zones disponibles`);
    
    if (zones.length === 0) {
      console.log('❌ Aucune zone disponible - Impossible de créer un VPC');
      return;
    }
    
    // Afficher les zones
    zones.forEach((zone, index) => {
      console.log(`   ${index + 1}. ID: ${zone.id}, Name: ${zone.name}, State: ${zone.state}`);
    });
    console.log();

    // 3. Tester la création d'un VPC avec le premier offering et la première zone
    console.log('📋 3. Test de création de VPC');
    console.log('=' .repeat(50));
    
    const selectedOffering = offerings[0];
    const selectedZone = zones[0];
    
    console.log('🔧 Paramètres sélectionnés:');
    console.log(`   VPC Offering: ${selectedOffering.name} (${selectedOffering.id})`);
    console.log(`   Zone: ${selectedZone.name} (${selectedZone.id})`);
    console.log();

    const testVPCData = {
      name: `test-vpc-${Date.now()}`,
      displaytext: 'VPC de test pour validation',
      cidr: '10.0.0.0/16',
      vpcofferingid: selectedOffering.id,
      zoneid: selectedZone.id
    };
    
    console.log('📋 Données de création:');
    console.log(JSON.stringify(testVPCData, null, 2));
    console.log();

    console.log('🚀 Création du VPC...');
    const createResult = await cloudstackAPI.createVPC(testVPCData);
    console.log('✅ VPC créé avec succès !');
    console.log('📊 Résultat:', JSON.stringify(createResult, null, 2));
    console.log();

    // 4. Vérifier que le VPC apparaît dans la liste
    console.log('📋 4. Vérification de la création');
    console.log('=' .repeat(50));
    
    // Attendre un peu pour que CloudStack traite la création
    console.log('⏳ Attente de 5 secondes pour le traitement...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const vpcs = await cloudstackAPI.getVPCs();
    console.log(`✅ ${vpcs.length} VPCs trouvés après création`);
    
    const createdVPC = vpcs.find(vpc => vpc.name === testVPCData.name);
    if (createdVPC) {
      console.log('✅ VPC trouvé dans la liste:');
      console.log(`   ID: ${createdVPC.id}`);
      console.log(`   Name: ${createdVPC.name}`);
      console.log(`   State: ${createdVPC.state}`);
      console.log(`   CIDR: ${createdVPC.cidr}`);
      console.log(`   Zone: ${createdVPC.zoneid}`);
    } else {
      console.log('⚠️ VPC non trouvé dans la liste (peut prendre plus de temps)');
    }
    console.log();

    // 5. Nettoyer - Supprimer le VPC de test
    console.log('📋 5. Nettoyage - Suppression du VPC de test');
    console.log('=' .repeat(50));
    
    if (createdVPC) {
      console.log('🗑️ Suppression du VPC de test...');
      await cloudstackAPI.deleteVPC(createdVPC.id);
      console.log('✅ VPC de test supprimé');
    } else {
      console.log('⚠️ Impossible de supprimer - VPC non trouvé');
    }
    console.log();

    // 6. Résumé et recommandations
    console.log('📋 6. Résumé et recommandations');
    console.log('=' .repeat(50));
    
    console.log('🎉 TEST RÉUSSI !');
    console.log('✅ La création de VPC fonctionne correctement');
    console.log('✅ Les paramètres utilisés sont valides');
    console.log('');
    console.log('💡 RECOMMANDATIONS POUR VOTRE PORTAL:');
    console.log('   1. Utilisez ces VPC offerings dans votre interface:');
    offerings.forEach((offering, index) => {
      console.log(`      - ${offering.name} (ID: ${offering.id})`);
    });
    console.log('');
    console.log('   2. Utilisez ces zones dans votre interface:');
    zones.forEach((zone, index) => {
      console.log(`      - ${zone.name} (ID: ${zone.id})`);
    });
    console.log('');
    console.log('   3. Assurez-vous que votre portail utilise les bons paramètres:');
    console.log(`      - vpcofferingid: ${selectedOffering.id}`);
    console.log(`      - zoneid: ${selectedZone.id}`);
    console.log(`      - cidr: 10.0.0.0/16 (ou autre plage valide)`);
    console.log('');
    console.log('   4. Vérifiez les permissions de l\'utilisateur CloudStack');
    console.log('   5. Synchronisez les VPCs existants du portail vers CloudStack');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    
    if (error.message.includes('431')) {
      console.log('\n🔍 ANALYSE DE L\'ERREUR 431:');
      console.log('   Erreur 431 = Paramètres invalides');
      console.log('   Vérifiez que:');
      console.log('   - Le VPC offering ID est valide');
      console.log('   - La zone ID est valide');
      console.log('   - Le CIDR est dans un format valide');
      console.log('   - L\'utilisateur a les permissions nécessaires');
    } else if (error.message.includes('401')) {
      console.log('\n🔍 ANALYSE DE L\'ERREUR 401:');
      console.log('   Erreur 401 = Non autorisé');
      console.log('   Vérifiez les clés API CloudStack');
    } else if (error.message.includes('533')) {
      console.log('\n🔍 ANALYSE DE L\'ERREUR 533:');
      console.log('   Erreur 533 = Ressource non disponible');
      console.log('   Vérifiez que les ressources sont activées');
    }
  }
}

// Fonction pour créer un VPC avec des paramètres spécifiques
async function createVPCSpecific(name, cidr, vpcofferingid, zoneid) {
  console.log(`🚀 Création du VPC "${name}" avec des paramètres spécifiques\n`);
  
  try {
    const vpcData = {
      name: name,
      displaytext: `VPC ${name}`,
      cidr: cidr,
      vpcofferingid: vpcofferingid,
      zoneid: zoneid
    };
    
    console.log('📋 Paramètres:');
    console.log(JSON.stringify(vpcData, null, 2));
    console.log();
    
    const result = await cloudstackAPI.createVPC(vpcData);
    console.log('✅ VPC créé avec succès !');
    console.log('📊 Résultat:', JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    throw error;
  }
}

// Exécuter le test
async function runTest() {
  await testVPCCreation();
}

// Vérifier si le script est exécuté directement
if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = {
  testVPCCreation,
  createVPCSpecific,
  runTest
};
