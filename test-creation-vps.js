import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/global';

async function testVPSCreation() {
  console.log('🧪 Test de création de VPS et affichage dans le dashboard\n');

  try {
    // 1. Récupérer les ressources nécessaires
    console.log('📋 1. Récupération des ressources CloudStack...');
    
    const [templatesRes, offeringsRes, zonesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/cloudstack/templates`),
      axios.get(`${API_BASE_URL}/cloudstack/service-offerings`),
      axios.get(`${API_BASE_URL}/cloudstack/zones`)
    ]);

    const templates = templatesRes.data;
    const offerings = offeringsRes.data;
    const zones = zonesRes.data;

    console.log(`✅ Templates disponibles: ${templates.length}`);
    console.log(`✅ Offerings disponibles: ${offerings.length}`);
    console.log(`✅ Zones disponibles: ${zones.length}`);

    if (templates.length === 0 || offerings.length === 0 || zones.length === 0) {
      console.log('❌ Ressources insuffisantes pour créer un VPS');
      return;
    }

    // 2. Créer un nouveau VPS
    console.log('\n🚀 2. Création d\'un nouveau VPS...');
    
    const vmData = {
      name: `test-vps-${Date.now()}`,
      displayname: `VPS Test ${new Date().toLocaleDateString()}`,
      templateid: templates[0].id,
      serviceofferingid: offerings[0].id,
      zoneid: zones[0].id,
      startvm: false
    };

    console.log('📋 Données du VPS:', vmData);

    const createRes = await axios.post(`${API_BASE_URL}/cloudstack/virtual-machines`, vmData);
    const createdVM = createRes.data;

    console.log('✅ VPS créé avec succès !');
    console.log('📊 Détails du VPS créé:', {
      id: createdVM.id,
      name: createdVM.name,
      displayname: createdVM.displayname,
      state: createdVM.state
    });

    // 3. Attendre un peu puis vérifier que le VPS apparaît dans la liste
    console.log('\n⏳ 3. Attente de 5 secondes...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 4. Vérifier que le VPS apparaît dans la liste des instances
    console.log('\n🔍 4. Vérification de la liste des instances...');
    
    const instancesRes = await axios.get(`${API_BASE_URL}/cloudstack/virtual-machines`);
    const instances = instancesRes.data;

    console.log(`📋 ${instances.length} instances trouvées`);
    
    const newInstance = instances.find(instance => instance.id === createdVM.id);
    
    if (newInstance) {
      console.log('✅ Le VPS créé apparaît bien dans la liste !');
      console.log('📊 Détails dans la liste:', {
        id: newInstance.id,
        name: newInstance.name,
        displayname: newInstance.displayname,
        state: newInstance.state,
        account: newInstance.account
      });
    } else {
      console.log('❌ Le VPS créé n\'apparaît pas dans la liste');
    }

    // 5. Tester les actions sur le VPS
    console.log('\n🎮 5. Test des actions sur le VPS...');
    
    try {
      // Démarrer le VPS
      console.log('▶️ Démarrage du VPS...');
      await axios.post(`${API_BASE_URL}/cloudstack/virtual-machines/${createdVM.id}/start`);
      console.log('✅ VPS démarré avec succès');
      
      // Attendre un peu
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Arrêter le VPS
      console.log('⏹️ Arrêt du VPS...');
      await axios.post(`${API_BASE_URL}/cloudstack/virtual-machines/${createdVM.id}/stop`);
      console.log('✅ VPS arrêté avec succès');
      
    } catch (actionError) {
      console.log('⚠️ Erreur lors des actions (normal si le VPS est en cours de création):', actionError.message);
    }

    // 6. Vérifier les statistiques du dashboard
    console.log('\n📊 6. Vérification des statistiques du dashboard...');
    
    const statsRes = await axios.get(`${API_BASE_URL}/cloudstack/stats`);
    const stats = statsRes.data;

    console.log('📈 Statistiques CloudStack:', {
      instances: stats.instances,
      domains: stats.domains,
      accounts: stats.accounts,
      networks: stats.networks
    });

    console.log('\n🎉 Test terminé avec succès !');
    console.log('💡 Le VPS créé devrait maintenant apparaître dans la section "VPS gérés" du dashboard');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Lancer le test
testVPSCreation();
