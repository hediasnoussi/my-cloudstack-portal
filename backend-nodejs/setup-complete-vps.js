const cloudstackAPI = require('./cloudstack-api');

async function setupCompleteVPS() {
  console.log('🚀 Configuration complète du système VPS...\n');
  console.log('=' .repeat(60));

  try {
    // ÉTAPE 1: Vérification de la connexion CloudStack
    console.log('\n🔍 ÉTAPE 1: Vérification de la connexion CloudStack');
    console.log('-'.repeat(40));
    
    const capabilities = await cloudstackAPI.makeRequest('listCapabilities');
    console.log('✅ Connexion CloudStack: OK');
    console.log('📊 Version CloudStack:', capabilities.listcapabilitiesresponse?.capability || 'Non disponible');

    // ÉTAPE 2: Vérification des ressources disponibles
    console.log('\n🔍 ÉTAPE 2: Vérification des ressources disponibles');
    console.log('-'.repeat(40));
    
    const [zones, offerings] = await Promise.all([
      cloudstackAPI.getZones(),
      cloudstackAPI.getServiceOfferings()
    ]);
    
    console.log(`📍 Zones: ${zones.length} disponible(s)`);
    zones.forEach(zone => console.log(`   - ${zone.name} (ID: ${zone.id})`));
    
    console.log(`💻 Offres de service: ${offerings.length} disponible(s)`);
    offerings.forEach(offering => console.log(`   - ${offering.name}: ${offering.cpunumber} CPU, ${offering.memory} MB RAM`));

    // ÉTAPE 3: Vérification des templates
    console.log('\n🔍 ÉTAPE 3: Vérification des templates');
    console.log('-'.repeat(40));
    
    const templates = await cloudstackAPI.getTemplates();
    console.log(`📦 Templates: ${templates.length} disponible(s)`);
    
    if (templates.length === 0) {
      console.log('❌ Aucun template disponible - Ajout de templates Ubuntu et CentOS...');
      
      // Ajouter Ubuntu 22.04
      console.log('\n📦 Ajout du template Ubuntu 22.04 LTS...');
      const ubuntuParams = {
        name: 'Ubuntu-22.04-LTS',
        displaytext: 'Ubuntu 22.04 LTS (Jammy Jellyfish)',
        format: 'QCOW2',
        hypervisor: 'KVM',
        ostypeid: '1',
        url: 'https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img',
        zoneid: zones[0].id,
        ispublic: true,
        isfeatured: true,
        isextractable: false,
        passwordenabled: false,
        sshkeyenabled: true
      };
      
      try {
        const ubuntuResult = await cloudstackAPI.makeRequest('registerTemplate', ubuntuParams);
        console.log('✅ Template Ubuntu ajouté');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('ℹ️ Template Ubuntu existe déjà');
        } else {
          console.log('⚠️ Erreur Ubuntu:', error.message);
        }
      }

      // Ajouter CentOS 8
      console.log('\n📦 Ajout du template CentOS 8 Stream...');
      const centosParams = {
        name: 'CentOS-8-Stream',
        displaytext: 'CentOS 8 Stream',
        format: 'QCOW2',
        hypervisor: 'KVM',
        ostypeid: '1',
        url: 'https://cloud.centos.org/centos/8-stream/x86_64/images/CentOS-8-Stream-GenericCloud-8.4.2105-20210603.0.x86_64.qcow2',
        zoneid: zones[0].id,
        ispublic: true,
        isfeatured: true,
        isextractable: false,
        passwordenabled: false,
        sshkeyenabled: true
      };
      
      try {
        const centosResult = await cloudstackAPI.makeRequest('registerTemplate', centosParams);
        console.log('✅ Template CentOS ajouté');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('ℹ️ Template CentOS existe déjà');
        } else {
          console.log('⚠️ Erreur CentOS:', error.message);
        }
      }

      // Attendre et vérifier
      console.log('\n⏳ Attente de la disponibilité des templates...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      const newTemplates = await cloudstackAPI.getTemplates();
      console.log(`📦 Templates disponibles après ajout: ${newTemplates.length}`);
      newTemplates.forEach(template => {
        console.log(`   - ${template.name} (${template.displaytext}) - ID: ${template.id}`);
      });
    } else {
      templates.forEach(template => {
        console.log(`   - ${template.name} (${template.displaytext}) - ID: ${template.id}`);
      });
    }

    // ÉTAPE 4: Test de création d'un VPS
    console.log('\n🔍 ÉTAPE 4: Test de creation d\'un VPS');
    console.log('-'.repeat(40));
    
    const availableTemplates = await cloudstackAPI.getTemplates();
    if (availableTemplates.length > 0 && offerings.length > 0) {
      console.log('🧪 Creation d\'un VPS de test...');
      
      const vpsParams = {
        name: `demo-vps-${Date.now()}`,
        displayname: `VPS Demo ${new Date().toLocaleDateString()}`,
        serviceofferingid: offerings[0].id,
        templateid: availableTemplates[0].id,
        zoneid: zones[0].id,
        startvm: false
      };
      
      try {
        const vpsResult = await cloudstackAPI.deployVirtualMachine(vpsParams);
        console.log('✅ VPS de test créé avec succès !');
        console.log('📊 Détails:', JSON.stringify(vpsResult, null, 2));
        
        // Vérifier la liste des instances
        await new Promise(resolve => setTimeout(resolve, 5000));
        const instances = await cloudstackAPI.getVirtualMachines();
        console.log(`📋 Instances disponibles: ${instances.length}`);
        instances.forEach(instance => {
          console.log(`   - ${instance.name} (${instance.state}) - ID: ${instance.id}`);
        });
        
      } catch (error) {
        console.log('❌ Erreur lors de la création du VPS:', error.message);
      }
    } else {
      console.log('⚠️ Impossible de créer un VPS - Ressources insuffisantes');
    }

    // ÉTAPE 5: Résumé final
    console.log('\n🎯 RÉSUMÉ FINAL');
    console.log('='.repeat(60));
    
    const finalTemplates = await cloudstackAPI.getTemplates();
    const finalInstances = await cloudstackAPI.getVirtualMachines();
    
    console.log(`✅ Connexion CloudStack: OK`);
    console.log(`📍 Zones: ${zones.length} disponible(s)`);
    console.log(`💻 Offres de service: ${offerings.length} disponible(s)`);
    console.log(`📦 Templates: ${finalTemplates.length} disponible(s)`);
    console.log(`🖥️ Instances: ${finalInstances.length} créée(s)`);
    
    if (finalTemplates.length > 0 && finalInstances.length > 0) {
      console.log('\n🎉 SYSTÈME VPS COMPLÈTEMENT FONCTIONNEL !');
      console.log('💡 Vous pouvez maintenant :');
      console.log('   1. Créer des VPS via le portail web');
      console.log('   2. Les gérer depuis l\'interface CloudStack');
      console.log('   3. Les contrôler via l\'API');
    } else {
      console.log('\n⚠️ SYSTÈME PARTIELLEMENT FONCTIONNEL');
      console.log('💡 Vérifiez la configuration CloudStack');
    }

  } catch (error) {
    console.error('\n❌ ERREUR CRITIQUE:', error.message);
    console.log('💡 Vérifiez la configuration CloudStack et les clés API');
  }
}

// Exécution du script principal
setupCompleteVPS().catch(console.error);
