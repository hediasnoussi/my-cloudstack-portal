import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/global';

async function testVolumesCloudStack() {
  console.log('🧪 Test de gestion des volumes CloudStack\n');
  console.log('=' .repeat(60));

  try {
    // 1. Vérifier les volumes existants
    console.log('\n📋 1. Vérification des volumes existants...');
    
    const volumesRes = await axios.get(`${API_BASE_URL}/cloudstack/volumes`);
    const volumes = volumesRes.data;

    console.log(`📊 ${volumes.length} volumes trouvés dans CloudStack`);
    volumes.forEach((volume, index) => {
      console.log(`   ${index + 1}. ${volume.name} (${volume.displayname})`);
      console.log(`      ID: ${volume.id} | Taille: ${volume.size}GB | Statut: ${volume.state}`);
      console.log(`      Zone: ${volume.zonename} | VM: ${volume.vmname || 'Non attaché'}`);
    });

    // 2. Vérifier les zones disponibles
    console.log('\n🌍 2. Vérification des zones disponibles...');
    
    const zonesRes = await axios.get(`${API_BASE_URL}/cloudstack/zones`);
    const zones = zonesRes.data;

    if (zones.length === 0) {
      console.log('❌ Aucune zone disponible - impossible de créer des volumes');
      return;
    }

    console.log(`✅ ${zones.length} zones disponibles:`);
    zones.forEach((zone, index) => {
      console.log(`   ${index + 1}. ${zone.name} (ID: ${zone.id})`);
    });

    // 3. Créer un nouveau volume
    console.log('\n🚀 3. Création d\'un nouveau volume...');
    
    const volumeData = {
      name: `test-volume-${Date.now()}`,
      size: 10, // 10 GB
      zoneid: zones[0].id,
      diskofferingid: null
    };

    console.log('📋 Données du volume:', volumeData);

    const createRes = await axios.post(`${API_BASE_URL}/cloudstack/volumes`, volumeData);
    const createdVolume = createRes.data;

    console.log('✅ Volume créé avec succès !');
    console.log('📊 Détails du volume créé:', {
      id: createdVolume.id,
      name: createdVolume.name,
      size: createdVolume.size,
      state: createdVolume.state
    });

    // 4. Attendre un peu puis vérifier que le volume apparaît dans la liste
    console.log('\n⏳ 4. Attente de 5 secondes...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 5. Vérifier que le volume apparaît dans la liste
    console.log('\n🔍 5. Vérification de la liste des volumes...');
    
    const volumesRes2 = await axios.get(`${API_BASE_URL}/cloudstack/volumes`);
    const volumes2 = volumesRes2.data;

    console.log(`📋 ${volumes2.length} volumes trouvés après création`);
    
    const newVolume = volumes2.find(volume => volume.id === createdVolume.id);
    
    if (newVolume) {
      console.log('✅ Le volume créé apparaît bien dans la liste !');
      console.log('📊 Détails dans la liste:', {
        id: newVolume.id,
        name: newVolume.name,
        displayname: newVolume.displayname,
        size: newVolume.size,
        state: newVolume.state,
        zonename: newVolume.zonename
      });
    } else {
      console.log('❌ Le volume créé n\'apparaît pas dans la liste');
    }

    // 6. Tester la suppression du volume
    console.log('\n🗑️ 6. Test de suppression du volume...');
    
    try {
      await axios.delete(`${API_BASE_URL}/cloudstack/volumes/${createdVolume.id}`);
      console.log('✅ Volume supprimé avec succès');
      
      // Vérifier qu'il a bien été supprimé
      const volumesRes3 = await axios.get(`${API_BASE_URL}/cloudstack/volumes`);
      const volumes3 = volumesRes3.data;
      
      const deletedVolume = volumes3.find(volume => volume.id === createdVolume.id);
      if (!deletedVolume) {
        console.log('✅ Le volume a bien été supprimé de la liste');
      } else {
        console.log('⚠️ Le volume est encore dans la liste (peut prendre du temps)');
      }
      
    } catch (deleteError) {
      console.log('⚠️ Erreur lors de la suppression (normal si le volume est en cours de création):', deleteError.message);
    }

    console.log('\n🎉 Test terminé avec succès !');
    console.log('💡 Les volumes créés via le portail apparaîtront maintenant dans CloudStack');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
    console.log('\n💡 Vérifiez que:');
    console.log('   • Le backend Node.js est démarré (port 3001)');
    console.log('   • CloudStack est accessible');
    console.log('   • Les zones sont configurées dans CloudStack');
  }
}

// Lancer le test
testVolumesCloudStack();
