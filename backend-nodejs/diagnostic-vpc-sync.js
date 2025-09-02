const cloudstackAPI = require('./cloudstack-api');
const db = require('./db');

async function diagnosticVPCSync() {
  console.log('🔍 Diagnostic de synchronisation VPC entre le portail et CloudStack\n');

  try {
    // 1. Vérifier les VPCs dans CloudStack
    console.log('📋 1. Vérification des VPCs dans CloudStack');
    console.log('=' .repeat(60));
    const cloudstackVPCs = await cloudstackAPI.getVPCs();
    console.log(`✅ CloudStack: ${cloudstackVPCs.length} VPCs trouvés`);
    
    if (cloudstackVPCs.length > 0) {
      console.log('VPCs CloudStack:');
      cloudstackVPCs.forEach((vpc, index) => {
        console.log(`   ${index + 1}. ID: ${vpc.id}, Name: ${vpc.name}, State: ${vpc.state}`);
      });
    } else {
      console.log('   Aucun VPC trouvé dans CloudStack');
    }
    console.log();

    // 2. Vérifier les VPCs dans la base de données locale
    console.log('📋 2. Vérification des VPCs dans la base de données locale');
    console.log('=' .repeat(60));
    try {
      const [dbVPCs] = await db.query(`
        SELECT v.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
        FROM vpcs v 
        LEFT JOIN accounts a ON v.account_id = a.id 
        LEFT JOIN domains d ON v.domain_id = d.id 
        LEFT JOIN zones z ON v.zone_id = z.id
      `);
      console.log(`✅ Base de données: ${dbVPCs.length} VPCs trouvés`);
      
      if (dbVPCs.length > 0) {
        console.log('VPCs Base de données:');
        dbVPCs.forEach((vpc, index) => {
          console.log(`   ${index + 1}. ID: ${vpc.id}, Name: ${vpc.name}, State: ${vpc.state}, Account: ${vpc.account_name}`);
        });
      } else {
        console.log('   Aucun VPC trouvé dans la base de données locale');
      }
    } catch (dbError) {
      console.log('❌ Erreur base de données:', dbError.message);
      console.log('   La table vpcs n\'existe peut-être pas ou la connexion DB échoue');
    }
    console.log();

    // 3. Vérifier les comptes et domaines
    console.log('📋 3. Vérification des comptes et domaines');
    console.log('=' .repeat(60));
    
    // Comptes CloudStack
    try {
      const cloudstackAccounts = await cloudstackAPI.getAccounts();
      console.log(`✅ CloudStack: ${cloudstackAccounts.length} comptes trouvés`);
      if (cloudstackAccounts.length > 0) {
        console.log('Comptes CloudStack:');
        cloudstackAccounts.slice(0, 5).forEach((account, index) => {
          console.log(`   ${index + 1}. Name: ${account.name}, Type: ${account.type}, State: ${account.state}`);
        });
        if (cloudstackAccounts.length > 5) {
          console.log(`   ... et ${cloudstackAccounts.length - 5} autres`);
        }
      }
    } catch (error) {
      console.log('❌ Erreur récupération comptes CloudStack:', error.message);
    }
    console.log();

    // Domaines CloudStack
    try {
      const cloudstackDomains = await cloudstackAPI.getDomains();
      console.log(`✅ CloudStack: ${cloudstackDomains.length} domaines trouvés`);
      if (cloudstackDomains.length > 0) {
        console.log('Domaines CloudStack:');
        cloudstackDomains.slice(0, 5).forEach((domain, index) => {
          console.log(`   ${index + 1}. ID: ${domain.id}, Name: ${domain.name}, Path: ${domain.path}`);
        });
        if (cloudstackDomains.length > 5) {
          console.log(`   ... et ${cloudstackDomains.length - 5} autres`);
        }
      }
    } catch (error) {
      console.log('❌ Erreur récupération domaines CloudStack:', error.message);
    }
    console.log();

    // 4. Vérifier les permissions de l'utilisateur CloudStack
    console.log('📋 4. Vérification des permissions utilisateur CloudStack');
    console.log('=' .repeat(60));
    
    try {
      // Tenter de créer un VPC de test pour vérifier les permissions
      const testVPCData = {
        name: `test-vpc-diagnostic-${Date.now()}`,
        displaytext: 'VPC de test pour diagnostic',
        cidr: '10.0.0.0/16',
        vpcofferingid: cloudstackVPCs.length > 0 ? cloudstackVPCs[0].vpcofferingid : 'test-offering',
        zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6'
      };
      
      console.log('🔧 Test de création de VPC...');
      const createResult = await cloudstackAPI.createVPC(testVPCData);
      console.log('✅ Permissions OK - VPC de test créé avec succès');
      console.log('   VPC créé:', createResult);
      
      // Supprimer le VPC de test
      console.log('🗑️ Suppression du VPC de test...');
      await cloudstackAPI.deleteVPC(createResult.id || createResult.vpc.id);
      console.log('✅ VPC de test supprimé');
      
    } catch (error) {
      console.log('❌ Erreur permissions:', error.message);
      if (error.message.includes('401')) {
        console.log('   🔐 Problème d\'authentification - Vérifiez les clés API');
      } else if (error.message.includes('533')) {
        console.log('   🚫 Problème de permissions - L\'utilisateur n\'a pas les droits');
      } else if (error.message.includes('432')) {
        console.log('   📋 Problème de paramètres - Vérifiez les offerings et zones');
      }
    }
    console.log();

    // 5. Vérifier la configuration CloudStack
    console.log('📋 5. Vérification de la configuration CloudStack');
    console.log('=' .repeat(60));
    
    console.log('🔧 Configuration actuelle:');
    console.log(`   API URL: ${process.env.CLOUDSTACK_API_URL || 'Non configuré'}`);
    console.log(`   API Key: ${process.env.CLOUDSTACK_API_KEY ? 'Configuré' : 'Non configuré'}`);
    console.log(`   Secret Key: ${process.env.CLOUDSTACK_SECRET_KEY ? 'Configuré' : 'Non configuré'}`);
    console.log(`   Timeout: ${process.env.CLOUDSTACK_TIMEOUT || '30000'}ms`);
    console.log();

    // 6. Vérifier les VPC offerings disponibles
    console.log('📋 6. Vérification des VPC offerings disponibles');
    console.log('=' .repeat(60));
    
    try {
      const vpcOfferings = await cloudstackAPI.makeRequest('listVPCOfferings');
      const offerings = vpcOfferings.listvpcofferingsresponse?.vpcoffering || [];
      console.log(`✅ ${offerings.length} VPC offerings disponibles`);
      
      if (offerings.length > 0) {
        console.log('VPC Offerings:');
        offerings.forEach((offering, index) => {
          console.log(`   ${index + 1}. ID: ${offering.id}, Name: ${offering.name}, State: ${offering.state}`);
        });
      }
    } catch (error) {
      console.log('❌ Erreur récupération VPC offerings:', error.message);
    }
    console.log();

    // 7. Analyse et recommandations
    console.log('📋 7. Analyse et recommandations');
    console.log('=' .repeat(60));
    
    let dbVPCs = [];
    try {
      const [dbResult] = await db.query(`
        SELECT v.*, a.name as account_name, d.name as domain_name, z.name as zone_name 
        FROM vpcs v 
        LEFT JOIN accounts a ON v.account_id = a.id 
        LEFT JOIN domains d ON v.domain_id = d.id 
        LEFT JOIN zones z ON v.zone_id = z.id
      `);
      dbVPCs = dbResult;
    } catch (dbError) {
      console.log('   Base de données non accessible:', dbError.message);
    }
    
    if (cloudstackVPCs.length === 0 && dbVPCs && dbVPCs.length > 0) {
      console.log('🔍 PROBLÈME IDENTIFIÉ:');
      console.log('   Les VPCs existent dans la base de données locale mais pas dans CloudStack');
      console.log('   Cela indique un problème de synchronisation.');
      console.log('');
      console.log('💡 SOLUTIONS POSSIBLES:');
      console.log('   1. Vérifiez que les VPCs ont été créés avec les bons paramètres CloudStack');
      console.log('   2. Vérifiez les permissions de l\'utilisateur CloudStack');
      console.log('   3. Vérifiez que les VPC offerings et zones sont corrects');
      console.log('   4. Synchronisez manuellement les VPCs du portail vers CloudStack');
    } else if (cloudstackVPCs.length === 0 && (!dbVPCs || dbVPCs.length === 0)) {
      console.log('✅ SITUATION NORMALE:');
      console.log('   Aucun VPC n\'existe ni dans CloudStack ni dans la base de données locale');
      console.log('   Vous pouvez créer de nouveaux VPCs.');
    } else if (cloudstackVPCs.length > 0) {
      console.log('✅ VPCs TROUVÉS:');
      console.log('   Les VPCs existent dans CloudStack et sont accessibles.');
    }
    
    console.log('');
    console.log('🛠️ PROCHAINES ÉTAPES:');
    console.log('   1. Vérifiez les logs du portail pour les erreurs de création');
    console.log('   2. Testez la création d\'un VPC directement via l\'API CloudStack');
    console.log('   3. Vérifiez la configuration des VPC offerings dans CloudStack');
    console.log('   4. Synchronisez les données si nécessaire');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Fonction pour synchroniser les VPCs du portail vers CloudStack
async function syncVPCsToCloudStack() {
  console.log('\n🔄 Synchronisation des VPCs du portail vers CloudStack\n');
  
  try {
    // Récupérer les VPCs de la base de données
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
        
        // Récupérer les VPC offerings disponibles
        const vpcOfferings = await cloudstackAPI.makeRequest('listVPCOfferings');
        const offerings = vpcOfferings.listvpcofferingsresponse?.vpcoffering || [];
        
        if (offerings.length === 0) {
          console.log(`   ❌ Aucun VPC offering disponible`);
          continue;
        }
        
        // Utiliser le premier VPC offering disponible
        const vpcOffering = offerings[0];
        
        // Créer le VPC dans CloudStack
        const vpcData = {
          name: vpc.name,
          displaytext: vpc.description || vpc.name,
          cidr: vpc.cidr || '10.0.0.0/16',
          vpcofferingid: vpcOffering.id,
          zoneid: '28e45a8a-e1a3-43c2-8174-8061f5ac83b6' // Zone par défaut
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

// Exécuter le diagnostic
async function runDiagnostic() {
  await diagnosticVPCSync();
  
  // Demander si l'utilisateur veut synchroniser
  console.log('\n🔄 Voulez-vous synchroniser les VPCs du portail vers CloudStack ?');
  console.log('   (Cette fonctionnalité sera implémentée dans une version future)');
}

// Vérifier si le script est exécuté directement
if (require.main === module) {
  runDiagnostic().catch(console.error);
}

module.exports = {
  diagnosticVPCSync,
  syncVPCsToCloudStack,
  runDiagnostic
};
