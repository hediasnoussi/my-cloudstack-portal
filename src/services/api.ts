import axios, { AxiosResponse } from 'axios';
import {
  // Types de base de données
  Domain,
  Role,
  Account,
  Zone,
  Project,
  User,
  DatabaseResponse,
  DomainFilter,
  RoleFilter,
  AccountFilter,
  ProjectFilter,
  UserFilter,
  // Types API
  ApiResponse,
  ApiListResponse,
  LoginCredentials,
  LoginResponse,
  CreateDomainRequest,
  UpdateDomainRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateAccountRequest,
  UpdateAccountRequest,
  CreateZoneRequest,
  UpdateZoneRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateUserRequest,
  UpdateUserRequest,
  // Types Compute
  Instance,
  Template,
  ISO,
  Snapshot,
  KubernetesCluster,
  AutoscalingGroup,
  InstanceGroup,
  // Types Storage
  Volume,
  Backup,
  Bucket,
  SharedFileSystem,

  // Types Analytics
  ProjectAnalytics,
  CostAnalysis
} from '../types';

// Configuration de base pour l'API
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
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Services API avec types TypeScript
export const apiService = {
  // Test de connexion
  testConnection: (): Promise<AxiosResponse<ApiResponse>> => 
    api.get('/test'),
  
  // Authentication
  login: (credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> => 
    api.post('/api/login', credentials),
  
  // Global endpoints - Domaines
  getDomains: (filters?: DomainFilter): Promise<AxiosResponse<ApiListResponse<Domain>>> => 
    api.get('/api/global/domains', { params: filters }),
  getDomainById: (id: number): Promise<AxiosResponse<ApiResponse<Domain>>> => 
    api.get(`/api/global/domains/${id}`),
  createDomain: (data: CreateDomainRequest): Promise<AxiosResponse<ApiResponse<Domain>>> => 
    api.post('/api/global/domains', data),
  updateDomain: (id: number, data: UpdateDomainRequest): Promise<AxiosResponse<ApiResponse<Domain>>> => 
    api.put(`/api/global/domains/${id}`, data),
  deleteDomain: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/api/global/domains/${id}`),
  
  // Global endpoints - Rôles
  getRoles: (filters?: RoleFilter): Promise<AxiosResponse<ApiListResponse<Role>>> => 
    api.get('/api/global/roles', { params: filters }),
  getRoleById: (id: number): Promise<AxiosResponse<ApiResponse<Role>>> => 
    api.get(`/api/global/roles/${id}`),
  createRole: (data: CreateRoleRequest): Promise<AxiosResponse<ApiResponse<Role>>> => 
    api.post('/api/global/roles', data),
  updateRole: (id: number, data: UpdateRoleRequest): Promise<AxiosResponse<ApiResponse<Role>>> => 
    api.put(`/api/global/roles/${id}`, data),
  deleteRole: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/api/global/roles/${id}`),
  
  // Global endpoints - Comptes
  getAccounts: (filters?: AccountFilter): Promise<AxiosResponse<ApiListResponse<Account>>> => 
    api.get('/api/global/accounts', { params: filters }),
  getAccountById: (id: number): Promise<AxiosResponse<ApiResponse<Account>>> => 
    api.get(`/api/global/accounts/${id}`),
  createAccount: (data: CreateAccountRequest): Promise<AxiosResponse<ApiResponse<Account>>> => 
    api.post('/api/global/accounts', data),
  updateAccount: (id: number, data: UpdateAccountRequest): Promise<AxiosResponse<ApiResponse<Account>>> => 
    api.put(`/api/global/accounts/${id}`, data),
  deleteAccount: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/api/global/accounts/${id}`),
  
  // Global endpoints - Zones
  getZones: (filters?: any): Promise<AxiosResponse<ApiListResponse<Zone>>> => 
    api.get('/api/global/zones', { params: filters }),
  getZoneById: (id: number): Promise<AxiosResponse<ApiResponse<Zone>>> => 
    api.get(`/api/global/zones/${id}`),
  createZone: (data: CreateZoneRequest): Promise<AxiosResponse<ApiResponse<Zone>>> => 
    api.post('/api/global/zones', data),
  updateZone: (id: number, data: UpdateZoneRequest): Promise<AxiosResponse<ApiResponse<Zone>>> => 
    api.put(`/api/global/zones/${id}`, data),
  deleteZone: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/api/global/zones/${id}`),
  
  // Users endpoints
  getUsers: (filters?: UserFilter): Promise<AxiosResponse<ApiListResponse<User>>> => 
    api.get('/api/users', { params: filters }),
  getUserById: (id: number): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.get(`/api/users/${id}`),
  createUser: (data: CreateUserRequest): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.post('/api/users', data),
  updateUser: (id: number, data: UpdateUserRequest): Promise<AxiosResponse<ApiResponse<User>>> => 
    api.put(`/api/users/${id}`, data),
  deleteUser: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/api/users/${id}`),
  
  // Projects endpoints
  getProjects: (filters?: ProjectFilter): Promise<AxiosResponse<ApiListResponse<Project>>> => 
    api.get('/api/projects', { params: filters }),
  getProjectById: (id: number): Promise<AxiosResponse<ApiResponse<Project>>> => 
    api.get(`/api/projects/${id}`),
  createProject: (data: CreateProjectRequest): Promise<AxiosResponse<ApiResponse<Project>>> => 
    api.post('/api/projects', data),
  updateProject: (id: number, data: UpdateProjectRequest): Promise<AxiosResponse<ApiResponse<Project>>> => 
    api.put(`/api/projects/${id}`, data),
  deleteProject: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/api/projects/${id}`),
  
  // Compute endpoints - Instances
  getInstances: (filters?: any): Promise<AxiosResponse<ApiListResponse<Instance>>> => 
    api.get('/api/compute/instances', { params: filters }),
  getInstanceById: (id: number): Promise<AxiosResponse<ApiResponse<Instance>>> => 
    api.get(`/api/compute/instances/${id}`),
  createInstance: (data: any): Promise<AxiosResponse<ApiResponse<Instance>>> => 
    api.post('/api/compute/instances', data),
  updateInstance: (id: number, data: any): Promise<AxiosResponse<ApiResponse<Instance>>> => 
    api.put(`/api/compute/instances/${id}`, data),
  deleteInstance: (id: number): Promise<AxiosResponse<ApiResponse>> => 
    api.delete(`/api/compute/instances/${id}`),
  
  // Compute endpoints - Templates
  getTemplates: (filters?: any): Promise<AxiosResponse<ApiListResponse<Template>>> => 
    api.get('/api/compute/templates', { params: filters }),
  getTemplateById: (id: number): Promise<AxiosResponse<ApiResponse<Template>>> => 
    api.get(`/api/compute/templates/${id}`),
  
  // Compute endpoints - ISOs
  getISOs: (filters?: any): Promise<AxiosResponse<ApiListResponse<ISO>>> => 
    api.get('/api/compute/isos', { params: filters }),
  getISOById: (id: number): Promise<AxiosResponse<ApiResponse<ISO>>> => 
    api.get(`/api/compute/isos/${id}`),
  
  // Compute endpoints - Snapshots
  getInstanceSnapshots: (filters?: any): Promise<AxiosResponse<ApiListResponse<Snapshot>>> => 
    api.get('/api/compute/instance-snapshots', { params: filters }),
  getInstanceSnapshotById: (id: number): Promise<AxiosResponse<ApiResponse<Snapshot>>> => 
    api.get(`/api/compute/instance-snapshots/${id}`),
  
  // Compute endpoints - Kubernetes
  getKubernetesClusters: (filters?: any): Promise<AxiosResponse<ApiListResponse<KubernetesCluster>>> => 
    api.get('/api/compute/kubernetes-clusters', { params: filters }),
  getKubernetesClusterById: (id: number): Promise<AxiosResponse<ApiResponse<KubernetesCluster>>> => 
    api.get(`/api/compute/kubernetes-clusters/${id}`),
  
  // Compute endpoints - Autoscaling
  getAutoscalingGroups: (filters?: any): Promise<AxiosResponse<ApiListResponse<AutoscalingGroup>>> => 
    api.get('/api/compute/autoscaling-groups', { params: filters }),
  getAutoscalingGroupById: (id: number): Promise<AxiosResponse<ApiResponse<AutoscalingGroup>>> => 
    api.get(`/api/compute/autoscaling-groups/${id}`),
  
  // Compute endpoints - Instance Groups
  getInstanceGroups: (filters?: any): Promise<AxiosResponse<ApiListResponse<InstanceGroup>>> => 
    api.get('/api/compute/instance-groups', { params: filters }),
  getInstanceGroupById: (id: number): Promise<AxiosResponse<ApiResponse<InstanceGroup>>> => 
    api.get(`/api/compute/instance-groups/${id}`),
  

  
  // Storage endpoints - Volumes
  getVolumes: (filters?: any): Promise<AxiosResponse<ApiListResponse<Volume>>> => 
    api.get('/api/storage/volumes', { params: filters }),
  getVolumeById: (id: number): Promise<AxiosResponse<ApiResponse<Volume>>> => 
    api.get(`/api/storage/volumes/${id}`),
  
  // Storage endpoints - Snapshots
  getSnapshots: (filters?: any): Promise<AxiosResponse<ApiListResponse<Snapshot>>> => 
    api.get('/api/storage/snapshots', { params: filters }),
  getSnapshotById: (id: number): Promise<AxiosResponse<ApiResponse<Snapshot>>> => 
    api.get(`/api/storage/snapshots/${id}`),
  

  
  // Storage endpoints - Buckets
  getBuckets: (filters?: any): Promise<AxiosResponse<ApiListResponse<Bucket>>> => 
    api.get('/api/storage/buckets', { params: filters }),
  getBucketById: (id: number): Promise<AxiosResponse<ApiResponse<Bucket>>> => 
    api.get(`/api/storage/buckets/${id}`),
  
  // Storage endpoints - Shared File Systems
  getSharedFileSystems: (filters?: any): Promise<AxiosResponse<ApiListResponse<SharedFileSystem>>> => 
    api.get('/api/storage/shared-file-systems', { params: filters }),
  getSharedFileSystemById: (id: number): Promise<AxiosResponse<ApiResponse<SharedFileSystem>>> => 
    api.get(`/api/storage/shared-file-systems/${id}`),
  

  
  // Analytics endpoints
  getProjectAnalytics: (projectId: number): Promise<AxiosResponse<ApiResponse<ProjectAnalytics>>> => 
    api.get(`/api/analytics/projects/${projectId}`),
  getCostAnalysis: (accountId: number): Promise<AxiosResponse<ApiResponse<CostAnalysis>>> => 
    api.get(`/api/analytics/costs/${accountId}`),
};

export default api; 