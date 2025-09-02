const cloudstackAPI = require('./cloudstack-api');

async function addTemplates() {
  console.log('🚀 Ajout de templates dans CloudStack...\n');

  try {
    // Template Ubuntu 22.04 LTS
    console.log('📦 Ajout du template Ubuntu 22.04 LTS...');
    const ubuntuParams = {
      name: 'Ubuntu-22.04-LTS',
      displaytext: 'Ubuntu 22.04 LTS (Jammy Jellyfish)',
      format: 'QCOW2',
      hypervisor: 'KVM',
      ostypeid: '1', // Linux
      url: 'https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img',
      zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6', // Zone ID de votre CloudStack
      ispublic: true,
      isfeatured: true,
      isextractable: false,
      passwordenabled: false,
      sshkeyenabled: true
    };

    console.log('   Paramètres Ubuntu:', ubuntuParams);
    const ubuntuResult = await cloudstackAPI.makeRequest('registerTemplate', ubuntuParams);
    console.log('✅ Template Ubuntu ajouté:', ubuntuResult);

    // Template CentOS 8
    console.log('\n📦 Ajout du template CentOS 8...');
    const centosParams = {
      name: 'CentOS-8-Stream',
      displaytext: 'CentOS 8 Stream',
      format: 'QCOW2',
      hypervisor: 'KVM',
      ostypeid: '1', // Linux
      url: 'https://cloud.centos.org/centos/8-stream/x86_64/images/CentOS-8-Stream-GenericCloud-8.4.2105-20210603.0.x86_64.qcow2',
      zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6',
      ispublic: true,
      isfeatured: true,
      isextractable: false,
      passwordenabled: false,
      sshkeyenabled: true
    };

    console.log('   Paramètres CentOS:', centosParams);
    const centosResult = await cloudstackAPI.makeRequest('registerTemplate', centosParams);
    console.log('✅ Template CentOS ajouté:', centosResult);

    // Vérifier les templates ajoutés
    console.log('\n🔍 Vérification des templates ajoutés...');
    const templates = await cloudstackAPI.getTemplates();
    console.log('📋 Templates disponibles:', templates.length);
    templates.forEach(template => {
      console.log(`   - ${template.name} (${template.displaytext}) - ID: ${template.id}`);
    });

    console.log('\n🎉 Templates ajoutés avec succès !');
    console.log('💡 Vous pouvez maintenant créer des VPS avec ces templates.');

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des templates:', error.message);
    
    if (error.message.includes('already exists')) {
      console.log('ℹ️ Certains templates existent déjà.');
    }
    
    // Vérifier les templates existants
    try {
      console.log('\n🔍 Vérification des templates existants...');
      const templates = await cloudstackAPI.getTemplates();
      console.log('📋 Templates disponibles:', templates.length);
      templates.forEach(template => {
        console.log(`   - ${template.name} (${template.displaytext}) - ID: ${template.id}`);
      });
    } catch (checkError) {
      console.error('❌ Erreur lors de la vérification:', checkError.message);
    }
  }
}

// Exécution du script
addTemplates().catch(console.error);
