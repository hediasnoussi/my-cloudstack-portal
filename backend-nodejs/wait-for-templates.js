const cloudstackAPI = require('./cloudstack-api');

async function waitForTemplates() {
  console.log('⏳ Attente que les templates utilisateur soient prêts...\n');

  try {
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max
    let templatesReady = false;

    while (!templatesReady && attempts < maxAttempts) {
      attempts++;
      console.log(`📋 Vérification ${attempts}/${maxAttempts}...`);
      
      try {
        // Récupérer tous les templates
        const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
        const templates = response.listtemplatesresponse?.template || [];
        
        // Filtrer les templates utilisateur prêts
        const readyUserTemplates = templates.filter(t => 
          t.templatetype === 'USER' && t.isready
        );
        
        console.log(`📦 ${templates.length} templates trouvés, ${readyUserTemplates.length} templates utilisateur prêts`);
        
        if (readyUserTemplates.length > 0) {
          console.log('🎉 Templates utilisateur prêts !');
          readyUserTemplates.forEach(template => {
            console.log(`   ✅ ${template.name} (${template.displaytext}) - ID: ${template.id}`);
          });
          
          templatesReady = true;
          break;
        } else {
          // Afficher l'état des templates utilisateur
          const userTemplates = templates.filter(t => t.templatetype === 'USER');
          console.log('⏳ Templates utilisateur en cours de préparation :');
          userTemplates.forEach(template => {
            const downloadState = template.downloaddetails?.[0]?.downloadState || 'Inconnu';
            const downloadPercent = template.downloaddetails?.[0]?.downloadPercent || '0';
            console.log(`   📥 ${template.name}: ${downloadState} (${downloadPercent}%) - Prêt: ${template.isready}`);
          });
          
          console.log('⏳ Attente de 10 secondes...');
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
      } catch (error) {
        console.log('⚠️ Erreur lors de la vérification:', error.message);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }

    if (templatesReady) {
      console.log('\n🚀 Maintenant testons la création d\'un VPS !');
      
      // Récupérer les ressources
      const [zones, offerings] = await Promise.all([
        cloudstackAPI.getZones(),
        cloudstackAPI.getServiceOfferings()
      ]);
      
      // Utiliser le premier template utilisateur prêt
      const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
      const templates = response.listtemplatesresponse?.template || [];
      const readyTemplate = templates.find(t => t.templatetype === 'USER' && t.isready);
      
      if (readyTemplate) {
        console.log(`✅ Template sélectionné: ${readyTemplate.name}`);
        
        const vpsParams = {
          name: `ready-vps-${Date.now()}`,
          displayname: `VPS Prêt ${new Date().toLocaleDateString()}`,
          serviceofferingid: offerings[0].id,
          templateid: readyTemplate.id,
          zoneid: zones[0].id,
          startvm: false
        };

        console.log('📋 Paramètres du VPS:', vpsParams);
        
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

          console.log('\n🎉 SUCCÈS COMPLET !');
          console.log('💡 Vérifiez maintenant dans :');
          console.log('   1. Interface CloudStack: http://172.21.23.1:8080/client');
          console.log('   2. Portail web: http://localhost:5173');
          
        } catch (vpsError) {
          console.log('❌ Erreur lors de la création du VPS:', vpsError.message);
        }
      }
      
    } else {
      console.log('\n❌ Templates pas prêts après 10 minutes');
      console.log('💡 Vérifiez la configuration CloudStack et les URLs des templates');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécution du script
waitForTemplates().catch(console.error);
