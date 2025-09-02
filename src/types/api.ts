// Interfaces pour les réponses et requêtes API

import { 
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
  UserFilter
} from './database';

// Types de base pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Types pour l'authentification
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user: User;
  message?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

// Types pour les requêtes de création/modification
export interface CreateDomainRequest {
  name: string;
}

export interface UpdateDomainRequest {
  name?: string;
}

export interface CreateRoleRequest {
  name: string;
  type?: string;
  description?: string;
  state?: 'enabled' | 'disabled';
}

export interface UpdateRoleRequest {
  name?: string;
  type?: string;
  description?: string;
  state?: 'enabled' | 'disabled';
}

export interface CreateAccountRequest {
  name: string;
  state?: 'enabled' | 'disabled';
  role_id?: number;
  domain_id?: number;
}

export interface UpdateAccountRequest {
  name?: string;
  state?: 'enabled' | 'disabled';
  role_id?: number;
  domain_id?: number;
}

export interface CreateZoneRequest {
  name: string;
}

export interface UpdateZoneRequest {
  name?: string;
}

export interface CreateProjectRequest {
  name: string;
  display_text?: string;
  state?: 'enabled' | 'disabled';
  domain_id?: number;
  account_id?: number;
}

export interface UpdateProjectRequest {
  name?: string;
  display_text?: string;
  state?: 'enabled' | 'disabled';
  domain_id?: number;
  account_id?: number;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
  account_id?: number;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
  account_id?: number;
}

// Types pour les modules Compute
export interface Instance {
  id: number;
  name: string;
  state: string;
  template_id: number;
  zone_id: number;
  account_id: number;
  domain_id: number;
  created_at: string;
}

export interface Template {
  id: number;
  name: string;
  display_text: string;
  format: string;
  size: number;
  state: string;
  created_at: string;
}

export interface ISO {
  id: number;
  name: string;
  display_text: string;
  format: string;
  size: number;
  state: string;
  created_at: string;
}

export interface Snapshot {
  id: number;
  name: string;
  volume_id: number;
  state: string;
  created_at: string;
}

export interface KubernetesCluster {
  id: number;
  name: string;
  state: string;
  zone_id: number;
  account_id: number;
  created_at: string;
}

export interface AutoscalingGroup {
  id: number;
  name: string;
  state: string;
  min_members: number;
  max_members: number;
  account_id: number;
  created_at: string;
}

export interface InstanceGroup {
  id: number;
  name: string;
  state: string;
  account_id: number;
  created_at: string;
}

export interface SSHKeyPair {
  id: number;
  name: string;
  fingerprint: string;
  account_id: number;
  created_at: string;
}

export interface UserData {
  id: number;
  name: string;
  user_data: string;
  account_id: number;
  created_at: string;
}

// Types pour les modules Storage
export interface Volume {
  id: number;
  name: string;
  size: number;
  state: string;
  volume_type: string;
  account_id: number;
  zone_id: number;
  created_at: string;
}

export interface Backup {
  id: number;
  name: string;
  volume_id: number;
  state: string;
  size: number;
  created_at: string;
}

export interface Bucket {
  id: number;
  name: string;
  size: number;
  state: string;
  account_id: number;
  created_at: string;
}

export interface SharedFileSystem {
  id: number;
  name: string;
  size: number;
  state: string;
  protocol: string;
  account_id: number;
  created_at: string;
}

// Types pour les modules Network
export interface Network {
  id: number;
  name: string;
  display_text: string;
  state: string;
  network_type: string;
  zone_id: number;
  account_id: number;
  created_at: string;
}

export interface VPC {
  id: number;
  name: string;
  display_text: string;
  state: string;
  cidr: string;
  zone_id: number;
  account_id: number;
  created_at: string;
}

export interface SecurityGroup {
  id: number;
  name: string;
  description: string;
  state: string;
  account_id: number;
  created_at: string;
}

export interface LoadBalancer {
  id: number;
  name: string;
  state: string;
  algorithm: string;
  account_id: number;
  network_id: number;
  created_at: string;
}

export interface VPN {
  id: number;
  name: string;
  state: string;
  account_id: number;
  vpc_id: number;
  created_at: string;
}

export interface PublicIP {
  id: number;
  ip_address: string;
  state: string;
  account_id: number;
  zone_id: number;
  created_at: string;
}

// Types pour les filtres API
export interface InstanceFilter {
  name?: string;
  state?: string;
  account_id?: number;
  zone_id?: number;
}

export interface VolumeFilter {
  name?: string;
  state?: string;
  volume_type?: string;
  account_id?: number;
}

export interface NetworkFilter {
  name?: string;
  state?: string;
  network_type?: string;
  account_id?: number;
  zone_id?: number;
}

// Types pour les statistiques et analytics
export interface ProjectAnalytics {
  project_id: number;
  total_instances: number;
  total_volumes: number;
  total_networks: number;
  total_cost: number;
  period: string;
}

export interface CostAnalysis {
  account_id: number;
  total_cost: number;
  compute_cost: number;
  storage_cost: number;
  network_cost: number;
  period: string;
  breakdown: {
    instances: number;
    volumes: number;
    networks: number;
    load_balancers: number;
  };
} 