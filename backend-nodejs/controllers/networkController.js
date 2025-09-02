const cloudstackAPI = require('../cloudstack-api');

// ===== VPCS CLOUDSTACK =====
const getAllVpcs = async (req, res) => {
  try {
    console.log('🌐 Récupération de tous les VPCs depuis CloudStack...');
    const vpcs = await cloudstackAPI.getVPCs();
    console.log(`✅ ${vpcs.length} VPCs récupérés`);
    res.json({
      success: true,
      data: vpcs,
      count: vpcs.length
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des VPCs:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération des VPCs depuis CloudStack'
    });
  }
};

const getVpcById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Récupération du VPC ${id} depuis CloudStack...`);
    
    const vpcs = await cloudstackAPI.getVPCs();
    const vpc = vpcs.find(v => v.id === id);
    
    if (!vpc) {
      return res.status(404).json({ 
        success: false, 
        error: 'VPC not found',
        message: `VPC avec l'ID ${id} non trouvé`
      });
    }
    
    console.log(`✅ VPC ${id} récupéré`);
    res.json({
      success: true,
      data: vpc
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du VPC:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération du VPC depuis CloudStack'
    });
  }
};

const createVpc = async (req, res) => {
  try {
    const { name, displaytext, cidr, vpcofferingid, zoneid, account, domainid } = req.body;
    
    if (!name || !displaytext || !cidr || !vpcofferingid || !zoneid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Les champs name, displaytext, cidr, vpcofferingid et zoneid sont requis'
      });
    }
    
    console.log(`🌐 Création du VPC "${name}" dans CloudStack...`);
    
    const vpcData = {
      name,
      displaytext,
      cidr,
      vpcofferingid,
      zoneid,
      ...(account && { account }),
      ...(domainid && { domainid })
    };
    
    const result = await cloudstackAPI.createVPC(vpcData);
    console.log(`✅ VPC "${name}" créé avec succès`);
    
    res.status(201).json({
      success: true,
      data: result,
      message: `VPC "${name}" créé avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du VPC:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la création du VPC dans CloudStack'
    });
  }
};

const updateVpc = async (req, res) => {
  try {
    const { id } = req.params;
    const { displaytext } = req.body;
    
    if (!displaytext) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Le champ displaytext est requis'
      });
    }
    
    console.log(`🌐 Mise à jour du VPC ${id} dans CloudStack...`);
    
    const result = await cloudstackAPI.updateVPC(id, { displaytext });
    console.log(`✅ VPC ${id} mis à jour avec succès`);
    
    res.json({
      success: true,
      data: result,
      message: `VPC ${id} mis à jour avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du VPC:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la mise à jour du VPC dans CloudStack'
    });
  }
};

const deleteVpc = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Suppression du VPC ${id} dans CloudStack...`);
    
    const result = await cloudstackAPI.deleteVPC(id);
    console.log(`✅ VPC ${id} supprimé avec succès`);
    
    res.json({
      success: true,
      data: result,
      message: `VPC ${id} supprimé avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du VPC:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la suppression du VPC dans CloudStack'
    });
  }
};

// ===== RÉSEAUX CLOUDSTACK =====
const getAllGuestNetworks = async (req, res) => {
  try {
    console.log('🌐 Récupération de tous les réseaux depuis CloudStack...');
    const networks = await cloudstackAPI.getNetworksDetailed();
    console.log(`✅ ${networks.length} réseaux récupérés`);
    res.json({
      success: true,
      data: networks,
      count: networks.length
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des réseaux:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération des réseaux depuis CloudStack'
    });
  }
};

const getGuestNetworkById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Récupération du réseau ${id} depuis CloudStack...`);
    
    const networks = await cloudstackAPI.getNetworksDetailed();
    const network = networks.find(n => n.id === id);
    
    if (!network) {
      return res.status(404).json({ 
        success: false, 
        error: 'Network not found',
        message: `Réseau avec l'ID ${id} non trouvé`
      });
    }
    
    console.log(`✅ Réseau ${id} récupéré`);
    res.json({
      success: true,
      data: network
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du réseau:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération du réseau depuis CloudStack'
    });
  }
};

