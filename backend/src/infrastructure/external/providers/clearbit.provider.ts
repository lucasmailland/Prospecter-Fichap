import { Injectable } from '@nestjs/common';
import { BaseApiProvider } from '../base-api-provider';
import { ApiResponse, CompanyEnrichmentResult } from '../api-provider.interface';
import { ApiProvider } from '../../../domain/entities/enrichment-log.entity';

interface ClearbitCompanyResponse {
  name: string;
  legalName: string;
  domain: string;
  domainAliases: string[];
  site: {
    phoneNumbers: string[];
    emailAddresses: string[];
  };
  category: {
    industry: string;
    subIndustry: string;
    sector: string;
    sicCode: string;
    naicsCode: string;
  };
  tags: string[];
  description: string;
  foundedYear: number;
  location: {
    address: string;
    address2: string;
    city: string;
    state: string;
    stateCode: string;
    zip: string;
    country: string;
    countryCode: string;
    lat: number;
    lng: number;
  };
  timeZone: string;
  utcOffset: number;
  geo: {
    country: string;
    state: string;
    city: string;
    lat: number;
    lng: number;
  };
  metrics: {
    alexaUsRank: number;
    alexaGlobalRank: number;
    employees: number;
    employeesRange: string;
    marketCap: number;
    raised: number;
    annualRevenue: number;
    estimatedAnnualRevenue: string;
    fiscalYearEnd: number;
  };
  facebook: {
    handle: string;
    likes: number;
    id: string;
  };
  linkedin: {
    handle: string;
    id: string;
  };
  twitter: {
    handle: string;
    id: string;
    bio: string;
    followers: number;
    following: number;
    location: string;
    site: string;
    avatar: string;
  };
  logo: string;
  crunchbase: {
    handle: string;
  };
  emailProvider: boolean;
  type: string;
  ticker: string;
  phone: string;
  indexedAt: string;
  tech: string[];
  techCategories: string[];
  parent: {
    domain: string;
    name: string;
  };
  ultimateParent: {
    domain: string;
    name: string;
  };
}

@Injectable()
export class ClearbitProvider extends BaseApiProvider {
  constructor() {
    super({
      provider: ApiProvider.CLEARBIT,
      name: 'Clearbit',
      baseUrl: 'https://company.clearbit.com/v2',
      apiKey: process.env.CLEARBIT_API_KEY || '',
      rateLimit: {
        requests: 1000, // 1000 requests per month (free tier)
        window: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
      costPerRequest: 0.05, // $0.05 per request
      isActive: !!process.env.CLEARBIT_API_KEY,
      priority: 3,
    });

    // Configurar autenticación básica para Clearbit
    this.httpClient.defaults.auth = {
      username: this.config.apiKey,
      password: '',
    };
  }

  async validateEmail(email: string): Promise<ApiResponse> {
    // Clearbit no proporciona validación de emails
    return {
      success: false,
      error: 'Email validation not supported by Clearbit',
      responseTime: 0,
    };
  }

  async enrichCompany(domain: string): Promise<ApiResponse<CompanyEnrichmentResult>> {
    if (!domain) {
      return {
        success: false,
        error: 'Domain is required',
        responseTime: 0,
      };
    }

    // Limpiar el dominio
    const cleanDomain = this.cleanDomain(domain);

    const response = await this.makeRequest<ClearbitCompanyResponse>('GET', `/companies/find`, {
      domain: cleanDomain,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Unknown error',
        responseTime: response.responseTime,
      };
    }

    const data = response.data;

    return {
      success: true,
      data: {
        name: data.name,
        size: this.mapEmployeeRange(data.metrics?.employeesRange),
        industry: data.category?.industry,
        website: data.domain,
        location: this.formatLocation(data.location),
        country: data.location?.country,
        city: data.location?.city,
        state: data.location?.state,
        timezone: data.timeZone,
        language: this.detectLanguage(data.description),
        founded: data.foundedYear,
        revenue: this.formatRevenue(data.metrics?.annualRevenue),
        employees: data.metrics?.employees,
        description: data.description,
        socialProfiles: {
          linkedin: data.linkedin?.handle ? `https://linkedin.com/company/${data.linkedin.handle}` : undefined,
          twitter: data.twitter?.handle ? `https://twitter.com/${data.twitter.handle}` : undefined,
          facebook: data.facebook?.handle ? `https://facebook.com/${data.facebook.handle}` : undefined,
        },
      },
      cost: response.cost,
      responseTime: response.responseTime,
    };
  }

  async enrichPerson(email: string): Promise<ApiResponse> {
    // Clearbit no proporciona enriquecimiento de personas en el plan gratuito
    return {
      success: false,
      error: 'Person enrichment not supported by Clearbit',
      responseTime: 0,
    };
  }

  private cleanDomain(domain: string): string {
    return domain
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0];
  }

  private mapEmployeeRange(range?: string): string {
    if (!range) return 'Unknown';
    
    const mapping: Record<string, string> = {
      '1-10': '1-10 employees',
      '11-50': '11-50 employees',
      '51-100': '51-100 employees',
      '101-250': '101-250 employees',
      '251-500': '251-500 employees',
      '501-1000': '501-1000 employees',
      '1001-5000': '1001-5000 employees',
      '5001-10000': '5001-10000 employees',
      '10001+': '10000+ employees',
    };

    return mapping[range] || range;
  }

  private formatLocation(location?: ClearbitCompanyResponse['location']): string {
    if (!location) return '';

    const parts = [
      location.city,
      location.state,
      location.country,
    ].filter(Boolean);

    return parts.join(', ');
  }

  private detectLanguage(text?: string): string {
    if (!text) return 'Unknown';
    
    // Detección básica de idioma basada en palabras comunes
    const spanishWords = ['empresa', 'servicios', 'productos', 'solución', 'tecnología'];
    const englishWords = ['company', 'services', 'products', 'solution', 'technology'];
    
    const textLower = text.toLowerCase();
    
    const spanishCount = spanishWords.filter(word => textLower.includes(word)).length;
    const englishCount = englishWords.filter(word => textLower.includes(word)).length;
    
    if (spanishCount > englishCount) return 'Spanish';
    if (englishCount > spanishCount) return 'English';
    
    return 'Unknown';
  }

  private formatRevenue(revenue?: number): string {
    if (!revenue) return 'Unknown';
    
    if (revenue >= 1000000000) {
      return `$${(revenue / 1000000000).toFixed(1)}B`;
    } else if (revenue >= 1000000) {
      return `$${(revenue / 1000000).toFixed(1)}M`;
    } else if (revenue >= 1000) {
      return `$${(revenue / 1000).toFixed(1)}K`;
    } else {
      return `$${revenue}`;
    }
  }
} 