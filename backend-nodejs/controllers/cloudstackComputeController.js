const cloudstackAPI = require('../cloudstack-api');

// ===== GESTION DES INSTANCES VIA CLOUDSTACK =====

// Récupérer toutes les instances depuis CloudStack
const getAllInstances = async (req, res) => {
  try {
    console.log('🖥️ Récupération des instances depuis CloudStack...');
    
    const instances = await cloudstackAPI.getVirtualMachines();
    
    console.log(`✅ ${instances.length} instances récupérées`);
    res.json({
      success: true,
      count: instances.length,
      instances: instances
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des instances:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des instances CloudStack',
      details: error.message 
    });
  }
};

// Récupérer une instance par ID depuis CloudStack
const getInstanceById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🖥️ Récupération de l'instance ${id} depuis CloudStack...`);
    
    const instances = await cloudstackAPI.getVirtualMachines();
    const instance = instances.find(inst => inst.id === id);
    
    if (!instance) {
      return res.status(404).json({ 
        success: false,
        error: 'Instance non trouvée' 
      });
    }
    
    console.log(`✅ Instance ${id} récupérée`);
    res.json({
      success: true,
      instance: instance
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'instance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Déployer une nouvelle instance via CloudStack
const createInstance = async (req, res) => {
  try {
    const { 
      name, 
      displayname, 
      serviceofferingid, 
      templateid, 
      zoneid, 
      networkids,
      account,
      domainid,
      startvm = true
    } = req.body;
    
    console.log('🚀 Déploiement d\'une nouvelle instance...');
    console.log('Paramètres:', { name, displayname, serviceofferingid, templateid, zoneid });
    
    // Validation des paramètres requis
    if (!name || !serviceofferingid || !templateid || !zoneid) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: name, serviceofferingid, templateid et zoneid sont requis'
      });
    }
    
    const params = {
      name,
      displayname: displayname || name,
      serviceofferingid,
      templateid,
      zoneid,
      startvm
    };
    
    // Ajouter les paramètres optionnels
    if (networkids) params.networkids = networkids;
    if (account) params.account = account;
    if (domainid) params.domainid = domainid;
    
    const response = await cloudstackAPI.deployVirtualMachine(params);
    
    console.log('✅ Instance déployée avec succès');
    res.status(201).json({
      success: true,
      message: 'Instance déployée avec succès',
      instance: response
    });
  } catch (error) {
    console.error('❌ Erreur lors du déploiement de l\'instance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors du déploiement de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Démarrer une instance via CloudStack
const startInstance = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`▶️ Démarrage de l'instance ${id}...`);
    
    const response = await cloudstackAPI.startVirtualMachine(id);
    
    console.log(`✅ Instance ${id} démarrée`);
    res.json({
      success: true,
      message: 'Instance démarrée avec succès',
      response: response
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de l\'instance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors du démarrage de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Arrêter une instance via CloudStack
const stopInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { forced = false } = req.query;
    console.log(`⏹️ Arrêt de l'instance ${id} (forced: ${forced})...`);
    
    const response = await cloudstackAPI.stopVirtualMachine(id);
    
    console.log(`✅ Instance ${id} arrêtée`);
    res.json({
      success: true,
      message: 'Instance arrêtée avec succès',
      response: response
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'arrêt de l\'instance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l\'arrêt de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Redémarrer une instance via CloudStack
const rebootInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { forced = false } = req.query;
    console.log(`🔄 Redémarrage de l'instance ${id} (forced: ${forced})...`);
    
    const response = await cloudstackAPI.rebootVirtualMachine(id);
    
    console.log(`✅ Instance ${id} redémarrée`);
    res.json({
      success: true,
      message: 'Instance redémarrée avec succès',
      response: response
    });
  } catch (error) {
    console.error('❌ Erreur lors du redémarrage de l\'instance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors du redémarrage de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// Supprimer une instance via CloudStack
const deleteInstance = async (req, res) => {
  try {
    const { id } = req.params;
    const { expunge = false } = req.query;
    console.log(`🗑️ Suppression de l'instance ${id} (expunge: ${expunge})...`);
    
    const response = await cloudstackAPI.destroyVirtualMachine(id);
    
    console.log(`✅ Instance ${id} supprimée`);
    res.json({
      success: true,
      message: 'Instance supprimée avec succès',
      response: response
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'instance:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la suppression de l\'instance CloudStack',
      details: error.message 
    });
  }
};

// ===== GESTION DES TEMPLATES ET OFFRES =====

// Récupérer les templates disponibles
const getTemplates = async (req, res) => {
  try {
    console.log('📋 Récupération des templates disponibles...');
    
    const templates = await cloudstackAPI.getTemplates();
    
    console.log(`✅ ${templates.length} templates récupérés`);
    res.json({
      success: true,
      count: templates.length,
      templates: templates
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des templates:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des templates CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les offres de service
const getServiceOfferings = async (req, res) => {
  try {
    console.log('💼 Récupération des offres de service...');
    
    const offerings = await cloudstackAPI.getServiceOfferings();
    
    console.log(`✅ ${offerings.length} offres de service récupérées`);
    res.json({
      success: true,
      count: offerings.length,
      offerings: offerings
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des offres de service:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des offres de service CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les zones disponibles
const getZones = async (req, res) => {
  try {
    console.log('📍 Récupération des zones disponibles...');
    
    const zones = await cloudstackAPI.getZones();
    
    console.log(`✅ ${zones.length} zones récupérées`);
    res.json({
      success: true,
      count: zones.length,
      zones: zones
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des zones:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors de la récupération des zones CloudStack',
      details: error.message 
    });
  }
};

// ===== STATISTIQUES DES INSTANCES =====

// Récupérer les statistiques des instances
const getInstanceStats = async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques des instances...');
    
    const instances = await cloudstackAPI.getVirtualMachines();
    
    // Calculer les statistiques
    const stats = {
      total: instances.length,
      running: instances.filter(inst => inst.state === 'Running').length,
      stopped: instances.filter(inst => inst.state === 'Stopped').length,
      starting: instances.filter(inst => inst.state === 'Starting').length,
      stopping: instances.filter(inst => inst.state === 'Stopping').length,
      error: instances.filter(inst => inst.state === 'Error').length,
      destroyed: instances.filter(inst => inst.state === 'Destroyed').length
    };
    
    console.log('✅ Statistiques des instances calculées');
    res.json({
      success: true,
      stats: stats,
      instances: instances
    });
  } catch (error) {
    console.error('❌ Erreur lors du calcul des statistiques:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur lors du calcul des statistiques des instances',
      details: error.message 
    });
  }
};

module.exports = {
  // Gestion des instances
  getAllInstances,
  getInstanceById,
  createInstance,
  startInstance,
  stopInstance,
  rebootInstance,
  deleteInstance,
  
  // Templates et offres
  getTemplates,
  getServiceOfferings,
  getZones,
  
  // Statistiques
  getInstanceStats
};
