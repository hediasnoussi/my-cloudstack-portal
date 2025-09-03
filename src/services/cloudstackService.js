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

  // Gestion des VMSnapshots (instance snapshots)
  getVMSnapshots: async () => {
    try {
      console.log('📸 Récupération des VMSnapshots CloudStack...');
      const response = await api.get('/api/global/cloudstack/vm-snapshots');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des VMSnapshots:', error);
      throw error;
    }
  },

  createVMSnapshot: async (vmSnapshotData) => {
    try {
      console.log('📸 Création du VMSnapshot CloudStack:', vmSnapshotData);
      const response = await api.post('/api/global/cloudstack/vm-snapshots', vmSnapshotData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création du VMSnapshot:', error);
      throw error;
    }
  },

  deleteVMSnapshot: async (vmSnapshotId) => {
    try {
      console.log('🗑️ Suppression du VMSnapshot:', vmSnapshotId);
      const response = await api.delete(`/api/global/cloudstack/vm-snapshots/${vmSnapshotId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du VMSnapshot:', error);
      throw error;
    }
  },

  revertVMSnapshot: async (vmSnapshotId) => {
    try {
      console.log('🔄 Restauration du VMSnapshot:', vmSnapshotId);
      const response = await api.put(`/api/global/cloudstack/vm-snapshots/${vmSnapshotId}/revert`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la restauration du VMSnapshot:', error);
      throw error;
    }
  },

  // ===== GESTION DES ISOs CLOUDSTACK =====

  // Récupérer les ISOs
  getISOs: async () => {
    try {
      console.log('📀 Récupération des ISOs CloudStack...');
      const response = await api.get('/api/global/cloudstack/isos');
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des ISOs:', error);
      throw error;
    }
  },

  // Créer un ISO
  createISO: async (isoData) => {
    try {
      console.log('📀 Création de l\'ISO CloudStack:', isoData);
      const response = await api.post('/api/global/cloudstack/isos', isoData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'ISO:', error);
      throw error;
    }
  },

  // Mettre à jour un ISO
  updateISO: async (isoId, isoData) => {
    try {
      console.log('📀 Mise à jour de l\'ISO CloudStack:', isoId, isoData);
      const response = await api.put(`/api/global/cloudstack/isos/${isoId}`, isoData);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'ISO:', error);
      throw error;
    }
  },

  // Supprimer un ISO
  deleteISO: async (isoId) => {
    try {
      console.log('🗑️ Suppression de l\'ISO CloudStack:', isoId);
      const response = await api.delete(`/api/global/cloudstack/isos/${isoId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'ISO:', error);
      throw error;
    }
  },

  // ===== GESTION DES ÉVÉNEMENTS CLOUDSTACK =====

  // Récupérer les événements
  getEvents: async (params = {}) => {
    try {
      console.log('📋 Récupération des événements CloudStack...');
      const response = await api.get('/api/global/cloudstack/events', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des événements:', error);
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






};

export default cloudstackService;
