import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/global';

async function diagnosticCloudStack() {
  console.log('🔍 Diagnostic complet de CloudStack\n');
  console.log('=' .repeat(60));

  try {
    // 1. Statistiques générales
    console.log('\n📊 1. STATISTIQUES GÉNÉRALES');
    console.log('-'.repeat(40));
    
    const statsRes = await axios.get(`${API_BASE_URL}/cloudstack/stats`);
    const stats = statsRes.data;
    
    console.log('📈 Statistiques CloudStack:');
    console.log(`   • Domaines: ${stats.domains}`);
    console.log(`   • Comptes: ${stats.accounts}`);
    console.log(`   • Projets: ${stats.projects}`);
    console.log(`   • Instances: ${stats.instances}`);
    console.log(`   • Volumes: ${stats.volumes}`);
    console.log(`   • Réseaux: ${stats.networks}`);
    console.log(`   • Groupes de sécurité: ${stats.securityGroups}`);

    // 2. Templates disponibles
    console.log('\n📦 2. TEMPLATES DISPONIBLES');
    console.log('-'.repeat(40));
    
    const templatesRes = await axios.get(`${API_BASE_URL}/cloudstack/templates`);
    const templates = templatesRes.data;
    
    if (templates.length === 0) {
      console.log('❌ Aucun template disponible');
      console.log('💡 Solution: Créer des templates dans CloudStack');
    } else {
      console.log(`✅ ${templates.length} templates trouvés:`);
      templates.forEach((template, index) => {
        console.log(`   ${index + 1}. ${template.name} (${template.displaytext})`);
        console.log(`      ID: ${template.id} | Format: ${template.format} | Hypervisor: ${template.hypervisor}`);
        console.log(`      Public: ${template.ispublic} | Featured: ${template.isfeatured}`);
      });
    }

    // 3. Offres de service
    console.log('\n⚙️ 3. OFFRES DE SERVICE');
    console.log('-'.repeat(40));
    
    const offeringsRes = await axios.get(`${API_BASE_URL}/cloudstack/service-offerings`);
    const offerings = offeringsRes.data;
    
    if (offerings.length === 0) {
      console.log('❌ Aucune offre de service disponible');
      console.log('💡 Solution: Configurer des Service Offerings dans CloudStack');
    } else {
      console.log(`✅ ${offerings.length} offres de service trouvées:`);
      offerings.forEach((offering, index) => {
        console.log(`   ${index + 1}. ${offering.name} (${offering.displaytext})`);
        console.log(`      ID: ${offering.id} | CPU: ${offering.cpunumber} | RAM: ${offering.memory}MB`);
        console.log(`      Type: ${offering.iscustomized ? 'Personnalisé' : 'Standard'}`);
      });
    }

    // 4. Zones disponibles
    console.log('\n🌍 4. ZONES DISPONIBLES');
    console.log('-'.repeat(40));
    
    const zonesRes = await axios.get(`${API_BASE_URL}/cloudstack/zones`);
    const zones = zonesRes.data;
    
    if (zones.length === 0) {
      console.log('❌ Aucune zone disponible');
      console.log('💡 Solution: Activer des zones dans CloudStack');
    } else {
      console.log(`✅ ${zones.length} zones trouvées:`);
      zones.forEach((zone, index) => {
        console.log(`   ${index + 1}. ${zone.name} (${zone.displaytext})`);
        console.log(`      ID: ${zone.id} | Statut: ${zone.state} | Type: ${zone.networktype}`);
      });
    }

    // 5. Instances existantes
    console.log('\n🖥️ 5. INSTANCES EXISTANTES');
    console.log('-'.repeat(40));
    
    const instancesRes = await axios.get(`${API_BASE_URL}/cloudstack/virtual-machines`);
    const instances = instancesRes.data;
    
    if (instances.length === 0) {
      console.log('ℹ️ Aucune instance existante');
    } else {
      console.log(`📋 ${instances.length} instances trouvées:`);
      instances.forEach((instance, index) => {
        console.log(`   ${index + 1}. ${instance.name} (${instance.displayname})`);
        console.log(`      ID: ${instance.id} | Statut: ${instance.state} | Compte: ${instance.account}`);
        console.log(`      Template: ${instance.templatename} | Zone: ${instance.zonename}`);
      });
    }

    // 6. Réseaux disponibles
    console.log('\n🌐 6. RÉSEAUX DISPONIBLES');
    console.log('-'.repeat(40));
    
    const networksRes = await axios.get(`${API_BASE_URL}/cloudstack/networks`);
    const networks = networksRes.data;
    
    if (networks.length === 0) {
      console.log('ℹ️ Aucun réseau configuré');
    } else {
      console.log(`✅ ${networks.length} réseaux trouvés:`);
      networks.forEach((network, index) => {
        console.log(`   ${index + 1}. ${network.name} (${network.displaytext})`);
        console.log(`      ID: ${network.id} | Type: ${network.type} | Zone: ${network.zonename}`);
      });
    }

    // 7. Résumé et recommandations
    console.log('\n📋 7. RÉSUMÉ ET RECOMMANDATIONS');
    console.log('-'.repeat(40));
    
    const canCreateVPS = templates.length > 0 && offerings.length > 0 && zones.length > 0;
    
    if (canCreateVPS) {
      console.log('✅ Votre CloudStack est prêt pour créer des VPS !');
      console.log('🎯 Vous pouvez maintenant créer des VPS via le portail');
    } else {
      console.log('❌ Votre CloudStack n\'est pas encore configuré pour créer des VPS');
      console.log('\n🔧 Actions nécessaires:');
      
      if (templates.length === 0) {
        console.log('   • Créer au moins un template dans CloudStack');
        console.log('   • Ou télécharger un template depuis le marketplace');
      }
      
      if (offerings.length === 0) {
        console.log('   • Configurer des Service Offerings dans CloudStack');
        console.log('   • Définir des configurations CPU/RAM');
      }
      
      if (zones.length === 0) {
        console.log('   • Activer au moins une zone dans CloudStack');
        console.log('   • Configurer les ressources de la zone');
      }
    }

    console.log('\n🎉 Diagnostic terminé !');
    console.log('=' .repeat(60));

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error.response?.data || error.message);
    console.log('\n💡 Vérifiez que:');
    console.log('   • Le backend Node.js est démarré (port 3001)');
    console.log('   • CloudStack est accessible');
    console.log('   • Les variables d\'environnement sont configurées');
  }
}

// Lancer le diagnostic
diagnosticCloudStack();
