import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/global';

async function testVolumeRoutes() {
  console.log('🧪 Test des routes de volumes CloudStack\n');
  console.log('=' .repeat(60));

  try {
    // 1. Tester la route GET /cloudstack/volumes
    console.log('\n📋 1. Test GET /cloudstack/volumes...');
    try {
      const volumesRes = await axios.get(`${API_BASE_URL}/cloudstack/volumes`);
      console.log('✅ Route GET /cloudstack/volumes fonctionne');
      console.log(`📊 ${volumesRes.data.length} volumes trouvés`);
    } catch (error) {
      console.log('❌ Route GET /cloudstack/volumes ne fonctionne pas:', error.response?.status, error.message);
    }

    // 2. Tester la route GET /cloudstack/zones
    console.log('\n🌍 2. Test GET /cloudstack/zones...');
    try {
      const zonesRes = await axios.get(`${API_BASE_URL}/cloudstack/zones`);
      console.log('✅ Route GET /cloudstack/zones fonctionne');
      console.log(`📊 ${zonesRes.data.length} zones trouvées`);
    } catch (error) {
      console.log('❌ Route GET /cloudstack/zones ne fonctionne pas:', error.response?.status, error.message);
    }

    // 3. Tester la route POST /cloudstack/volumes
    console.log('\n🚀 3. Test POST /cloudstack/volumes...');
    try {
      const zonesRes = await axios.get(`${API_BASE_URL}/cloudstack/zones`);
      if (zonesRes.data.length > 0) {
        const volumeData = {
          name: `test-volume-${Date.now()}`,
          size: 10,
          zoneid: zonesRes.data[0].id,
          diskofferingid: null
        };
        
        console.log('📋 Données du volume:', volumeData);
        
        const createRes = await axios.post(`${API_BASE_URL}/cloudstack/volumes`, volumeData);
        console.log('✅ Route POST /cloudstack/volumes fonctionne');
        console.log('📊 Volume créé:', createRes.data);
        
        // 4. Tester la suppression
        if (createRes.data && createRes.data.id) {
          console.log('\n🗑️ 4. Test DELETE /cloudstack/volumes/:id...');
          try {
            await axios.delete(`${API_BASE_URL}/cloudstack/volumes/${createRes.data.id}`);
            console.log('✅ Route DELETE /cloudstack/volumes/:id fonctionne');
          } catch (deleteError) {
            console.log('⚠️ Route DELETE /cloudstack/volumes/:id:', deleteError.response?.status, deleteError.message);
          }
        }
      } else {
        console.log('❌ Aucune zone disponible pour tester la création');
      }
    } catch (error) {
      console.log('❌ Route POST /cloudstack/volumes ne fonctionne pas:', error.response?.status, error.message);
      if (error.response?.data) {
        console.log('📋 Détails de l\'erreur:', error.response.data);
      }
    }

    // 5. Tester les routes d'attachement/détachement
    console.log('\n🔗 5. Test des routes d\'attachement...');
    try {
      await axios.post(`${API_BASE_URL}/cloudstack/volumes/test-id/attach`, { vmId: 'test-vm-id' });
      console.log('✅ Route POST /cloudstack/volumes/:id/attach fonctionne');
    } catch (error) {
      console.log('⚠️ Route POST /cloudstack/volumes/:id/attach:', error.response?.status, error.message);
    }

    try {
      await axios.post(`${API_BASE_URL}/cloudstack/volumes/test-id/detach`);
      console.log('✅ Route POST /cloudstack/volumes/:id/detach fonctionne');
    } catch (error) {
      console.log('⚠️ Route POST /cloudstack/volumes/:id/detach:', error.response?.status, error.message);
    }

    console.log('\n🎉 Test des routes terminé !');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    console.log('\n💡 Vérifiez que:');
    console.log('   • Le backend Node.js est démarré (port 3001)');
    console.log('   • Les routes sont correctement configurées');
    console.log('   • CloudStack est accessible');
  }
}

// Lancer le test
testVolumeRoutes();
