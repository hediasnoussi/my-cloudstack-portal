const cloudstackAPI = require('./cloudstack-api');

async function waitAndTestVPS() {
  console.log('⏳ Attente du template et test de création de VPS...\n');

  try {
    // Attendre que le template soit prêt
    let templateReady = false;
    let templateId = null;
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    console.log('🔍 Attente que le template soit prêt...');
    
    while (!templateReady && attempts < maxAttempts) {
      attempts++;
      console.log(`📋 Vérification ${attempts}/${maxAttempts}...`);
      
      try {
        const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
        const templates = response.listtemplatesresponse?.template || [];
        
        // Chercher notre template de test
        const testTemplate = templates.find(t => t.name.startsWith('sync-test-'));
        
        if (testTemplate) {
          console.log('✅ Template de test trouvé !');
          console.log('📊 État:', testTemplate.isready ? 'Prêt' : 'En cours de préparation');
          
          if (testTemplate.isready) {
            templateReady = true;
            templateId = testTemplate.id;
            console.log('🎉 Template prêt !');
            break;
          } else {
            console.log('⏳ Template pas encore prêt, attente...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // 10 secondes
          }
        } else {
          console.log('❌ Template de test non trouvé');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
      } catch (error) {
        console.log('⚠️ Erreur lors de la vérification:', error.message);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    if (!templateReady) {
      console.log('❌ Template pas prêt après 5 minutes');
      return;
    }

    // Maintenant créer un VPS depuis le portail
    console.log('\n🚀 Création du VPS depuis le portail...');
    
    // Récupérer les ressources
    const [zones, offerings] = await Promise.all([
      cloudstackAPI.getZones(),
      cloudstackAPI.getServiceOfferings()
    ]);
    
    const vpsParams = {
      name: `portal-vps-${Date.now()}`,
      displayname: `VPS Créé depuis le Portail ${new Date().toLocaleDateString()}`,
      serviceofferingid: offerings[0].id,
      templateid: templateId,
      zoneid: zones[0].id,
      startvm: false
    };

    console.log('📋 Paramètres du VPS:', vpsParams);
    
    try {
      const vpsResult = await cloudstackAPI.deployVirtualMachine(vpsParams);
      console.log('✅ VPS créé avec succès depuis le portail !');
      console.log('📊 Résultat:', JSON.stringify(vpsResult, null, 2));
      
      // Vérifier que le VPS apparaît dans CloudStack
      console.log('\n🔍 Vérification que le VPS apparaît dans CloudStack...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const instances = await cloudstackAPI.getVirtualMachines();
      const newVPS = instances.find(i => i.name === vpsParams.name);
      
      if (newVPS) {
        console.log('✅ VPS trouvé dans CloudStack !');
        console.log('   Nom:', newVPS.name);
        console.log('   ID:', newVPS.id);
        console.log('   État:', newVPS.state);
        
        console.log('\n🎉 SYNCHRONISATION COMPLÈTE RÉUSSIE !');
        console.log('💡 Démonstration :');
        console.log('   1. ✅ Template créé dans CloudStack');
        console.log('   2. ✅ Template détecté par le portail');
        console.log('   3. ✅ VPS créé depuis le portail');
        console.log('   4. ✅ VPS apparaît dans CloudStack');
        
        console.log('\n🌐 Vérifiez maintenant dans :');
        console.log('   - Portail: http://localhost:5173');
        console.log('   - CloudStack: http://172.21.23.1:8080/client');
        console.log('   - API: http://localhost:3001/api/cloudstack/instances');
        
      } else {
        console.log('❌ VPS non trouvé dans CloudStack');
      }
      
    } catch (vpsError) {
      console.log('❌ Erreur lors de la création du VPS:', vpsError.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécution du script
waitAndTestVPS().catch(console.error);
