import { Injectable } from '@nestjs/common';
import { BaseApiProvider } from '../base-api-provider';
import { ApiResponse, EmailValidationResult, PersonEnrichmentResult } from '../api-provider.interface';
import { ApiProvider } from '../../../domain/entities/enrichment-log.entity';

interface HunterEmailVerificationResponse {
  data: {
    status: string;
    result: string;
    score: number;
    email: string;
    regexp: boolean;
    gibberish: boolean;
    disposable: boolean;
    webmail: boolean;
    mx_records: boolean;
    smtp_server: boolean;
    smtp_check: boolean;
    accept_all: boolean;
    block: boolean;
    sources: Array<{
      domain: string;
      uri: string;
      extracted_on: string;
      last_seen_on: string;
      still_on_page: boolean;
    }>;
  };
  meta: {
    params: {
      email: string;
    };
  };
}

interface HunterPersonEnrichmentResponse {
  data: {
    email: string;
    first_name: string;
    last_name: string;
    score: number;
    domain: string;
    accept_all: boolean;
    role: boolean;
    disposable: boolean;
    free_email: boolean;
    mx_record: boolean;
    smtp_server: boolean;
    smtp_check: boolean;
    catch_all: boolean;
    lead: boolean;
    sources: Array<{
      domain: string;
      uri: string;
      extracted_on: string;
      last_seen_on: string;
      still_on_page: boolean;
    }>;
  };
  meta: {
    params: {
      email: string;
    };
  };
}

@Injectable()
export class HunterProvider extends BaseApiProvider {
  constructor() {
    super({
      provider: ApiProvider.HUNTER,
      name: 'Hunter',
      baseUrl: 'https://api.hunter.io/v2',
      apiKey: process.env.HUNTER_API_KEY || '',
      rateLimit: {
        requests: 25, // 25 requests per month (free tier)
        window: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
      costPerRequest: 0.02, // $0.02 per request
      isActive: !!process.env.HUNTER_API_KEY,
      priority: 2,
    });
  }

  async validateEmail(email: string): Promise<ApiResponse<EmailValidationResult>> {
    if (!this.isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email format',
        responseTime: 0,
      };
    }

    const response = await this.makeRequest<HunterEmailVerificationResponse>('GET', '/email-verifier', {
      api_key: this.config.apiKey,
      email,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Unknown error',
        responseTime: response.responseTime,
      };
    }

    const data = response.data.data;
    const score = this.calculateEmailScore(data);
    const details = this.generateValidationDetails(data);
    const suggestions = this.generateSuggestions(data);

    return {
      success: true,
      data: {
        isValid: data.status === 'valid',
        score,
        details,
        suggestions,
      },
      cost: response.cost,
      responseTime: response.responseTime,
    };
  }

  async enrichCompany(domain: string): Promise<ApiResponse> {
    // Hunter no proporciona enriquecimiento de empresas
    return {
      success: false,
      error: 'Company enrichment not supported by Hunter',
      responseTime: 0,
    };
  }

  async enrichPerson(email: string): Promise<ApiResponse<PersonEnrichmentResult>> {
    if (!this.isValidEmail(email)) {
      return {
        success: false,
        error: 'Invalid email format',
        responseTime: 0,
      };
    }

    const response = await this.makeRequest<HunterPersonEnrichmentResponse>('GET', '/email-finder', {
      api_key: this.config.apiKey,
      email,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Unknown error',
        responseTime: response.responseTime,
      };
    }

    const data = response.data.data;

    return {
      success: true,
      data: {
        firstName: data.first_name,
        lastName: data.last_name,
        fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        company: data.domain,
        linkedinUrl: this.findLinkedInSource(data.sources),
        socialProfiles: {
          linkedin: this.findLinkedInSource(data.sources),
        },
      },
      cost: response.cost,
      responseTime: response.responseTime,
    };
  }

  private calculateEmailScore(data: HunterEmailVerificationResponse['data']): number {
    let score = 0;

    // Status válido (30 puntos)
    if (data.status === 'valid') score += 30;

    // Result válido (20 puntos)
    if (data.result === 'valid') score += 20;

    // Score de Hunter (20 puntos)
    score += Math.round(data.score * 0.2);

    // MX records (10 puntos)
    if (data.mx_records) score += 10;

    // SMTP check (15 puntos)
    if (data.smtp_check) score += 15;

    // No es catch-all (5 puntos)
    if (!data.accept_all) score += 5;

    return Math.min(100, score);
  }

  private generateValidationDetails(data: HunterEmailVerificationResponse['data']): string {
    const details = [];

    details.push(`📊 Status: ${data.status}`);
    details.push(`✅ Result: ${data.result}`);
    details.push(`🎯 Score: ${data.score}/100`);

    if (data.regexp) {
      details.push('✅ Formato de email válido');
    } else {
      details.push('❌ Formato de email inválido');
    }

    if (data.gibberish) {
      details.push('⚠️ Email parece ser aleatorio');
    }

    if (data.disposable) {
      details.push('⚠️ Email desechable detectado');
    }

    if (data.webmail) {
      details.push('ℹ️ Email gratuito detectado');
    }

    if (data.mx_records) {
      details.push('✅ Registros MX encontrados');
    } else {
      details.push('❌ No se encontraron registros MX');
    }

    if (data.smtp_check) {
      details.push('✅ Verificación SMTP exitosa');
    } else {
      details.push('❌ Verificación SMTP fallida');
    }

    if (data.accept_all) {
      details.push('⚠️ Dominio con catch-all habilitado');
    }

    if (data.block) {
      details.push('❌ Email bloqueado');
    }

    details.push(`📚 Fuentes encontradas: ${data.sources.length}`);

    return details.join('\n');
  }

  private generateSuggestions(data: HunterEmailVerificationResponse['data']): string[] {
    const suggestions = [];

    if (data.status !== 'valid') {
      suggestions.push('El email no es válido según Hunter');
    }

    if (data.gibberish) {
      suggestions.push('Considerar verificar manualmente este email');
    }

    if (data.disposable) {
      suggestions.push('Este email puede ser temporal o desechable');
    }

    if (data.accept_all) {
      suggestions.push('Considerar verificar manualmente este email');
    }

    if (data.block) {
      suggestions.push('Este email está bloqueado');
    }

    if (data.sources.length === 0) {
      suggestions.push('No se encontraron fuentes públicas para este email');
    }

    return suggestions;
  }

  private findLinkedInSource(sources: Array<{ domain: string; uri: string }>): string | undefined {
    const linkedinSource = sources.find(source => 
      source.uri.includes('linkedin.com') || 
      source.domain === 'linkedin.com'
    );
    return linkedinSource?.uri;
  }
} 