const cloudstackAPI = require('./cloudstack-api');

async function cleanupTestVPS() {
  console.log('🧹 Nettoyage des VPS de test...\n');

  try {
    // Récupérer toutes les instances
    console.log('🔍 Récupération des instances...');
    const instances = await cloudstackAPI.getVirtualMachines();
    console.log(`📋 ${instances.length} instances trouvées`);

    if (instances.length === 0) {
      console.log('✅ Aucune instance à nettoyer');
      return;
    }

    // Filtrer les VPS de test (ceux qui commencent par "test-vps-")
    const testInstances = instances.filter(instance => 
      instance.name && instance.name.startsWith('test-vps-')
    );

    console.log(`🔍 ${testInstances.length} VPS de test trouvés`);

    if (testInstances.length === 0) {
      console.log('✅ Aucun VPS de test à nettoyer');
      return;
    }

    // Supprimer chaque VPS de test
    for (const instance of testInstances) {
      try {
        console.log(`🗑️ Suppression de ${instance.name} (ID: ${instance.id})...`);
        
        // Arrêter d'abord si en cours d'exécution
        if (instance.state === 'Running') {
          console.log(`   ⏹️ Arrêt de l'instance...`);
          await cloudstackAPI.stopVirtualMachine(instance.id);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Attendre l'arrêt
        }

        // Supprimer l'instance
        const result = await cloudstackAPI.destroyVirtualMachine(instance.id);
        console.log(`✅ ${instance.name} supprimé avec succès`);
        
      } catch (error) {
        console.error(`❌ Erreur lors de la suppression de ${instance.name}:`, error.message);
      }
    }

    console.log('\n🎉 Nettoyage terminé !');
    
    // Vérifier le résultat final
    const remainingInstances = await cloudstackAPI.getVirtualMachines();
    console.log(`📋 ${remainingInstances.length} instances restantes`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error.message);
  }
}

// Exécution du script
cleanupTestVPS().catch(console.error);
