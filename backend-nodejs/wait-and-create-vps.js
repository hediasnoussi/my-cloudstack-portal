const cloudstackAPI = require('./cloudstack-api');

async function waitAndCreateVPS() {
  console.log('⏳ Attente du template et création de VPS...\n');

  try {
    // Attendre que le template soit prêt
    let templateReady = false;
    let templateId = null;
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    console.log('🔍 Attente que le template soit prêt...');
    
    while (!templateReady && attempts < maxAttempts) {
      attempts++;
      console.log(`📋 Tentative ${attempts}/${maxAttempts}...`);
      
      try {
        // Lister tous les templates (pas seulement featured)
        const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
        const templates = response.listtemplatesresponse?.template || [];
        
        console.log(`📦 ${templates.length} templates trouvés`);
        
        // Chercher notre template de test
        const testTemplate = templates.find(t => t.name === 'Test-Template');
        
        if (testTemplate) {
          console.log('✅ Template Test-Template trouvé !');
          console.log('📊 État:', testTemplate.isready ? 'Prêt' : 'En cours de préparation');
          console.log('📥 Téléchargement:', testTemplate.downloaddetails?.[0]?.downloadState || 'Inconnu');
          
          if (testTemplate.isready) {
            templateReady = true;
            templateId = testTemplate.id;
            console.log('🎉 Template prêt !');
            break;
          } else {
            console.log('⏳ Template pas encore prêt, attente...');
            await new Promise(resolve => setTimeout(resolve, 10000)); // Attendre 10 secondes
          }
        } else {
          console.log('❌ Template Test-Template non trouvé');
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

    // Maintenant créer un VPS
    console.log('\n🚀 Création du VPS...');
    
    // Récupérer les ressources nécessaires
    const [zones, offerings] = await Promise.all([
      cloudstackAPI.getZones(),
      cloudstackAPI.getServiceOfferings()
    ]);
    
    if (zones.length === 0 || offerings.length === 0) {
      console.log('❌ Ressources insuffisantes pour créer un VPS');
      return;
    }

    const vpsParams = {
      name: `demo-vps-${Date.now()}`,
      displayname: `VPS Demo ${new Date().toLocaleDateString()}`,
      serviceofferingid: offerings[0].id,
      templateid: templateId,
      zoneid: zones[0].id,
      startvm: false
    };

    console.log('📋 Paramètres du VPS:', vpsParams);
    
    const vpsResult = await cloudstackAPI.deployVirtualMachine(vpsParams);
    console.log('✅ VPS créé avec succès !');
    console.log('📊 Détails:', JSON.stringify(vpsResult, null, 2));

    // Vérifier que le VPS apparaît
    console.log('\n🔍 Vérification de la liste des instances...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const instances = await cloudstackAPI.getVirtualMachines();
    console.log(`📋 ${instances.length} instances disponibles`);
    instances.forEach(instance => {
      console.log(`   - ${instance.name} (${instance.state}) - ID: ${instance.id}`);
    });

    console.log('\n🎉 SUCCÈS ! VPS créé et visible dans CloudStack !');
    console.log('💡 Vous pouvez maintenant :');
    console.log('   1. Le voir dans l\'interface CloudStack');
    console.log('   2. Le gérer depuis le portail web');
    console.log('   3. Créer d\'autres VPS');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécution du script
waitAndCreateVPS().catch(console.error);
