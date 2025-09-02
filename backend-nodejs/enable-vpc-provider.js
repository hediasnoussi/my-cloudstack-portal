const cloudstackAPI = require('./cloudstack-api');

async function enableVPCProvider() {
  console.log('🔧 Activation du provider VpcVirtualRouter\n');

  try {
    // 1. Identifier le provider VpcVirtualRouter
    console.log('📋 1. Identification du provider VpcVirtualRouter');
    console.log('=' .repeat(50));
    
    const providers = await cloudstackAPI.makeRequest('listNetworkServiceProviders', {
      zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6'
    });
    
    const serviceProviders = providers.listnetworkserviceprovidersresponse?.networkserviceprovider || [];
    const vpcProvider = serviceProviders.find(p => p.name === 'VpcVirtualRouter');
    
    if (!vpcProvider) {
      console.log('❌ Provider VpcVirtualRouter non trouvé');
      return;
    }
    
    console.log(`✅ Provider trouvé: ${vpcProvider.name} (${vpcProvider.id})`);
    console.log(`   State actuel: ${vpcProvider.state}`);
    console.log();

    // 2. Activer le provider
    console.log('📋 2. Activation du provider');
    console.log('=' .repeat(50));
    
    if (vpcProvider.state === 'Enabled') {
      console.log('✅ Provider déjà activé');
    } else {
      console.log('🔄 Activation du provider...');
      
      try {
        const result = await cloudstackAPI.makeRequest('updateNetworkServiceProvider', {
          id: vpcProvider.id,
          state: 'Enabled'
        });
        
        console.log('✅ Provider activé avec succès !');
        console.log('📊 Résultat:', JSON.stringify(result, null, 2));
      } catch (error) {
        console.log('❌ Erreur lors de l\'activation:', error.message);
        console.log('   Vous n\'avez peut-être pas les droits d\'administrateur');
        return;
      }
    }
    console.log();

    // 3. Vérifier l'activation
    console.log('📋 3. Vérification de l\'activation');
    console.log('=' .repeat(50));
    
    // Attendre un peu pour que CloudStack traite l'activation
    console.log('⏳ Attente de 10 secondes pour le traitement...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const updatedProviders = await cloudstackAPI.makeRequest('listNetworkServiceProviders', {
      zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6'
    });
    
    const updatedServiceProviders = updatedProviders.listnetworkserviceprovidersresponse?.networkserviceprovider || [];
    const updatedVpcProvider = updatedServiceProviders.find(p => p.name === 'VpcVirtualRouter');
    
    if (updatedVpcProvider && updatedVpcProvider.state === 'Enabled') {
      console.log('✅ Provider VpcVirtualRouter activé avec succès !');
    } else {
      console.log('⚠️ Provider pas encore activé ou erreur');
    }
    console.log();

    // 4. Tester la création d'un VPC
    console.log('📋 4. Test de création de VPC');
    console.log('=' .repeat(50));
    
    const testVPCData = {
      name: `test-vpc-after-enable-${Date.now()}`,
      displaytext: 'Test VPC après activation du provider',
      cidr: '10.0.0.0/16',
      vpcofferingid: 'b1a77c5e-2fa8-4821-8fe9-7ab193489287',
      zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6'
    };
    
    console.log('🧪 Test de création de VPC...');
    const createResult = await cloudstackAPI.createVPC(testVPCData);
    console.log('✅ VPC créé avec succès !');
    console.log('📊 Résultat:', JSON.stringify(createResult, null, 2));
    console.log();

    // 5. Nettoyer - Supprimer le VPC de test
    console.log('📋 5. Nettoyage');
    console.log('=' .repeat(50));
    
    const vpcId = createResult.id || createResult.vpc?.id;
    if (vpcId) {
      console.log('🗑️ Suppression du VPC de test...');
      await cloudstackAPI.deleteVPC(vpcId);
      console.log('✅ VPC de test supprimé');
    }
    console.log();

    // 6. Résumé
    console.log('📋 6. Résumé');
    console.log('=' .repeat(50));
    console.log('🎉 SUCCÈS !');
    console.log('✅ Provider VpcVirtualRouter activé');
    console.log('✅ Création de VPC fonctionnelle');
    console.log('✅ Votre portail peut maintenant créer des VPCs dans CloudStack');
    console.log('');
    console.log('🔄 PROCHAINES ÉTAPES:');
    console.log('   1. Synchronisez les VPCs existants du portail vers CloudStack');
    console.log('   2. Testez la création de VPCs depuis votre interface');
    console.log('   3. Vérifiez que les VPCs apparaissent dans CloudStack');

  } catch (error) {
    console.error('❌ Erreur lors de l\'activation:', error);
    
    if (error.message.includes('401')) {
      console.log('\n🔐 ERREUR D\'AUTORISATION:');
      console.log('   Vous n\'avez pas les droits d\'administrateur CloudStack');
      console.log('   Contactez votre administrateur CloudStack pour activer le provider');
    } else if (error.message.includes('431')) {
      console.log('\n🔧 ERREUR DE CONFIGURATION:');
      console.log('   Le provider n\'est pas encore complètement activé');
      console.log('   Attendez quelques minutes et relancez le test');
    }
  }
}

