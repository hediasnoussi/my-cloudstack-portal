const cloudstackAPI = require('./cloudstack-api');

async function debugVPSCreation() {
  console.log('🔍 Débogage de la création de VPS...\n');

  try {
    // 1. Vérifier les templates disponibles
    console.log('🔍 ÉTAPE 1: Vérification des templates...');
    const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
    const templates = response.listtemplatesresponse?.template || [];
    
    console.log(`📦 ${templates.length} templates trouvés`);
    templates.forEach(template => {
      console.log(`   - ${template.name} (${template.displaytext})`);
      console.log(`     ID: ${template.id} | Prêt: ${template.isready} | Type: ${template.templatetype}`);
    });

    // 2. Vérifier les offres de service
    console.log('\n🔍 ÉTAPE 2: Vérification des offres de service...');
    const offerings = await cloudstackAPI.getServiceOfferings();
    console.log(`💻 ${offerings.length} offres de service disponibles`);
    offerings.forEach(offering => {
      console.log(`   - ${offering.name}: ${offering.cpunumber} CPU, ${offering.memory} MB RAM`);
      console.log(`     ID: ${offering.id} | État: ${offering.state}`);
    });

    // 3. Vérifier les zones
    console.log('\n🔍 ÉTAPE 3: Vérification des zones...');
    const zones = await cloudstackAPI.getZones();
    console.log(`📍 ${zones.length} zones disponibles`);
    zones.forEach(zone => {
      console.log(`   - ${zone.name} (ID: ${zone.id})`);
      console.log(`     État: ${zone.allocationstate} | Type: ${zone.networktype}`);
    });

    // 4. Vérifier les comptes et domaines
    console.log('\n🔍 ÉTAPE 4: Vérification des comptes et domaines...');
    try {
      const accounts = await cloudstackAPI.makeRequest('listAccounts');
      const domains = await cloudstackAPI.makeRequest('listDomains');
      
      console.log(`👥 Comptes: ${accounts.listaccountsresponse?.account?.length || 0}`);
      console.log(`🏢 Domaines: ${domains.listdomainsresponse?.domain?.length || 0}`);
      
      if (accounts.listaccountsresponse?.account?.length > 0) {
        const adminAccount = accounts.listaccountsresponse.account.find(acc => acc.name === 'admin');
        if (adminAccount) {
          console.log(`✅ Compte admin trouvé: ${adminAccount.name} (ID: ${adminAccount.id})`);
        }
      }
    } catch (error) {
      console.log('⚠️ Impossible de récupérer les comptes/domaines:', error.message);
    }

    // 5. Tester avec un template utilisateur simple
    console.log('\n🔍 ÉTAPE 5: Test avec template utilisateur...');
    const userTemplate = templates.find(t => t.templatetype === 'USER' && t.isready);
    
    if (userTemplate) {
      console.log(`✅ Template utilisateur trouvé: ${userTemplate.name}`);
      
      // Essayer de créer un VPS avec des paramètres minimaux
      const vpsParams = {
        name: `debug-vps-${Date.now()}`,
        displayname: `VPS Debug ${new Date().toLocaleDateString()}`,
        serviceofferingid: offerings[0].id,
        templateid: userTemplate.id,
        zoneid: zones[0].id,
        startvm: false
      };

      console.log('📋 Paramètres de test:', vpsParams);
      
      try {
        const vpsResult = await cloudstackAPI.deployVirtualMachine(vpsParams);
        console.log('✅ VPS créé avec succès !');
        console.log('📊 Résultat:', JSON.stringify(vpsResult, null, 2));
      } catch (vpsError) {
        console.log('❌ Erreur lors de la création:', vpsError.message);
        
        // Essayer de récupérer plus de détails sur l'erreur
        if (vpsError.response) {
          console.log('📊 Détails de l\'erreur:', vpsError.response.data);
        }
      }
    } else {
      console.log('❌ Aucun template utilisateur prêt trouvé');
    }

    // 6. Vérifier les instances existantes
    console.log('\n🔍 ÉTAPE 6: Vérification des instances...');
    const instances = await cloudstackAPI.getVirtualMachines();
    console.log(`🖥️ ${instances.length} instances existantes`);
    instances.forEach(instance => {
      console.log(`   - ${instance.name} (${instance.state}) - ID: ${instance.id}`);
    });

    console.log('\n🎯 DIAGNOSTIC TERMINÉ');
    console.log('💡 Prochaines étapes :');
    console.log('   1. Vérifiez la configuration CloudStack');
    console.log('   2. Assurez-vous que la zone a suffisamment de ressources');
    console.log('   3. Vérifiez les permissions du compte API');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécution du script
debugVPSCreation().catch(console.error);
