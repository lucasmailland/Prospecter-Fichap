// Tipos que coinciden con los DTOs del backend

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

export interface Lead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  website?: string;
  linkedinUrl?: string;
  score: number;
  priority: number;
  status: string;
  isEmailValid: boolean;
  isHighPriority: boolean;
  isReadyForContact: boolean;
  createdAt: string;
  updatedAt: string;
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

export enum LeadSource {
  WEBSITE = 'website',
  LINKEDIN = 'linkedin',
  COLD_EMAIL = 'cold_email',
  REFERRAL = 'referral',
  EVENT = 'event',
  IMPORT = 'import',
  API = 'api',
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
} 