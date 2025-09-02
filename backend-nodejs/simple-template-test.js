const cloudstackAPI = require('./cloudstack-api');

async function testSimpleTemplate() {
  console.log('🧪 Test simple d\'ajout de template...\n');

  try {
    // Vérifier d'abord les templates existants
    console.log('🔍 Vérification des templates existants...');
    const templates = await cloudstackAPI.getTemplates();
    console.log(`📋 ${templates.length} templates trouvés`);
    
    if (templates.length > 0) {
      templates.forEach(template => {
        console.log(`   - ${template.name} (${template.displaytext}) - ID: ${template.id}`);
      });
      return;
    }

    // Essayer d'ajouter un template simple
    console.log('\n📦 Tentative d\'ajout d\'un template simple...');
    
    const simpleParams = {
      name: 'Test-Template',
      displaytext: 'Template de test simple',
      format: 'QCOW2',
      hypervisor: 'KVM',
      ostypeid: '1',
      url: 'https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-amd64.img',
      zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6',
      ispublic: true,
      isfeatured: false,
      isextractable: false,
      passwordenabled: false,
      sshkeyenabled: true
    };

    console.log('📋 Paramètres:', simpleParams);
    
    const result = await cloudstackAPI.makeRequest('registerTemplate', simpleParams);
    console.log('✅ Template ajouté avec succès !');
    console.log('📊 Résultat:', JSON.stringify(result, null, 2));

    // Attendre et vérifier
    console.log('\n⏳ Attente de la disponibilité...');
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    const newTemplates = await cloudstackAPI.getTemplates();
    console.log(`📦 Templates disponibles: ${newTemplates.length}`);
    newTemplates.forEach(template => {
      console.log(`   - ${template.name} (${template.displaytext}) - ID: ${template.id}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    
    // Essayer de récupérer plus d'informations sur l'erreur
    if (error.response) {
      console.log('📊 Détails de l\'erreur:', error.response.data);
    }
    
    // Vérifier les permissions
    console.log('\n🔍 Vérification des permissions...');
    try {
      const accounts = await cloudstackAPI.makeRequest('listAccounts');
      console.log('📋 Comptes disponibles:', accounts.listaccountsresponse?.account?.length || 0);
    } catch (permError) {
      console.log('❌ Impossible de vérifier les permissions:', permError.message);
    }
  }
}

// Exécution du script
testSimpleTemplate().catch(console.error);
