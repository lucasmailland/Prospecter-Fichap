// ========================================================================================
// TIPOS DE API - Responses y DTOs específicos de API
// ========================================================================================

// Re-exports de tipos comunes (sin duplicar Lead)
export type { User, LeadStatus, LeadSource, Lead } from './common.types';

/**
 * Request/Response de leads
 */
export interface CreateLeadRequest {
  email: string;
  name?: string;
  company?: string;
  position?: string;
  phone?: string;
  website?: string;
  notes?: string;
}

export interface LeadResponse {
  id: string;
  email: string;
  name: string;
  company?: string;
  position?: string;
  phone?: string;
  website?: string;
  score: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadsListResponse {
  leads: LeadResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Respuesta de enriquecimiento
 */
export interface EnrichmentResponse {
  success: boolean;
  lead: LeadResponse;
  enrichmentData: {
    email?: {
      isValid: boolean;
      deliverable: boolean;
      provider?: string;
    };
    company?: {
      name?: string;
      domain?: string;
      industry?: string;
      size?: string;
      location?: string;
    };
    social?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };
  sources: string[];
  processingTime: number;
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Respuesta de 2FA
 */
export interface TwoFASetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
  manualEntryKey: string;
}

export interface TwoFAVerifyRequest {
  token: string;
  secret?: string;
}

/**
 * Reset Password
 */
export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirmRequest {
  token: string;
  newPassword: string;
}

/**
 * Estados de respuesta de API genéricos
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ========================================================================================
// TIPOS LEGACY DEL BACKEND (para compatibilidad)
// ========================================================================================

// Imports específicos para evitar errores
import { User, Lead, LeadSource } from './common.types';

export interface CreateProspectDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
}

export interface UpdateProspectDto {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
}

export interface CreateLeadDto {
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  linkedinUrl?: string;
  hubspotId?: string;
  notes?: string;
  source?: LeadSource;
}

export interface UpdateLeadDto {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface EnrichLeadDto {
  leadId: string;
  enrichmentTypes?: string[];
}

export interface BulkEnrichDto {
  leadIds: string[];
  enrichmentTypes?: string[];
}

export interface EnrichmentResult {
  success: boolean;
  lead: Lead | null;
  totalCost: number;
  totalTime: number;
  logs: EnrichmentLog[];
}

export interface BulkEnrichmentResult {
  success: boolean;
  results: Array<{
    success: boolean;
    leadId: string;
    lead: Lead | null;
    totalCost: number;
    totalTime: number;
  }>;
  summary: {
    totalLeads: number;
    successful: number;
    failed: number;
    totalCost: number;
    totalTime: number;
  };
}

export interface EnrichmentLog {
  id: string;
  type: string;
  provider: string;
  status: string;
  responseTime: number;
  cost: number;
  errorMessage?: string;
}

export interface ProviderStatus {
  name: string;
  provider: string;
  isActive: boolean;
  isRateLimited: boolean;
  remainingRequests: number;
  costPerRequest: number;
  priority: number;
}

export interface EnrichmentStats {
  totalEnrichments: number;
  successfulEnrichments: number;
  failedEnrichments: number;
  totalCost: number;
  averageResponseTime: number;
  topProviders: Array<{
    provider: string;
    requests: number;
    successRate: number;
    totalCost: number;
  }>;
  enrichmentTypes: {
    email_validation: number;
    company_enrichment: number;
    person_enrichment: number;
    scoring: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 