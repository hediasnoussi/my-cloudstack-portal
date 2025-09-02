const cloudstackAPI = require('./cloudstack-api');

async function diagnosticVPCConfiguration() {
  console.log('🔍 Diagnostic de la configuration CloudStack pour les VPCs\n');

  try {
    // 1. Vérifier les zones et leurs réseaux physiques
    console.log('📋 1. Vérification des zones et réseaux physiques');
    console.log('=' .repeat(60));
    
    const zones = await cloudstackAPI.getZones();
    console.log(`✅ ${zones.length} zones trouvées`);
    
    for (const zone of zones) {
      console.log(`\n🔍 Zone: ${zone.name} (${zone.id})`);
      
      try {
        // Récupérer les réseaux physiques de cette zone
        const physicalNetworks = await cloudstackAPI.makeRequest('listPhysicalNetworks', {
          zoneid: zone.id
        });
        
        const networks = physicalNetworks.listphysicalnetworksresponse?.physicalnetwork || [];
        console.log(`   📊 ${networks.length} réseaux physiques trouvés`);
        
        if (networks.length === 0) {
          console.log('   ❌ Aucun réseau physique configuré');
          continue;
        }
        
        for (const network of networks) {
          console.log(`   🔧 Réseau physique: ${network.name} (${network.id})`);
          console.log(`      State: ${network.state}`);
          console.log(`      Broadcast Domain Range: ${network.broadcastdomainrange}`);
          
          // Vérifier les providers de ce réseau
          if (network.providers) {
            console.log(`      Providers: ${network.providers}`);
          }
          
          // Vérifier les services de ce réseau
          if (network.services) {
            console.log(`      Services: ${network.services}`);
          }
        }
        
        // Vérifier les providers spécifiquement
        console.log('\n   🔍 Vérification des providers...');
        const providers = await cloudstackAPI.makeRequest('listNetworkServiceProviders', {
          zoneid: zone.id
        });
        
        const serviceProviders = providers.listnetworkserviceprovidersresponse?.networkserviceprovider || [];
        console.log(`   📊 ${serviceProviders.length} providers de services trouvés`);
        
        for (const provider of serviceProviders) {
          console.log(`   🔧 Provider: ${provider.name} (${provider.id})`);
          console.log(`      Service: ${provider.service}`);
          console.log(`      State: ${provider.state}`);
          
          // Vérifier les capacités du provider
          if (provider.capabilities) {
            console.log(`      Capacités: ${provider.capabilities}`);
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur lors de la vérification de la zone: ${error.message}`);
      }
    }
    console.log();

    // 2. Vérifier les VPC offerings et leurs capacités
    console.log('📋 2. Vérification des VPC offerings');
    console.log('=' .repeat(60));
    
    const vpcOfferings = await cloudstackAPI.makeRequest('listVPCOfferings');
    const offerings = vpcOfferings.listvpcofferingsresponse?.vpcoffering || [];
    console.log(`✅ ${offerings.length} VPC offerings disponibles`);
    
    for (const offering of offerings) {
      console.log(`\n🔧 VPC Offering: ${offering.name} (${offering.id})`);
      console.log(`   State: ${offering.state}`);
      console.log(`   Display Text: ${offering.displaytext}`);
      
      // Vérifier les services inclus
      if (offering.services) {
        console.log(`   Services: ${offering.services}`);
      }
      
      // Vérifier les capacités
      if (offering.capabilities) {
        console.log(`   Capacités: ${offering.capabilities}`);
      }
    }
    console.log();

    // 3. Vérifier les configurations système
    console.log('📋 3. Vérification des configurations système');
    console.log('=' .repeat(60));
    
    try {
      // Vérifier les configurations globales
      const globalConfigs = await cloudstackAPI.makeRequest('listConfigurations', {
        name: 'vpc'
      });
      
      const configs = globalConfigs.listconfigurationsresponse?.configuration || [];
      console.log(`✅ ${configs.length} configurations VPC trouvées`);
      
      for (const config of configs) {
        console.log(`   ${config.name}: ${config.value}`);
      }
    } catch (error) {
      console.log(`❌ Erreur lors de la vérification des configurations: ${error.message}`);
    }
    console.log();

    // 4. Vérifier les capacités de la zone
    console.log('📋 4. Vérification des capacités de la zone');
    console.log('=' .repeat(60));
    
    for (const zone of zones) {
      console.log(`\n🔍 Capacités de la zone: ${zone.name}`);
      
      try {
        // Vérifier les capacités de la zone
        const capabilities = await cloudstackAPI.makeRequest('listCapabilities', {
          zoneid: zone.id
        });
        
        const zoneCapabilities = capabilities.listcapabilitiesresponse?.capability || [];
        console.log(`   📊 ${zoneCapabilities.length} capacités trouvées`);
        
        for (const capability of zoneCapabilities) {
          console.log(`   🔧 ${capability.name}: ${capability.value}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur lors de la vérification des capacités: ${error.message}`);
      }
    }
    console.log();

    // 5. Analyse et recommandations
    console.log('📋 5. Analyse et recommandations');
    console.log('=' .repeat(60));
    
    console.log('🔍 PROBLÈME IDENTIFIÉ:');
    console.log('   L\'erreur 431 indique que le provider VpcVirtualRouter n\'est pas activé');
    console.log('   dans les réseaux physiques de la zone.');
    console.log('');
    console.log('💡 SOLUTIONS:');
    console.log('');
    console.log('1. 🔧 Configuration CloudStack (Administrateur requis):');
    console.log('   a) Connectez-vous à l\'interface d\'administration CloudStack');
    console.log('   b) Allez dans Infrastructure > Zones');
    console.log('   c) Sélectionnez votre zone');
    console.log('   d) Allez dans l\'onglet "Physical Networks"');
    console.log('   e) Sélectionnez le réseau physique principal');
    console.log('   f) Activez le provider "VpcVirtualRouter"');
    console.log('   g) Sauvegardez la configuration');
    console.log('');
    console.log('2. 🔧 Via l\'API CloudStack (si vous avez les droits admin):');
    console.log('   - Utilisez la commande "updatePhysicalNetwork"');
    console.log('   - Activez le service "VpcVirtualRouter"');
    console.log('');
    console.log('3. 🔧 Vérification post-configuration:');
    console.log('   - Relancez ce diagnostic après la configuration');
    console.log('   - Testez la création d\'un VPC');
    console.log('');
    console.log('4. 🔧 Alternative temporaire:');
    console.log('   - Utilisez des réseaux isolés au lieu de VPCs');
    console.log('   - Ou utilisez des VPCs dans une autre zone configurée');
    console.log('');
    console.log('⚠️ IMPORTANT:');
    console.log('   Cette configuration nécessite des droits d\'administrateur CloudStack');
    console.log('   et peut nécessiter un redémarrage des services réseau.');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Fonction pour vérifier si la configuration est correcte
async function checkVPCReadiness() {
  console.log('🔍 Vérification de la préparation VPC\n');
  
  try {
    // Test simple de création de VPC
    const testVPCData = {
      name: `test-readiness-${Date.now()}`,
      displaytext: 'Test de préparation VPC',
      cidr: '10.0.0.0/16',
      vpcofferingid: 'b1a77c5e-2fa8-4821-8fe9-7ab193489287',
      zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6'
    };
    
    console.log('🧪 Test de création de VPC...');
    const result = await cloudstackAPI.createVPC(testVPCData);
    console.log('✅ Configuration VPC OK !');
    console.log('📊 VPC créé:', result);
    
    // Nettoyer
    if (result.id || result.vpc?.id) {
      console.log('🗑️ Suppression du VPC de test...');
      await cloudstackAPI.deleteVPC(result.id || result.vpc.id);
      console.log('✅ VPC de test supprimé');
    }
    
    return true;
  } catch (error) {
    console.log('❌ Configuration VPC non prête');
    console.log('💬 Erreur:', error.message);
    return false;
  }
}

// Exécuter le diagnostic
async function runDiagnostic() {
  await diagnosticVPCConfiguration();
  
  console.log('\n🔄 Vérification de la préparation VPC...');
  const isReady = await checkVPCReadiness();
  
  if (isReady) {
    console.log('\n🎉 Configuration VPC prête !');
    console.log('Vous pouvez maintenant créer des VPCs dans votre portail.');
  } else {
    console.log('\n⚠️ Configuration VPC non prête');
    console.log('Suivez les recommandations ci-dessus pour résoudre le problème.');
  }
}

// Vérifier si le script est exécuté directement
if (require.main === module) {
  runDiagnostic().catch(console.error);
}

module.exports = {
  diagnosticVPCConfiguration,
  checkVPCReadiness,
  runDiagnostic
};
