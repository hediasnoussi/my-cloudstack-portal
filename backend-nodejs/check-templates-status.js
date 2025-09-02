const cloudstackAPI = require('./cloudstack-api');

async function checkTemplatesStatus() {
  console.log('🔍 Vérification de l\'état des templates...\n');

  try {
    const response = await cloudstackAPI.makeRequest('listTemplates', { templatefilter: 'all' });
    const templates = response.listtemplatesresponse?.template || [];
    
    console.log(`📦 ${templates.length} templates trouvés\n`);
    
    templates.forEach(template => {
      if (template.templatetype === 'USER') {
        const downloadState = template.downloaddetails?.[0]?.downloadState || 'N/A';
        const downloadPercent = template.downloaddetails?.[0]?.downloadPercent || '0';
        
        console.log(`📋 ${template.name}`);
        console.log(`   Description: ${template.displaytext}`);
        console.log(`   ID: ${template.id}`);
        console.log(`   Type: ${template.templatetype}`);
        console.log(`   Prêt: ${template.isready ? '✅ OUI' : '❌ NON'}`);
        console.log(`   Téléchargement: ${downloadState} (${downloadPercent}%)`);
        console.log(`   Format: ${template.format}`);
        console.log(`   Hyperviseur: ${template.hypervisor}`);
        console.log('   ---');
      }
    });

    // Vérifier s'il y a des templates utilisateur prêts
    const readyUserTemplates = templates.filter(t => t.templatetype === 'USER' && t.isready);
    
    if (readyUserTemplates.length > 0) {
      console.log(`\n🎉 ${readyUserTemplates.length} template(s) utilisateur prêt(s) !`);
      console.log('💡 Vous pouvez maintenant créer des VPS !');
    } else {
      console.log('\n⏳ Aucun template utilisateur prêt pour le moment.');
      console.log('💡 Les templates sont en cours de téléchargement...');
      console.log('💡 Attendez quelques minutes ou ajoutez des templates manuellement.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

checkTemplatesStatus();
