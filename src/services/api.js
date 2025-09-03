import axios from 'axios';

// Configuration de base pour l'API
const API_BASE_URL = 'http://localhost:3000';

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
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Backend server is not running. Please start the server on port 3001');
    } else if (error.response) {
      console.error('API Response Error:', error.response.status, error.response.data);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Services API
export const apiService = {
  // Test de connexion
  testConnection: () => api.get('/test'),
  
  // Authentication
  login: (credentials) => api.post('/api/login', credentials),
  
  // Global endpoints - Domains
  getDomains: () => api.get('/api/global/domains'),
  getDomainById: (id) => api.get(`/api/global/domains/${id}`),
  createDomain: (domainData) => api.post('/api/global/domains', domainData),
  updateDomain: (id, domainData) => api.put(`/api/global/domains/${id}`, domainData),
  deleteDomain: (id) => api.delete(`/api/global/domains/${id}`),
  
  // Global endpoints - Roles
  getRoles: () => api.get('/api/global/roles'),
  getRoleById: (id) => api.get(`/api/global/roles/${id}`),
  createRole: (roleData) => api.post('/api/global/roles', roleData),
  updateRole: (id, roleData) => api.put(`/api/global/roles/${id}`, roleData),
  deleteRole: (id) => api.delete(`/api/global/roles/${id}`),
  
  // Global endpoints - Accounts
  getAccounts: () => api.get('/api/global/accounts'),
  getAccountById: (id) => api.get(`/api/global/accounts/${id}`),
  createAccount: (accountData) => api.post('/api/global/accounts', accountData),
  updateAccount: (id, accountData) => api.put(`/api/global/accounts/${id}`, accountData),
  deleteAccount: (id) => api.delete(`/api/global/accounts/${id}`),
  
  // Global endpoints - Zones
  getZones: () => api.get('/api/global/zones'),
  getZoneById: (id) => api.get(`/api/global/zones/${id}`),
  createZone: (zoneData) => api.post('/api/global/zones', zoneData),
  updateZone: (id, zoneData) => api.put(`/api/global/zones/${id}`, zoneData),
  deleteZone: (id) => api.delete(`/api/global/zones/${id}`),
  
  // Users endpoints
  getUsers: () => api.get('/api/users'),
  getUserById: (id) => api.get(`/api/users/${id}`),
  createUser: (userData) => api.post('/api/users', userData),
  updateUser: (id, userData) => api.put(`/api/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  
  // Compute endpoints
  getVMs: () => api.get('/api/compute/vms'),
  getTemplates: () => api.get('/api/compute/templates'),
  getISOs: () => api.get('/api/compute/isos'),
  
  // Storage endpoints
  getVolumes: () => api.get('/api/storage/volumes'),
  getSnapshots: () => api.get('/api/storage/snapshots'),

  

  
  // Projects endpoints
  getProjects: () => api.get('/api/projects'),
  getProjectById: (id) => api.get(`/api/projects/${id}`),
};

// Exports individuels pour les domaines
export const getDomains = () => apiService.getDomains();
export const getDomainById = (id) => apiService.getDomainById(id);
export const createDomain = (domainData) => apiService.createDomain(domainData);
export const updateDomain = (id, domainData) => apiService.updateDomain(id, domainData);
export const deleteDomain = (id) => apiService.deleteDomain(id);

// Exports individuels pour les rôles
export const getRoles = () => apiService.getRoles();
export const getRoleById = (id) => apiService.getRoleById(id);
export const createRole = (roleData) => apiService.createRole(roleData);
export const updateRole = (id, roleData) => apiService.updateRole(id, roleData);
export const deleteRole = (id) => apiService.deleteRole(id);

// Exports individuels pour les comptes
export const getAccounts = () => apiService.getAccounts();
export const getAccountById = (id) => apiService.getAccountById(id);
export const createAccount = (accountData) => apiService.createAccount(accountData);
export const updateAccount = (id, accountData) => apiService.updateAccount(id, accountData);
export const deleteAccount = (id) => apiService.deleteAccount(id);

// Exports individuels pour les zones
export const getZones = () => apiService.getZones();
export const getZoneById = (id) => apiService.getZoneById(id);
export const createZone = (zoneData) => apiService.createZone(zoneData);
export const updateZone = (id, zoneData) => apiService.updateZone(id, zoneData);
export const deleteZone = (id) => apiService.deleteZone(id);

// Exports individuels pour les utilisateurs
export const getUsers = () => apiService.getUsers();
export const getUserById = (id) => apiService.getUserById(id);
export const createUser = (userData) => apiService.createUser(userData);
export const updateUser = (id, userData) => apiService.updateUser(id, userData);
export const deleteUser = (id) => apiService.deleteUser(id);

// Exports individuels pour les projets
export const getProjects = () => apiService.getProjects();
export const getProjectById = (id) => apiService.getProjectById(id);

export default api; 