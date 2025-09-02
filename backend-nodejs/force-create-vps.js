const cloudstackAPI = require('./cloudstack-api');

async function forceCreateVPS() {
  console.log('🚀 Création forcée d\'un VPS...\n');

  try {
    // Récupérer directement tous les templates via l'API CloudStack
    console.log('🔍 Récupération des templates via API directe...');
    const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
    const templates = response.listtemplatesresponse?.template || [];
    
    console.log(`📦 ${templates.length} templates trouvés via API directe`);
    templates.forEach(template => {
      console.log(`   - ${template.name} (${template.displaytext}) - ID: ${template.id} - Prêt: ${template.isready}`);
    });

    // Utiliser le premier template disponible (même s'il n'est pas "ready")
    if (templates.length === 0) {
      console.log('❌ Aucun template disponible');
      return;
    }

    const template = templates[0];
    console.log(`\n✅ Template sélectionné: ${template.name} (ID: ${template.id})`);

    // Récupérer les ressources
    const [zones, offerings] = await Promise.all([
      cloudstackAPI.getZones(),
      cloudstackAPI.getServiceOfferings()
    ]);

    console.log(`📍 Zone: ${zones[0]?.name} (ID: ${zones[0]?.id})`);
    console.log(`💻 Offre: ${offerings[0]?.name} (ID: ${offerings[0]?.id})`);

    // Créer le VPS même si le template n'est pas "ready"
    console.log('\n🚀 Tentative de création du VPS...');
    
    const vpsParams = {
      name: `forced-vps-${Date.now()}`,
      displayname: `VPS Forcé ${new Date().toLocaleDateString()}`,
      serviceofferingid: offerings[0].id,
      templateid: template.id,
      zoneid: zones[0].id,
      startvm: false
    };

    console.log('📋 Paramètres:', vpsParams);
    
    try {
      const vpsResult = await cloudstackAPI.deployVirtualMachine(vpsParams);
      console.log('✅ VPS créé avec succès !');
      console.log('📊 Résultat:', JSON.stringify(vpsResult, null, 2));

      // Vérifier la liste des instances
      console.log('\n🔍 Vérification des instances...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const instances = await cloudstackAPI.getVirtualMachines();
      console.log(`📋 ${instances.length} instances disponibles`);
      instances.forEach(instance => {
        console.log(`   - ${instance.name} (${instance.state}) - ID: ${instance.id}`);
      });

      console.log('\n🎉 SUCCÈS ! VPS créé !');
      console.log('💡 Vérifiez maintenant dans :');
      console.log('   1. Interface CloudStack: http://172.21.23.1:8080/client');
      console.log('   2. Portail web: http://localhost:5173');

    } catch (vpsError) {
      console.log('❌ Erreur lors de la création du VPS:', vpsError.message);
      
      if (vpsError.message.includes('template')) {
        console.log('💡 Le template n\'est peut-être pas encore prêt');
        console.log('⏳ Attendez quelques minutes et réessayez');
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécution du script
forceCreateVPS().catch(console.error);
