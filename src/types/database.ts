// Interfaces pour les tables de la base de données

export interface Domain {
  id: number;
  name: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  type?: string;
  description?: string;
  state: 'enabled' | 'disabled';
  created_at: string;
}

export interface Account {
  id: number;
  name: string;
  state: 'enabled' | 'disabled';
  role_id?: number;
  domain_id?: number;
  created_at: string;
  // Relations
  role?: Role;
  domain?: Domain;
}

export interface Zone {
  id: number;
  name: string;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  display_text?: string;
  state: 'enabled' | 'disabled';
  domain_id?: number;
  account_id?: number;
  created_at: string;
  // Relations
  domain?: Domain;
  account?: Account;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  account_id?: number;
  created_at: string;
  // Relations
  account?: Account;
}

// Types pour les requêtes de base de données
export interface DatabaseQuery {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  search?: string;
}

export interface DatabaseResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Types pour les filtres
export interface DomainFilter extends DatabaseQuery {
  name?: string;
}

export interface RoleFilter extends DatabaseQuery {
  name?: string;
  type?: string;
  state?: 'enabled' | 'disabled';
}

export interface AccountFilter extends DatabaseQuery {
  name?: string;
  state?: 'enabled' | 'disabled';
  role_id?: number;
  domain_id?: number;
}

export interface ProjectFilter extends DatabaseQuery {
  name?: string;
  display_text?: string;
  state?: 'enabled' | 'disabled';
  domain_id?: number;
  account_id?: number;
}

export interface UserFilter extends DatabaseQuery {
  username?: string;
  email?: string;
  role?: 'admin' | 'user';
  account_id?: number;
} 