// Fonction pour synchroniser les VPCs existants
async function syncExistingVPCs() {
  console.log('\n🔄 Synchronisation des VPCs existants du portail vers CloudStack\n');
  
  try {
    // Récupérer les VPCs de la base de données locale
    const db = require('./db');
    const [dbVPCs] = await db.query(`
      SELECT v.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
      FROM vpcs v 
      LEFT JOIN accounts a ON v.account_id = a.id 
      LEFT JOIN domains d ON v.domain_id = d.id 
      LEFT JOIN zones z ON v.zone_id = z.id
      WHERE v.cloudstack_id IS NULL OR v.cloudstack_id = ''
    `);
    
    if (dbVPCs.length === 0) {
      console.log('✅ Aucun VPC à synchroniser');
      return;
    }
    
    console.log(`📋 ${dbVPCs.length} VPCs à synchroniser vers CloudStack`);
    
    for (const vpc of dbVPCs) {
      try {
        console.log(`\n🔄 Synchronisation du VPC: ${vpc.name}`);
        
        // Créer le VPC dans CloudStack
        const vpcData = {
          name: vpc.name,
          displaytext: vpc.description || vpc.name,
          cidr: vpc.cidr || '10.0.0.0/16',
          vpcofferingid: 'b1a77c5e-2fa8-4821-8fe9-7ab193489287',
          zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6'
        };
        
        console.log(`   📋 Création avec les paramètres:`, vpcData);
        
        const result = await cloudstackAPI.createVPC(vpcData);
        const cloudstackId = result.id || result.vpc?.id;
        
        if (cloudstackId) {
          // Mettre à jour la base de données avec l'ID CloudStack
          await db.query(
            'UPDATE vpcs SET cloudstack_id = ?, state = ? WHERE id = ?',
            [cloudstackId, 'Created', vpc.id]
          );
          
          console.log(`   ✅ VPC créé dans CloudStack avec l'ID: ${cloudstackId}`);
        } else {
          console.log(`   ❌ Erreur lors de la création du VPC`);
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur lors de la synchronisation: ${error.message}`);
      }
    }
    
    console.log('\n✅ Synchronisation terminée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
  }
}

// Exécuter l'activation
async function runActivation() {
  await enableVPCProvider();
  
  console.log('\n🔄 Voulez-vous synchroniser les VPCs existants ?');
  console.log('   Exécutez: node enable-vpc-provider.js --sync');
}

// Vérifier les arguments de ligne de commande
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--sync')) {
    syncExistingVPCs().catch(console.error);
  } else {
    runActivation().catch(console.error);
  }
}

module.exports = {
  enableVPCProvider,
  syncExistingVPCs,
  runActivation
};
