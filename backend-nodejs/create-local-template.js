const cloudstackAPI = require('./cloudstack-api');

async function createLocalTemplate() {
  console.log('🏠 Création d\'un template avec image locale\n');
  
  try {
    // 1. Vérifier les zones disponibles
    console.log('🔍 ÉTAPE 1: Vérification des zones');
    const zones = await cloudstackAPI.getZones();
    console.log(`📍 Zones disponibles: ${zones.length}`);
    zones.forEach(z => console.log(`   - ${z.name} (ID: ${z.id})`));
    
    // 2. Vérifier les types d'OS disponibles
    console.log('\n🔍 ÉTAPE 2: Types d\'OS disponibles');
    const osTypes = await cloudstackAPI.makeRequest('listOsTypes');
    const osList = osTypes.listostypesresponse?.ostype || [];
    console.log(`💻 Types d'OS: ${osList.length}`);
    osList.slice(0, 5).forEach(os => console.log(`   - ${os.description} (ID: ${os.id})`));
    
    // 3. Essayer de créer un template avec une image locale
    console.log('\n🔍 ÉTAPE 3: Création d\'un template local');
    
    // Essayer plusieurs chemins locaux possibles
    const localPaths = [
      '/opt/cloudstack/templates/ubuntu-22.04.qcow2',
      '/var/lib/cloudstack/templates/ubuntu-22.04.qcow2',
      '/usr/share/cloudstack/templates/ubuntu-22.04.qcow2',
      '/tmp/ubuntu-22.04.qcow2',
      '/root/ubuntu-22.04.qcow2'
    ];
    
    for (const localPath of localPaths) {
      console.log(`\n📁 Test avec le chemin local: ${localPath}`);
      
      const templateParams = {
        name: `local-ubuntu-${Date.now()}`,
        displaytext: 'Ubuntu 22.04 Local Template',
        format: 'QCOW2',
        hypervisor: 'KVM',
        ostypeid: osList[0]?.id || '1',
        url: `file://${localPath}`,
        zoneid: zones[0].id,
        ispublic: true,
        isfeatured: false,
        isextractable: false,
        passwordenabled: false,
        sshkeyenabled: true
      };
      
      try {
        console.log('📋 Tentative de création...');
        const result = await cloudstackAPI.makeRequest('registerTemplate', templateParams);
        console.log('✅ Template créé avec succès !');
        console.log('   ID:', result.registertemplateresponse?.template?.[0]?.id);
        return;
        
      } catch (error) {
        if (error.message.includes('No route to host')) {
          console.log('❌ Erreur réseau: No route to host');
        } else if (error.message.includes('file://')) {
          console.log('❌ Erreur: URL file:// non supportée');
        } else {
          console.log('❌ Erreur:', error.message);
        }
      }
    }
    
    // 4. Alternative: Créer un template minimal
    console.log('\n🔍 ÉTAPE 4: Création d\'un template minimal');
    
    const minimalParams = {
      name: `minimal-template-${Date.now()}`,
      displaytext: 'Template Minimal Local',
      format: 'QCOW2',
      hypervisor: 'KVM',
      ostypeid: osList[0]?.id || '1',
      url: 'http://localhost/template.qcow2', // URL locale
      zoneid: zones[0].id,
      ispublic: true,
      isfeatured: false,
      isextractable: false,
      passwordenabled: false,
      sshkeyenabled: true
    };
    
    try {
      console.log('📋 Création du template minimal...');
      const result = await cloudstackAPI.makeRequest('registerTemplate', minimalParams);
      console.log('✅ Template minimal créé !');
      console.log('   ID:', result.registertemplateresponse?.template?.[0]?.id);
      
    } catch (error) {
      console.log('❌ Erreur template minimal:', error.message);
    }
    
    // 5. Recommandations
    console.log('\n💡 RECOMMANDATIONS:');
    console.log('   1. Vérifiez la connectivité Internet de CloudStack');
    console.log('   2. Ajoutez des images localement via l\'interface CloudStack');
    console.log('   3. Utilisez des images déjà téléchargées');
    console.log('   4. Vérifiez les paramètres réseau de CloudStack');
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécution du script
createLocalTemplate().catch(console.error);