const createGuestNetwork = async (req, res) => {
  try {
    const { name, displaytext, networkofferingid, zoneid, account, domainid, vpcid, gateway, netmask, startip, endip } = req.body;
    
    if (!name || !displaytext || !networkofferingid || !zoneid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Les champs name, displaytext, networkofferingid et zoneid sont requis'
      });
    }
    
    console.log(`🌐 Création du réseau "${name}" dans CloudStack...`);
    
    const networkData = {
      name,
      displaytext,
      networkofferingid,
      zoneid,
      ...(account && { account }),
      ...(domainid && { domainid }),
      ...(vpcid && { vpcid }),
      ...(gateway && { gateway }),
      ...(netmask && { netmask }),
      ...(startip && { startip }),
      ...(endip && { endip })
    };
    
    const result = await cloudstackAPI.createIsolatedNetwork(networkData);
    console.log(`✅ Réseau "${name}" créé avec succès`);
    
    res.status(201).json({
      success: true,
      data: result,
      message: `Réseau "${name}" créé avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du réseau:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la création du réseau dans CloudStack'
    });
  }
};

const updateGuestNetwork = async (req, res) => {
  try {
    const { id } = req.params;
    const { displaytext } = req.body;
    
    if (!displaytext) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Le champ displaytext est requis'
      });
    }
    
    console.log(`🌐 Mise à jour du réseau ${id} dans CloudStack...`);
    
    const result = await cloudstackAPI.updateNetwork(id, { displaytext });
    console.log(`✅ Réseau ${id} mis à jour avec succès`);
    
    res.json({
      success: true,
      data: result,
      message: `Réseau ${id} mis à jour avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du réseau:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la mise à jour du réseau dans CloudStack'
    });
  }
};

const deleteGuestNetwork = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Suppression du réseau ${id} dans CloudStack...`);
    
    const result = await cloudstackAPI.deleteNetwork(id);
    console.log(`✅ Réseau ${id} supprimé avec succès`);
    
    res.json({
      success: true,
      data: result,
      message: `Réseau ${id} supprimé avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du réseau:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la suppression du réseau dans CloudStack'
    });
  }
};

// ===== IP PUBLIQUES CLOUDSTACK =====
const getAllPublicIpAddresses = async (req, res) => {
  try {
    console.log('🌐 Récupération de toutes les IP publiques depuis CloudStack...');
    const publicIPs = await cloudstackAPI.getPublicIPs();
    console.log(`✅ ${publicIPs.length} IP publiques récupérées`);
    res.json({
      success: true,
      data: publicIPs,
      count: publicIPs.length
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des IP publiques:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération des IP publiques depuis CloudStack'
    });
  }
};

const getPublicIpAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Récupération de l'IP publique ${id} depuis CloudStack...`);
    
    const publicIPs = await cloudstackAPI.getPublicIPs();
    const publicIP = publicIPs.find(ip => ip.id === id);
    
    if (!publicIP) {
      return res.status(404).json({ 
        success: false, 
        error: 'Public IP not found',
        message: `IP publique avec l'ID ${id} non trouvée`
      });
    }
    
    console.log(`✅ IP publique ${id} récupérée`);
    res.json({
      success: true,
      data: publicIP
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'IP publique:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération de l\'IP publique depuis CloudStack'
    });
  }
};

const createPublicIpAddress = async (req, res) => {
  try {
    const { zoneid, account, domainid, networkid, vpcid } = req.body;
    
    if (!zoneid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Le champ zoneid est requis'
      });
    }
    
    console.log('🌐 Association d\'une nouvelle IP publique dans CloudStack...');
    
    const ipData = {
      zoneid,
      ...(account && { account }),
      ...(domainid && { domainid }),
      ...(networkid && { networkid }),
      ...(vpcid && { vpcid })
    };
    
    const result = await cloudstackAPI.associatePublicIP(ipData);
    console.log('✅ IP publique associée avec succès');
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'IP publique associée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'association de l\'IP publique:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de l\'association de l\'IP publique dans CloudStack'
    });
  }
};

const updatePublicIpAddress = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Mise à jour de l'IP publique ${id} dans CloudStack...`);
    
    // Note: CloudStack ne permet pas de mettre à jour une IP publique directement
    // Cette fonction est maintenue pour la compatibilité mais ne fait rien
    res.json({
      success: true,
      message: `IP publique ${id} - Aucune mise à jour nécessaire (non supportée par CloudStack)`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l\'IP publique:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la mise à jour de l\'IP publique dans CloudStack'
    });
  }
};

