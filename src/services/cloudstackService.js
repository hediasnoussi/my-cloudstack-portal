import axios from 'axios';

// Configuration de base pour l'API CloudStack
const API_BASE_URL = ''; // Utilise le proxy Vite

// Instance axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('🌐 CloudStack API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('🌐 CloudStack API Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('🌐 CloudStack API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('🌐 CloudStack API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Service CloudStack
const cloudstackService = {
  // Statistiques du dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les instances CloudStack
  getVirtualMachines: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/virtual-machines');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des instances CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les domaines CloudStack
  getDomains: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/domains');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des domaines CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les comptes CloudStack
  getAccounts: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/accounts');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les projets CloudStack
  getProjects: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/projects');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des projets CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les volumes CloudStack
  getVolumes: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/volumes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des volumes CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les réseaux CloudStack
  getNetworks: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/networks');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des réseaux CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les groupes de sécurité CloudStack
  getSecurityGroups: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/security-groups');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes de sécurité CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les templates CloudStack
  getTemplates: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/templates');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des templates CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les offerings de service CloudStack
  getServiceOfferings: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/service-offerings');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offerings CloudStack:', error);
      throw error;
    }
  },

  // Récupérer les zones CloudStack
  getZones: async () => {
    try {
      const response = await api.get('/api/global/cloudstack/zones');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des zones CloudStack:', error);
      throw error;
    }
  },

  // Actions sur les instances
  startVirtualMachine: async (vmId) => {
    try {
      const response = await api.post(`/api/global/cloudstack/virtual-machines/${vmId}/start`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du démarrage de l\'instance:', error);
      throw error;
    }
  },

  stopVirtualMachine: async (vmId) => {
    try {
      const response = await api.post(`/api/global/cloudstack/virtual-machines/${vmId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'arrêt de l\'instance:', error);
      throw error;
    }
  },

  rebootVirtualMachine: async (vmId) => {
    try {
      const response = await api.post(`/api/global/cloudstack/virtual-machines/${vmId}/reboot`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du redémarrage de l\'instance:', error);
      throw error;
    }
  },

  destroyVirtualMachine: async (vmId) => {
    try {
      const response = await api.delete(`/api/global/cloudstack/virtual-machines/${vmId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la destruction de l\'instance:', error);
      throw error;
    }
  },

  // Créer une nouvelle instance
  deployVirtualMachine: async (vmData) => {
    try {
      const response = await api.post('/api/global/cloudstack/virtual-machines', vmData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'instance:', error);
      throw error;
    }
  },

  // ===== GESTION DES VOLUMES CLOUDSTACK =====
  createVolume: async (volumeData) => {
    try {
      console.log('💾 Création du volume CloudStack:', volumeData);
      const response = await api.post('/api/global/cloudstack/volumes', volumeData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du volume:', error);
      throw error;
    }
  },

  attachVolume: async (volumeId, vmId) => {
    try {
      console.log('🔗 Attachement du volume:', volumeId, 'à la VM:', vmId);
      const response = await api.post(`/api/global/cloudstack/volumes/${volumeId}/attach`, { vmId });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'attachement du volume:', error);
      throw error;
    }
  },

  detachVolume: async (volumeId) => {
    try {
      console.log('🔓 Détachement du volume:', volumeId);
      const response = await api.post(`/api/global/cloudstack/volumes/${volumeId}/detach`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du détachement du volume:', error);
      throw error;
    }
  },

  deleteVolume: async (volumeId) => {
    try {
      console.log('🗑️ Suppression du volume:', volumeId);
      const response = await api.delete(`/api/global/cloudstack/volumes/${volumeId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du volume:', error);
      throw error;
    }
  },

  // ===== GESTION DES SNAPSHOTS CLOUDSTACK =====
  getSnapshots: async () => {
    try {
      console.log('📸 Récupération des snapshots CloudStack...');
      const response = await api.get('/api/global/cloudstack/snapshots');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des snapshots:', error);
      throw error;
    }
  },

  createSnapshot: async (snapshotData) => {
    try {
      console.log('📸 Création du snapshot CloudStack:', snapshotData);
      const response = await api.post('/api/global/cloudstack/snapshots', snapshotData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du snapshot:', error);
      throw error;
    }
  },

  deleteSnapshot: async (snapshotId) => {
    try {
      console.log('🗑️ Suppression du snapshot:', snapshotId);
      const response = await api.delete(`/api/global/cloudstack/snapshots/${snapshotId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du snapshot:', error);
      throw error;
    }
  },

  revertSnapshot: async (snapshotId) => {
    try {
      console.log('🔄 Restauration du snapshot:', snapshotId);
      const response = await api.put(`/api/global/cloudstack/snapshots/${snapshotId}/revert`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la restauration du snapshot:', error);
      throw error;
    }
  },

  // ===== GESTION DES GROUPES D'INSTANCES CLOUDSTACK =====
  getInstanceGroups: async () => {
    try {
      console.log('👥 Récupération des groupes d\'instances CloudStack...');
      const response = await api.get('/api/global/cloudstack/instance-groups');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des groupes d\'instances:', error);
      throw error;
    }
  },

  createInstanceGroup: async (groupData) => {
    try {
      console.log('👥 Création du groupe d\'instances CloudStack:', groupData);
      const response = await api.post('/api/global/cloudstack/instance-groups', groupData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du groupe d\'instances:', error);
      throw error;
    }
  },

  deleteInstanceGroup: async (groupId) => {
    try {
      console.log('🗑️ Suppression du groupe d\'instances:', groupId);
      const response = await api.delete(`/api/global/cloudstack/instance-groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du groupe d\'instances:', error);
      throw error;
    }
  },

  updateInstanceGroup: async (groupId, groupData) => {
    try {
      console.log('✏️ Mise à jour du groupe d\'instances:', groupId);
      const response = await api.put(`/api/global/cloudstack/instance-groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du groupe d\'instances:', error);
      throw error;
    }
  },

  // ===== GESTION DES CLÉS SSH CLOUDSTACK =====
  getSSHKeyPairs: async () => {
    try {
      console.log('🔑 Récupération des clés SSH CloudStack...');
      const response = await api.get('/api/global/cloudstack/ssh-key-pairs');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des clés SSH:', error);
      throw error;
    }
  },

  createSSHKeyPair: async (keyData) => {
    try {
      console.log('🔑 Création de la paire de clés SSH CloudStack:', keyData);
      const response = await api.post('/api/global/cloudstack/ssh-key-pairs', keyData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de la paire de clés SSH:', error);
      throw error;
    }
  },

  deleteSSHKeyPair: async (keyName) => {
    try {
      console.log('🗑️ Suppression de la paire de clés SSH:', keyName);
      const response = await api.delete(`/api/global/cloudstack/ssh-key-pairs/${keyName}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la paire de clés SSH:', error);
      throw error;
    }
  },

  registerSSHKeyPair: async (keyData) => {
    try {
      console.log('📥 Import de la paire de clés SSH CloudStack:', keyData);
      const response = await api.post('/api/global/cloudstack/ssh-key-pairs/register', keyData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'import de la paire de clés SSH:', error);
      throw error;
    }
  },

  // ===== GESTION DES UTILISATEURS CLOUDSTACK =====
  getUsers: async () => {
    try {
      console.log('👥 Récupération des utilisateurs CloudStack...');
      const response = await api.get('/api/global/cloudstack/users');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      console.log('👤 Création de l\'utilisateur CloudStack:', userData);
      const response = await api.post('/api/global/cloudstack/users', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      console.log('🗑️ Suppression de l\'utilisateur CloudStack:', userId);
      const response = await api.delete(`/api/global/cloudstack/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      console.log('✏️ Mise à jour de l\'utilisateur CloudStack:', userId);
      const response = await api.put(`/api/global/cloudstack/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId, enabled) => {
    try {
      console.log('🔄 Mise à jour du statut utilisateur CloudStack:', userId);
      const response = await api.put(`/api/global/cloudstack/users/${userId}/status`, { enabled });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut utilisateur:', error);
      throw error;
    }
  },

  // ===== GESTION DES COMPTES CLOUDSTACK =====
  getAccounts: async () => {
    try {
      console.log('🏦 Récupération des comptes CloudStack...');
      const response = await api.get('/api/global/cloudstack/accounts');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des comptes:', error);
      throw error;
    }
  },

  createAccount: async (accountData) => {
    try {
      console.log('🏦 Création du compte CloudStack:', accountData);
      const response = await api.post('/api/global/cloudstack/accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du compte:', error);
      throw error;
    }
  },

  deleteAccount: async (accountId) => {
    try {
      console.log('🗑️ Suppression du compte CloudStack:', accountId);
      const response = await api.delete(`/api/global/cloudstack/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du compte:', error);
      throw error;
    }
  },

  // ===== GESTION DES USER DATA CLOUDSTACK =====
  getUserData: async () => {
    try {
      console.log('📄 Récupération des user data CloudStack...');
      const response = await api.get('/api/global/cloudstack/user-data');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des user data:', error);
      throw error;
    }
  },

  createUserDataTemplate: async (templateData) => {
    try {
      console.log('📄 Création du template avec user data CloudStack:', templateData);
      const response = await api.post('/api/global/cloudstack/user-data', templateData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du template avec user data:', error);
      throw error;
    }
  },

  updateUserDataTemplate: async (templateId, templateData) => {
    try {
      console.log('✏️ Mise à jour du template avec user data CloudStack:', templateId);
      const response = await api.put(`/api/global/cloudstack/user-data/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du template avec user data:', error);
      throw error;
    }
  },

  deleteUserDataTemplate: async (templateId) => {
    try {
      console.log('🗑️ Suppression du template avec user data CloudStack:', templateId);
      const response = await api.delete(`/api/global/cloudstack/user-data/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du template avec user data:', error);
      throw error;
    }
  },

  // ===== GESTION DES RÉSEAUX CLOUDSTACK =====

  // Créer un réseau
  createNetwork: async (networkData) => {
    try {
      const response = await api.post('/api/global/cloudstack/networks', networkData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du réseau:', error);
      throw error;
    }
  },

  // Supprimer un réseau
  deleteNetwork: async (networkId) => {
    try {
      const response = await api.delete(`/api/global/cloudstack/networks/${networkId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du réseau:', error);
      throw error;
    }
  },

  // ===== GESTION DES GROUPES DE SÉCURITÉ CLOUDSTACK =====

  // Créer un groupe de sécurité
  createSecurityGroup: async (securityGroupData) => {
    try {
      const response = await api.post('/api/global/cloudstack/security-groups', securityGroupData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du groupe de sécurité:', error);
      throw error;
    }
  },

  // Supprimer un groupe de sécurité
  deleteSecurityGroup: async (securityGroupId) => {
    try {
      const response = await api.delete(`/api/global/cloudstack/security-groups/${securityGroupId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe de sécurité:', error);
      throw error;
    }
  },

  // ===== GESTION DES VPC CLOUDSTACK =====
  
  getVPCs: async () => {
    try {
      console.log('🏗️ Récupération des VPC CloudStack...');
      const response = await api.get('/api/global/cloudstack/vpcs');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des VPC:', error);
      throw error;
    }
  },

  createVPC: async (vpcData) => {
    try {
      console.log('🏗️ Création du VPC CloudStack:', vpcData);
      const response = await api.post('/api/global/cloudstack/vpcs', vpcData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du VPC:', error);
      throw error;
    }
  },

  deleteVPC: async (vpcId) => {
    try {
      console.log('🗑️ Suppression du VPC:', vpcId);
      const response = await api.delete(`/api/global/cloudstack/vpcs/${vpcId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du VPC:', error);
      throw error;
    }
  },

  updateVPC: async (vpcId, vpcData) => {
    try {
      console.log('✏️ Mise à jour du VPC:', vpcId);
      const response = await api.put(`/api/global/cloudstack/vpcs/${vpcId}`, vpcData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du VPC:', error);
      throw error;
    }
  },

  // ===== GESTION DES IP PUBLIQUES CLOUDSTACK =====
  
  getPublicIPs: async () => {
    try {
      console.log('🌐 Récupération des IP publiques CloudStack...');
      const response = await api.get('/api/global/cloudstack/public-ips');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des IP publiques:', error);
      throw error;
    }
  },

  associatePublicIP: async (ipData) => {
    try {
      console.log('🔗 Association de l\'IP publique CloudStack:', ipData);
      const response = await api.post('/api/global/cloudstack/public-ips/associate', ipData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'association de l\'IP publique:', error);
      throw error;
    }
  },

  disassociatePublicIP: async (ipId) => {
    try {
      console.log('🔓 Dissociation de l\'IP publique:', ipId);
      const response = await api.put(`/api/global/cloudstack/public-ips/${ipId}/disassociate`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la dissociation de l\'IP publique:', error);
      throw error;
    }
  },

  releasePublicIP: async (ipId) => {
    try {
      console.log('🗑️ Libération de l\'IP publique:', ipId);
      const response = await api.delete(`/api/global/cloudstack/public-ips/${ipId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la libération de l\'IP publique:', error);
      throw error;
    }
  },

  // ===== GESTION DES RÉSEAUX AVANCÉE CLOUDSTACK =====
  
  getNetworksDetailed: async () => {
    try {
      console.log('🌐 Récupération des réseaux détaillés CloudStack...');
      const response = await api.get('/api/global/cloudstack/networks-detailed');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des réseaux:', error);
      throw error;
    }
  },

  createIsolatedNetwork: async (networkData) => {
    try {
      console.log('🌐 Création du réseau isolé CloudStack:', networkData);
      const response = await api.post('/api/global/cloudstack/networks/isolated', networkData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du réseau isolé:', error);
      throw error;
    }
  },

  createSharedNetwork: async (networkData) => {
    try {
      console.log('🌐 Création du réseau partagé CloudStack:', networkData);
      const response = await api.post('/api/global/cloudstack/networks/shared', networkData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du réseau partagé:', error);
      throw error;
    }
  },

  updateNetwork: async (networkId, networkData) => {
    try {
      console.log('✏️ Mise à jour du réseau:', networkId);
      const response = await api.put(`/api/global/cloudstack/networks/${networkId}`, networkData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du réseau:', error);
      throw error;
    }
  },

  // ===== GESTION DES ACL CLOUDSTACK =====
  
  getNetworkACLs: async () => {
    try {
      console.log('🔒 Récupération des ACL CloudStack...');
      const response = await api.get('/api/global/cloudstack/network-acls');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des ACL:', error);
      throw error;
    }
  },

  createNetworkACL: async (aclData) => {
    try {
      console.log('🔒 Création de l\'ACL CloudStack:', aclData);
      const response = await api.post('/api/global/cloudstack/network-acls', aclData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'ACL:', error);
      throw error;
    }
  },

  deleteNetworkACL: async (aclId) => {
    try {
      console.log('🗑️ Suppression de l\'ACL:', aclId);
      const response = await api.delete(`/api/global/cloudstack/network-acls/${aclId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'ACL:', error);
      throw error;
    }
  }
};

export default cloudstackService;
