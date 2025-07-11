// ========================================================================================
// TIPOS COMUNES - Coherentes con Prisma Schema
// ========================================================================================

// Enums del sistema (coherentes con Prisma)
export enum LeadStatus {
  NEW = 'NEW',
  ENRICHED = 'ENRICHED',
  VALIDATED = 'VALIDATED',
  PRIORITIZED = 'PRIORITIZED',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export enum LeadSource {
  HUBSPOT = 'HUBSPOT',
  MANUAL = 'MANUAL',
  IMPORT = 'IMPORT',
  API = 'API',
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
  VIEWER = 'VIEWER'
}

export enum EnrichmentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  RATE_LIMITED = 'RATE_LIMITED'
}

// ========================================================================================
// USER TYPES
// ========================================================================================

export interface User {
  id: string;
  name?: string;
  email: string;
  emailVerified?: string;
  image?: string;
  role: UserRole;
  company?: string;
  position?: string;
  linkedin?: string;
  
  // 2FA
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string;
  
  // Security
  lastLogin?: string;
  loginFailures: number;
  accountLocked: boolean;
  accountLockedUntil?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  position?: string;
  image?: string;
}

// ========================================================================================
// LEAD TYPES - Coherentes con Prisma Lead model
// ========================================================================================

export interface Lead {
  id: string;
  
  // Datos básicos
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  linkedinUrl?: string;
  
  // Datos de enriquecimiento
  companySize?: string;
  industry?: string;
  location?: string;
  country?: string;
  city?: string;
  state?: string;
  timezone?: string;
  language?: string;
  
  // Validación de email
  isEmailValid: boolean;
  emailValidationScore?: number;
  emailValidationDetails?: string;
  
  // Scoring y priorización
  score: number;
  priority: number;
  scoringFactors?: string; // JSON string
  
  // Estado y seguimiento
  status: LeadStatus;
  source: LeadSource;
  hubspotId?: string;
  notes?: string;
  metadata?: Record<string, any>;
  
  // Auditoría
  createdAt: Date;
  updatedAt: Date;
  enrichedAt?: Date;
  validatedAt?: Date;
  lastContactedAt?: Date;
  
  // Relations
  userId: string;
  user?: User;
  enrichments?: EnrichmentLog[];
}

// ========================================================================================
// ENRICHMENT TYPES
// ========================================================================================

export interface EnrichmentLog {
  id: string;
  leadId: string;
  type: string; // email_validation, company_enrichment, person_enrichment
  provider: string; // clearbit, hunter, zerobounce, etc.
  status: EnrichmentStatus;
  data?: Record<string, any>; // JSON data
  error?: string;
  responseTime?: number; // milliseconds
  cost?: number; // cost in credits/currency
  createdAt: Date;
  
  // Relations
  lead?: Lead;
}

// ========================================================================================
// ANALYTICS TYPES
// ========================================================================================

export interface Analytics {
  id: string;
  userId: string;
  date: Date;
  type: string; // daily, weekly, monthly
  metrics: Record<string, any>; // JSON metrics
  createdAt: Date;
}

// ========================================================================================
// FORM TYPES - Para formularios de entrada
// ========================================================================================

export interface CreateLeadForm {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  linkedinUrl?: string;
  notes?: string;
  source?: LeadSource;
}

export interface UpdateLeadForm {
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  linkedinUrl?: string;
  notes?: string;
  status?: LeadStatus;
  priority?: number;
}

// ========================================================================================
// ENRICHMENT REQUEST TYPES
// ========================================================================================

export interface EnrichmentRequest {
  leadId: string;
  enrichmentTypes?: string[]; // ['email_validation', 'company_enrichment', 'person_enrichment']
}

export interface BulkEnrichmentRequest {
  leadIds: string[];
  enrichmentTypes?: string[];
}

// ========================================================================================
// RESPONSE TYPES
// ========================================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ========================================================================================
// UTILITY TYPES
// ========================================================================================

export type LeadWithUser = Lead & {
  user: User;
};

export type LeadWithEnrichments = Lead & {
  enrichments: EnrichmentLog[];
};

export type LeadWithFullData = Lead & {
  user: User;
  enrichments: EnrichmentLog[];
};

