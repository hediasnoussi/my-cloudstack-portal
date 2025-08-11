const cloudstackAPI = require('../cloudstack-api');

// Récupérer les statistiques du dashboard depuis CloudStack
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Récupération des statistiques CloudStack...');
    
    const stats = await cloudstackAPI.getDashboardStats();
    
    console.log('✅ Statistiques récupérées:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des statistiques CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les domaines depuis CloudStack
const getCloudStackDomains = async (req, res) => {
  try {
    console.log('🌐 Récupération des domaines CloudStack...');
    
    const domains = await cloudstackAPI.getDomains();
    
    console.log(`✅ ${domains.length} domaines récupérés`);
    res.json(domains);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des domaines:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des domaines CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les comptes depuis CloudStack
const getCloudStackAccounts = async (req, res) => {
  try {
    console.log('👥 Récupération des comptes CloudStack...');
    
    const accounts = await cloudstackAPI.getAccounts();
    
    console.log(`✅ ${accounts.length} comptes récupérés`);
    res.json(accounts);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des comptes:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des comptes CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les projets depuis CloudStack
const getCloudStackProjects = async (req, res) => {
  try {
    console.log('📁 Récupération des projets CloudStack...');
    
    const projects = await cloudstackAPI.getProjects();
    
    console.log(`✅ ${projects.length} projets récupérés`);
    res.json(projects);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des projets:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des projets CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les instances depuis CloudStack
const getCloudStackVirtualMachines = async (req, res) => {
  try {
    console.log('🖥️ Récupération des instances CloudStack...');
    
    const vms = await cloudstackAPI.getVirtualMachines();
    
    console.log(`✅ ${vms.length} instances récupérées`);
    res.json(vms);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des instances:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des instances CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les volumes depuis CloudStack
const getCloudStackVolumes = async (req, res) => {
  try {
    console.log('💾 Récupération des volumes CloudStack...');
    
    const volumes = await cloudstackAPI.getVolumes();
    
    console.log(`✅ ${volumes.length} volumes récupérés`);
    res.json(volumes);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des volumes:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des volumes CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les réseaux depuis CloudStack
const getCloudStackNetworks = async (req, res) => {
  try {
    console.log('🌐 Récupération des réseaux CloudStack...');
    
    const networks = await cloudstackAPI.getNetworks();
    
    console.log(`✅ ${networks.length} réseaux récupérés`);
    res.json(networks);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des réseaux:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des réseaux CloudStack',
      details: error.message 
    });
  }
};

// Récupérer les groupes de sécurité depuis CloudStack
const getCloudStackSecurityGroups = async (req, res) => {
  try {
    console.log('🔒 Récupération des groupes de sécurité CloudStack...');
    
    const securityGroups = await cloudstackAPI.getSecurityGroups();
    
    console.log(`✅ ${securityGroups.length} groupes de sécurité récupérés`);
    res.json(securityGroups);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des groupes de sécurité:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des groupes de sécurité CloudStack',
      details: error.message 
    });
  }
};

module.exports = {
  getDashboardStats,
  getCloudStackDomains,
  getCloudStackAccounts,
  getCloudStackProjects,
  getCloudStackVirtualMachines,
  getCloudStackVolumes,
  getCloudStackNetworks,
  getCloudStackSecurityGroups
}; 