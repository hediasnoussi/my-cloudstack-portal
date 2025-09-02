const cloudstackAPI = require('./cloudstack-api');

async function createWithSystemVM() {
  console.log('🚀 Création de VPS avec template SystemVM...\n');

  try {
    // Récupérer les templates et utiliser SystemVM
    console.log('🔍 Récupération des templates...');
    const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
    const templates = response.listtemplatesresponse?.template || [];
    
    // Trouver le template SystemVM qui est prêt
    const systemVMTemplate = templates.find(t => t.name.includes('SystemVM') && t.isready);
    
    if (!systemVMTemplate) {
      console.log('❌ Aucun template SystemVM prêt trouvé');
      return;
    }

    console.log(`✅ Template sélectionné: ${systemVMTemplate.name} (ID: ${systemVMTemplate.id})`);
    console.log(`📊 État: ${systemVMTemplate.isready ? 'Prêt' : 'Non prêt'}`);

    // Récupérer les ressources
    const [zones, offerings] = await Promise.all([
      cloudstackAPI.getZones(),
      cloudstackAPI.getServiceOfferings()
    ]);

    console.log(`📍 Zone: ${zones[0]?.name} (ID: ${zones[0]?.id})`);
    console.log(`💻 Offre: ${offerings[0]?.name} (ID: ${offerings[0]?.id})`);

    // Créer le VPS avec le template SystemVM
    console.log('\n🚀 Création du VPS...');
    
    const vpsParams = {
      name: `systemvm-vps-${Date.now()}`,
      displayname: `VPS SystemVM ${new Date().toLocaleDateString()}`,
      serviceofferingid: offerings[0].id,
      templateid: systemVMTemplate.id,
      zoneid: zones[0].id,
      startvm: false
    };

    console.log('📋 Paramètres:', vpsParams);
    
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

    console.log('\n🎉 SUCCÈS ! VPS créé avec le template SystemVM !');
    console.log('💡 Vérifiez maintenant dans :');
    console.log('   1. Interface CloudStack: http://172.21.23.1:8080/client');
    console.log('   2. Portail web: http://localhost:5173');
    console.log('   3. API: http://localhost:3001/api/cloudstack/instances');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    if (error.message.includes('530')) {
      console.log('💡 Erreur 530: Problème de ressources ou de configuration CloudStack');
      console.log('💡 Vérifiez la configuration de la zone et des offres de service');
    }
  }
}

// Exécution du script
createWithSystemVM().catch(console.error);