const deletePublicIpAddress = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Libération de l'IP publique ${id} dans CloudStack...`);
    
    const result = await cloudstackAPI.releasePublicIP(id);
    console.log(`✅ IP publique ${id} libérée avec succès`);
    
    res.json({
      success: true,
      data: result,
      message: `IP publique ${id} libérée avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la libération de l\'IP publique:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la libération de l\'IP publique dans CloudStack'
    });
  }
};

// ===== GROUPES DE SÉCURITÉ CLOUDSTACK =====
const getAllSecurityGroups = async (req, res) => {
  try {
    console.log('🌐 Récupération de tous les groupes de sécurité depuis CloudStack...');
    const securityGroups = await cloudstackAPI.getSecurityGroups();
    console.log(`✅ ${securityGroups.length} groupes de sécurité récupérés`);
    res.json({
      success: true,
      data: securityGroups,
      count: securityGroups.length
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des groupes de sécurité:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération des groupes de sécurité depuis CloudStack'
    });
  }
};

const getSecurityGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Récupération du groupe de sécurité ${id} depuis CloudStack...`);
    
    const securityGroups = await cloudstackAPI.getSecurityGroups();
    const securityGroup = securityGroups.find(sg => sg.id === id);
    
    if (!securityGroup) {
      return res.status(404).json({ 
        success: false, 
        error: 'Security Group not found',
        message: `Groupe de sécurité avec l'ID ${id} non trouvé`
      });
    }
    
    console.log(`✅ Groupe de sécurité ${id} récupéré`);
    res.json({
      success: true,
      data: securityGroup
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du groupe de sécurité:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la récupération du groupe de sécurité depuis CloudStack'
    });
  }
};

const createSecurityGroup = async (req, res) => {
  try {
    const { name, description, account, domainid } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields',
        message: 'Le champ name est requis'
      });
    }
    
    console.log(`🌐 Création du groupe de sécurité "${name}" dans CloudStack...`);
    
    const sgData = {
      name,
      ...(description && { description }),
      ...(account && { account }),
      ...(domainid && { domainid })
    };
    
    const result = await cloudstackAPI.makeRequest('createSecurityGroup', sgData);
    console.log(`✅ Groupe de sécurité "${name}" créé avec succès`);
    
    res.status(201).json({
      success: true,
      data: result.createsecuritygroupresponse,
      message: `Groupe de sécurité "${name}" créé avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création du groupe de sécurité:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la création du groupe de sécurité dans CloudStack'
    });
  }
};

const updateSecurityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Mise à jour du groupe de sécurité ${id} dans CloudStack...`);
    
    // Note: CloudStack ne permet pas de mettre à jour un groupe de sécurité directement
    // Cette fonction est maintenue pour la compatibilité mais ne fait rien
    res.json({
      success: true,
      message: `Groupe de sécurité ${id} - Aucune mise à jour nécessaire (non supportée par CloudStack)`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du groupe de sécurité:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la mise à jour du groupe de sécurité dans CloudStack'
    });
  }
};