// ========================================================================================
// FILTER TYPES
// ========================================================================================

export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  company?: string;
  score?: {
    min?: number;
    max?: number;
  };
  priority?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  search?: string;
}

export interface LeadSortOptions {
  field: 'createdAt' | 'updatedAt' | 'score' | 'priority' | 'email' | 'company';
  order: 'asc' | 'desc';
}

// ========================================================================================
// DASHBOARD TYPES
// ========================================================================================

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  enrichedLeads: number;
  convertedLeads: number;
  averageScore: number;
  topCompanies: Array<{
    company: string;
    count: number;
  }>;
  leadsByStatus: Record<LeadStatus, number>;
  leadsBySource: Record<LeadSource, number>;
}

// ========================================================================================
// EXPORT TYPES
// ========================================================================================

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'json';
  filters?: LeadFilters;
  fields?: (keyof Lead)[];
  includeEnrichments?: boolean;
}

// ========================================================================================
// TIPOS COMUNES CENTRALIZADOS - Evita duplicación
// ========================================================================================

export interface ContactInfo {
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  website?: string;
}

export interface LeadMetrics {
  openRate?: number;
  responseRate?: number;
  conversionRate?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type ThemeMode = 'light' | 'dark';

export type StatusType = 'QUALIFIED' | 'POTENTIAL' | 'cold' | 'hot' | 'warm';

export type ChangeType = 'positive' | 'negative' | 'neutral';

export type ScoreLevel = 'excellent' | 'good' | 'fair' | 'poor';

// ========================================================================================
// INTERFACES DE COMPONENTES COMUNES
// ========================================================================================

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export interface BaseDropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export interface BaseFormProps<T> {
  initialData?: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

// ========================================================================================
// CONFIGURACIÓN GLOBAL
// ========================================================================================

export const APP_CONFIG = {
  name: 'Prospecter-Fichap',
  version: '1.0.0',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
  },
  pagination: {
    defaultPageSize: 25,
    maxPageSize: 100,
  },
  notifications: {
    defaultDuration: 5000,
    position: 'top-right' as const,
  },
} as const; 

// Task enums and types centralizados
export enum TaskStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
export enum TaskCategory {
  PROSPECTING = 'PROSPECTING',
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  MEETING = 'MEETING',
  FOLLOW_UP = 'FOLLOW_UP',
  RESEARCH = 'RESEARCH',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSING = 'CLOSING',
  CUSTOM = 'CUSTOM'
}
export enum TaskType {
  MANUAL = 'MANUAL',
  AUTOMATED = 'AUTOMATED',
  TEMPLATE = 'TEMPLATE',
  AI_GENERATED = 'AI_GENERATED',
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  MEETING = 'MEETING',
  LINKEDIN_MESSAGE = 'LINKEDIN_MESSAGE',
  WHATSAPP = 'WHATSAPP',
  PROPOSAL = 'PROPOSAL',
  DEMO = 'DEMO',
  FOLLOW_UP = 'FOLLOW_UP',
  REMINDER = 'REMINDER',
  NOTE = 'NOTE',
  RESEARCH = 'RESEARCH'
}
export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

export interface Task {
  id: string;
  subject: string;
  description?: string;
  category: TaskCategory;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  scheduledDate?: Date;
  scheduledTime?: string;
  contactEmail: string;
  contactName?: string;
  companyName?: string;
  leadId?: string;
  templateId?: string;
  customMessage?: string;
  estimatedDuration?: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  // IA: probabilidad de éxito sugerida
  successProbability?: number;
}

export interface TaskFilters {
  status?: TaskStatus[];
  category?: TaskCategory[];
  type?: TaskType[];
  priority?: TaskPriority[];
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
  syncStatus?: 'synced' | 'pending' | 'error';
  searchTerm?: string;
}

export interface TaskCreateInput {
  subject: string;
  description?: string;
  category: TaskCategory;
  type: TaskType;
  priority?: TaskPriority;
  scheduledDate?: Date;
  scheduledTime?: string;
  contactEmail: string;
  contactName?: string;
  companyName?: string;
  leadId?: string;
  templateId?: string;
  customMessage?: string;
  estimatedDuration?: number;
} 