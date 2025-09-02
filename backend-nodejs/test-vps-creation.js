const cloudstackAPI = require('./cloudstack-api');

async function testVPSCreation() {
  console.log('🧪 Test de création de VPS...\n');

  try {
    // 1. Vérifier les templates disponibles
    console.log('🔍 Étape 1: Vérification des templates...');
    const templates = await cloudstackAPI.getTemplates();
    console.log(`📋 ${templates.length} templates disponibles`);
    
    if (templates.length === 0) {
      console.log('❌ Aucun template disponible. Exécutez d\'abord add-templates.js');
      return;
    }

    const template = templates[0]; // Utiliser le premier template disponible
    console.log(`✅ Template sélectionné: ${template.name} (ID: ${template.id})`);

    // 2. Vérifier les offres de service
    console.log('\n🔍 Étape 2: Vérification des offres de service...');
    const offerings = await cloudstackAPI.getServiceOfferings();
    console.log(`📋 ${offerings.length} offres de service disponibles`);
    
    if (offerings.length === 0) {
      console.log('❌ Aucune offre de service disponible');
      return;
    }

    const offering = offerings[0]; // Utiliser la première offre disponible
    console.log(`✅ Offre sélectionnée: ${offering.name} (ID: ${offering.id})`);

    // 3. Vérifier les zones
    console.log('\n🔍 Étape 3: Vérification des zones...');
    const zones = await cloudstackAPI.getZones();
    console.log(`📋 ${zones.length} zones disponibles`);
    
    if (zones.length === 0) {
      console.log('❌ Aucune zone disponible');
      return;
    }

    const zone = zones[0]; // Utiliser la première zone disponible
    console.log(`✅ Zone sélectionnée: ${zone.name} (ID: ${zone.id})`);

    // 4. Créer un VPS de test
    console.log('\n🚀 Étape 4: Création du VPS de test...');
    const vpsParams = {
      name: `test-vps-${Date.now()}`,
      displayname: `VPS Test ${new Date().toLocaleDateString()}`,
      serviceofferingid: offering.id,
      templateid: template.id,
      zoneid: zone.id,
      startvm: false // Ne pas démarrer automatiquement
    };

    console.log('📋 Paramètres du VPS:', vpsParams);
    
    const vpsResult = await cloudstackAPI.deployVirtualMachine(vpsParams);
    console.log('✅ VPS créé avec succès !');
    console.log('📊 Détails du VPS:', JSON.stringify(vpsResult, null, 2));

    // 5. Vérifier que le VPS apparaît dans la liste
    console.log('\n🔍 Étape 5: Vérification de la liste des instances...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Attendre 5 secondes
    
    const instances = await cloudstackAPI.getVirtualMachines();
    console.log(`📋 ${instances.length} instances disponibles`);
    instances.forEach(instance => {
      console.log(`   - ${instance.name} (${instance.state}) - ID: ${instance.id}`);
    });

    console.log('\n🎉 Test de création de VPS réussi !');
    console.log('💡 Vérifiez maintenant dans l\'interface CloudStack et dans le portail.');

  } catch (error) {
    console.error('❌ Erreur lors du test de création de VPS:', error.message);
    
    if (error.message.includes('template')) {
      console.log('💡 Vérifiez que les templates sont bien ajoutés et disponibles.');
    }
    
    if (error.message.includes('serviceoffering')) {
      console.log('💡 Vérifiez que les offres de service sont bien configurées.');
    }
    
    if (error.message.includes('zone')) {
      console.log('💡 Vérifiez que les zones sont bien configurées.');
    }
  }
}

// Exécution du script
testVPSCreation().catch(console.error);
