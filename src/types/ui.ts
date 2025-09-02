// Interfaces pour les composants UI et états de l'interface

// Types pour les états de chargement
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  message?: string;
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Types pour les modales
export interface ModalState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// Types pour les formulaires
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
}

export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Types pour les tableaux de données
export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableState<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  sorting: {
    field: keyof T | null;
    order: 'asc' | 'desc' | null;
  };
  filters: Record<string, any>;
  selectedRows: T[];
}

// Types pour les filtres de recherche
export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: any;
  secondValue?: any; // Pour les opérateurs 'between'
}

export interface FilterState {
  filters: SearchFilter[];
  search: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// Types pour les graphiques et visualisations
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }>;
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: {
    legend?: {
      display: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled: boolean;
    };
  };
  scales?: {
    x?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
    y?: {
      display: boolean;
      title?: {
        display: boolean;
        text: string;
      };
    };
  };
}

// Types pour les breadcrumbs
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

// Types pour les menus de navigation
export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
  badge?: {
    count: number;
    color?: string;
  };
}

// Types pour les onglets
export interface TabItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  closable?: boolean;
}

// Types pour les états de l'application
export interface AppState {
  theme: 'light' | 'dark';
  sidebar: {
    collapsed: boolean;
    width: number;
  };
  header: {
    height: number;
    visible: boolean;
  };
  notifications: Notification[];
  modals: ModalState[];
}

// Types pour les actions utilisateur
export interface UserAction {
  type: string;
  payload: any;
  timestamp: Date;
  userId: number;
}

// Types pour les permissions
export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'list';
  conditions?: Record<string, any>;
}

export interface UserPermissions {
  userId: number;
  permissions: Permission[];
  roles: string[];
}

// Types pour les paramètres utilisateur
export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    widgets: string[];
  };
}

// Types pour les exports
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  filename?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
  columns?: string[];
}

// Types pour les imports
export interface ImportOptions {
  format: 'csv' | 'excel' | 'json';
  file: File;
  mapping?: Record<string, string>;
  skipFirstRow?: boolean;
  validateData?: boolean;
}

// Types pour les logs d'activité
export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Types pour les rapports
export interface Report {
  id: number;
  name: string;
  description?: string;
  type: 'analytics' | 'billing' | 'usage' | 'security';
  format: 'pdf' | 'excel' | 'csv';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
  filters?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
} 