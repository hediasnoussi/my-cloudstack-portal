const cloudstackAPI = require('./cloudstack-api');

async function explainPortalVsCloudStack() {
  console.log('🔍 EXPLICATION : Portail vs CloudStack\n');
  console.log('=' .repeat(60));

  console.log('\n🌐 VOTRE PORTAL WEB (http://localhost:5173)');
  console.log('   ✅ Interface utilisateur moderne et belle');
  console.log('   ✅ Gestion des utilisateurs et permissions');
  console.log('   ✅ Interface de création de VPS');
  console.log('   ❌ NE PEUT PAS créer de templates CloudStack');
  console.log('   ❌ NE PEUT PAS gérer l\'infrastructure CloudStack');
  console.log('   💡 C\'est juste une "vitrine" pour CloudStack');

  console.log('\n🖥️ CLOUDSTACK SERVER (http://172.21.23.1:8080/client)');
  console.log('   ✅ Gère l\'infrastructure (CPU, RAM, stockage)');
  console.log('   ✅ Stocke les templates d\'images');
  console.log('   ✅ Crée et gère les VPS réels');
  console.log('   ✅ Interface d\'administration complète');
  console.log('   💡 C\'est le "moteur" qui fait tout fonctionner');

  console.log('\n🔗 COMMENT ÇA MARCHE :');
  console.log('   1. CloudStack = Moteur (gère tout)');
  console.log('   2. Votre Portail = Interface (utilise CloudStack)');
  console.log('   3. Vous ajoutez templates dans CloudStack');
  console.log('   4. Votre portail les utilise automatiquement');

  console.log('\n' + '='.repeat(60));
  console.log('\n🔍 ÉTAT ACTUEL :');

  try {
    // Vérifier les templates dans CloudStack
    console.log('\n📦 Templates dans CloudStack :');
    const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
    const templates = response.listtemplatesresponse?.template || [];
    
    const userTemplates = templates.filter(t => t.templatetype === 'USER');
    const readyTemplates = userTemplates.filter(t => t.isready);
    
    console.log(`   Total: ${templates.length} templates`);
    console.log(`   Templates utilisateur: ${userTemplates.length}`);
    console.log(`   Templates prêts: ${readyTemplates.length}`);
    
    if (readyTemplates.length === 0) {
      console.log('\n❌ PROBLÈME IDENTIFIÉ :');
      console.log('   Aucun template utilisateur prêt !');
      console.log('   Impossible de créer des VPS sans template.');
      
      console.log('\n🛠️ SOLUTION :');
      console.log('   1. Allez sur : http://172.21.23.1:8080/client');
      console.log('   2. Connectez-vous avec vos credentials CloudStack');
      console.log('   3. Templates → Register Template');
      console.log('   4. Ajoutez une image Ubuntu/CentOS');
      console.log('   5. Attendez que le template soit prêt');
      console.log('   6. Votre portail pourra créer des VPS !');
      
      console.log('\n💡 ALTERNATIVE :');
      console.log('   Téléchargez une image Ubuntu localement et ajoutez-la');
      console.log('   Exemple : ubuntu-22.04-server-cloudimg-amd64.img');
    } else {
      console.log('\n✅ TEMPLATES PRÊTS !');
      console.log('   Vous pouvez maintenant créer des VPS depuis votre portail !');
    }

    // Vérifier les instances existantes
    console.log('\n🖥️ Instances existantes :');
    const instances = await cloudstackAPI.getVirtualMachines();
    console.log(`   Total: ${instances.length} instances`);
    instances.forEach(instance => {
      console.log(`   - ${instance.name} (${instance.state})`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 RÉSUMÉ :');
  console.log('   ❌ Votre portail ne peut pas créer de templates');
  console.log('   ✅ Vous DEVEZ les ajouter dans CloudStack');
  console.log('   🔗 Une fois ajoutés, votre portail les utilise automatiquement');
  console.log('   🚀 C\'est comme installer des logiciels sur Windows :');
  console.log('      Windows = CloudStack (système)');
  console.log('      Votre app = Portail (interface)');
}

// Exécution du script
explainPortalVsCloudStack().catch(console.error);