const deleteSecurityGroup = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🌐 Suppression du groupe de sécurité ${id} dans CloudStack...`);
    
    const result = await cloudstackAPI.makeRequest('deleteSecurityGroup', { id });
    console.log(`✅ Groupe de sécurité ${id} supprimé avec succès`);
    
    res.json({
      success: true,
      data: result.deletesecuritygroupresponse,
      message: `Groupe de sécurité ${id} supprimé avec succès`
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression du groupe de sécurité:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Erreur lors de la suppression du groupe de sécurité dans CloudStack'
    });
  }
};

// ===== FONCTIONS PLACEHOLDER POUR LES AUTRES RESSOURCES =====
// Ces fonctions sont maintenues pour la compatibilité mais retournent des réponses d'erreur

const getAllVnfAppliances = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VNF Appliances non implémentée dans cette version'
  });
};

const getVnfApplianceById = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VNF Appliances non implémentée dans cette version'
  });
};

const createVnfAppliance = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VNF Appliances non implémentée dans cette version'
  });
};

const updateVnfAppliance = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VNF Appliances non implémentée dans cette version'
  });
};

const deleteVnfAppliance = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VNF Appliances non implémentée dans cette version'
  });
};

// ===== FONCTIONS PLACEHOLDER POUR LES AUTRES RESSOURCES =====
const getAllAsNumbers = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des AS Numbers non implémentée dans cette version'
  });
};

const getAsNumberById = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des AS Numbers non implémentée dans cette version'
  });
};

const createAsNumber = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des AS Numbers non implémentée dans cette version'
  });
};

const updateAsNumber = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des AS Numbers non implémentée dans cette version'
  });
};

const deleteAsNumber = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des AS Numbers non implémentée dans cette version'
  });
};

// ===== FONCTIONS PLACEHOLDER POUR VPN =====
const getAllSiteToSiteVpn = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Site-to-Site non implémentée dans cette version'
  });
};

const getSiteToSiteVpnById = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Site-to-Site non implémentée dans cette version'
  });
};

const createSiteToSiteVpn = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Site-to-Site non implémentée dans cette version'
  });
};

const updateSiteToSiteVpn = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Site-to-Site non implémentée dans cette version'
  });
};

const deleteSiteToSiteVpn = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Site-to-Site non implémentée dans cette version'
  });
};

// ===== FONCTIONS PLACEHOLDER POUR VPN USERS =====
const getAllVpnUsers = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Users non implémentée dans cette version'
  });
};

const getVpnUserById = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Users non implémentée dans cette version'
  });
};

const createVpnUser = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Users non implémentée dans cette version'
  });
};

const updateVpnUser = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Users non implémentée dans cette version'
  });
};

const deleteVpnUser = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Users non implémentée dans cette version'
  });
};

// ===== FONCTIONS PLACEHOLDER POUR VPN CUSTOMER GATEWAYS =====
const getAllVpnCustomerGateways = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Customer Gateways non implémentée dans cette version'
  });
};

const getVpnCustomerGatewayById = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Customer Gateways non implémentée dans cette version'
  });
};

const createVpnCustomerGateway = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Customer Gateways non implémentée dans cette version'
  });
};

const updateVpnCustomerGateway = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Customer Gateways non implémentée dans cette version'
  });
};

const deleteVpnCustomerGateway = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des VPN Customer Gateways non implémentée dans cette version'
  });
};

// ===== FONCTIONS PLACEHOLDER POUR GUEST VLANS =====
const getAllGuestVlans = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des Guest VLANs non implémentée dans cette version'
  });
};

const getGuestVlanById = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des Guest VLANs non implémentée dans cette version'
  });
};

const createGuestVlan = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des Guest VLANs non implémentée dans cette version'
  });
};

const updateGuestVlan = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des Guest VLANs non implémentée dans cette version'
  });
};

const deleteGuestVlan = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des Guest VLANs non implémentée dans cette version'
  });
};

// ===== FONCTIONS PLACEHOLDER POUR IPV4 SUBNETS =====
const getAllIpv4Subnets = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des IPv4 Subnets non implémentée dans cette version'
  });
};

const getIpv4SubnetById = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des IPv4 Subnets non implémentée dans cette version'
  });
};

const createIpv4Subnet = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des IPv4 Subnets non implémentée dans cette version'
  });
};

const updateIpv4Subnet = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des IPv4 Subnets non implémentée dans cette version'
  });
};

const deleteIpv4Subnet = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    error: 'Not implemented',
    message: 'Gestion des IPv4 Subnets non implémentée dans cette version'
  });
};

module.exports = {
  // VPCs
  getAllVpcs,
  getVpcById,
  createVpc,
  updateVpc,
  deleteVpc,
  
  // Guest Networks
  getAllGuestNetworks,
  getGuestNetworkById,
  createGuestNetwork,
  updateGuestNetwork,
  deleteGuestNetwork,
  
  // Security Groups
  getAllSecurityGroups,
  getSecurityGroupById,
  createSecurityGroup,
  updateSecurityGroup,
  deleteSecurityGroup,
  
  // Public IP Addresses
  getAllPublicIpAddresses,
  getPublicIpAddressById,
  createPublicIpAddress,
  updatePublicIpAddress,
  deletePublicIpAddress,
  
  // VNF Appliances
  getAllVnfAppliances,
  getVnfApplianceById,
  createVnfAppliance,
  updateVnfAppliance,
  deleteVnfAppliance,
  
  // AS Numbers
  getAllAsNumbers,
  getAsNumberById,
  createAsNumber,
  updateAsNumber,
  deleteAsNumber,
  
  // Site to Site VPN
  getAllSiteToSiteVpn,
  getSiteToSiteVpnById,
  createSiteToSiteVpn,
  updateSiteToSiteVpn,
  deleteSiteToSiteVpn,
  
  // VPN Users
  getAllVpnUsers,
  getVpnUserById,
  createVpnUser,
  updateVpnUser,
  deleteVpnUser,
  
  // VPN Customer Gateways
  getAllVpnCustomerGateways,
  getVpnCustomerGatewayById,
  createVpnCustomerGateway,
  updateVpnCustomerGateway,
  deleteVpnCustomerGateway,
  
  // Guest VLANs
  getAllGuestVlans,
  getGuestVlanById,
  createGuestVlan,
  updateGuestVlan,
  deleteGuestVlan,
  
  // IPv4 Subnets
  getAllIpv4Subnets,
  getIpv4SubnetById,
  createIpv4Subnet,
  updateIpv4Subnet,
  deleteIpv4Subnet
}; 