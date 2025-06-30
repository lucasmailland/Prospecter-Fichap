import { ApiProvider } from '../../domain/entities/enrichment-log.entity';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  cost?: number;
  rateLimited?: boolean;
  responseTime: number;
}

export interface EmailValidationResult {
  isValid: boolean;
  score: number;
  details: string;
  suggestions?: string[];
}

export interface CompanyEnrichmentResult {
  name?: string;
  size?: string;
  industry?: string;
  website?: string;
  location?: string;
  country?: string;
  city?: string;
  state?: string;
  timezone?: string;
  language?: string;
  founded?: number;
  revenue?: string;
  employees?: number;
  description?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface PersonEnrichmentResult {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  timezone?: string;
  language?: string;
  linkedinUrl?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  bio?: string;
  avatar?: string;
}

export interface IApiProvider {
  readonly provider: ApiProvider;
  readonly name: string;
  readonly baseUrl: string;
  readonly apiKey: string;
  readonly rateLimit: {
    requests: number;
    window: number; // en milisegundos
  };
  readonly costPerRequest: number;
  readonly isActive: boolean;

  // Métodos principales
  validateEmail(email: string): Promise<ApiResponse<EmailValidationResult>>;
  enrichCompany(domain: string): Promise<ApiResponse<CompanyEnrichmentResult>>;
  enrichPerson(email: string): Promise<ApiResponse<PersonEnrichmentResult>>;
  
  // Métodos de utilidad
  isRateLimited(): boolean;
  getRemainingRequests(): number;
  resetRateLimit(): void;
  getCostEstimate(): number;
  
  // Métodos de configuración
  setApiKey(apiKey: string): void;
  setActive(active: boolean): void;
  updateRateLimit(requests: number, window: number): void;
}

export interface ApiProviderConfig {
  provider: ApiProvider;
  name: string;
  baseUrl: string;
  apiKey: string;
  rateLimit: {
    requests: number;
    window: number;
  };
  costPerRequest: number;
  isActive: boolean;
  priority: number; // Para fallback en cascada
} 