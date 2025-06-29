import { Injectable } from '@nestjs/common';
import { BaseApiProvider } from '../base-api-provider';
import { ApiResponse, EmailValidationResult } from '../api-provider.interface';
import { ApiProvider } from '../../../domain/entities/enrichment-log.entity';

interface MailboxLayerResponse {
  email: string;
  user: string;
  domain: string;
  mx_found: boolean;
  smtp_check: boolean;
  catch_all: boolean;
  role: boolean;
  disposable: boolean;
  free_email: boolean;
  score: number;
  format_valid: boolean;
}

@Injectable()
export class MailboxLayerProvider extends BaseApiProvider {
  constructor() {
    super({
      provider: ApiProvider.MAILBOXLAYER,
      name: 'MailboxLayer',
      baseUrl: 'http://apilayer.net/api',
      apiKey: process.env.MAILBOXLAYER_API_KEY || '',
      rateLimit: {
        requests: 100, // 100 requests per month (free tier)
        window: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
      costPerRequest: 0.01, // $0.01 per request
      isActive: !!process.env.MAILBOXLAYER_API_KEY,
      priority: 1,
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

    const response = await this.makeRequest<MailboxLayerResponse>('GET', '/check', {
      access_key: this.config.apiKey,
      email,
      smtp: 1,
      catch_all: 1,
      format: 1,
    });

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Unknown error',
        responseTime: response.responseTime,
      };
    }

    const data = response.data;
    const score = this.calculateEmailScore(data);
    const details = this.generateValidationDetails(data);
    const suggestions = this.generateSuggestions(data);

    return {
      success: true,
      data: {
        isValid: data.format_valid && data.mx_found && data.smtp_check,
        score,
        details,
        suggestions,
      },
      cost: response.cost,
      responseTime: response.responseTime,
    };
  }

  async enrichCompany(domain: string): Promise<ApiResponse> {
    // MailboxLayer no proporciona enriquecimiento de empresas
    return {
      success: false,
      error: 'Company enrichment not supported by MailboxLayer',
      responseTime: 0,
    };
  }

  async enrichPerson(email: string): Promise<ApiResponse> {
    // MailboxLayer no proporciona enriquecimiento de personas
    return {
      success: false,
      error: 'Person enrichment not supported by MailboxLayer',
      responseTime: 0,
    };
  }

  private calculateEmailScore(data: MailboxLayerResponse): number {
    let score = 0;

    // Formato válido (20 puntos)
    if (data.format_valid) score += 20;

    // MX records encontrados (20 puntos)
    if (data.mx_found) score += 20;

    // Verificación SMTP exitosa (30 puntos)
    if (data.smtp_check) score += 30;

    // No es catch-all (15 puntos)
    if (!data.catch_all) score += 15;

    // No es email desechable (10 puntos)
    if (!data.disposable) score += 10;

    // No es email gratuito (5 puntos)
    if (!data.free_email) score += 5;

    return Math.min(100, score);
  }

  private generateValidationDetails(data: MailboxLayerResponse): string {
    const details = [];

    if (data.format_valid) {
      details.push('✅ Formato de email válido');
    } else {
      details.push('❌ Formato de email inválido');
    }

    if (data.mx_found) {
      details.push('✅ Registros MX encontrados');
    } else {
      details.push('❌ No se encontraron registros MX');
    }

    if (data.smtp_check) {
      details.push('✅ Verificación SMTP exitosa');
    } else {
      details.push('❌ Verificación SMTP fallida');
    }

    if (data.catch_all) {
      details.push('⚠️ Dominio con catch-all habilitado');
    }

    if (data.disposable) {
      details.push('⚠️ Email desechable detectado');
    }

    if (data.free_email) {
      details.push('ℹ️ Email gratuito detectado');
    }

    if (data.role) {
      details.push('ℹ️ Email de rol detectado (info@, admin@, etc.)');
    }

    return details.join('\n');
  }

  private generateSuggestions(data: MailboxLayerResponse): string[] {
    const suggestions = [];

    if (!data.format_valid) {
      suggestions.push('Verificar el formato del email');
    }

    if (!data.mx_found) {
      suggestions.push('El dominio no tiene registros MX válidos');
    }

    if (!data.smtp_check) {
      suggestions.push('El servidor SMTP no responde correctamente');
    }

    if (data.catch_all) {
      suggestions.push('Considerar verificar manualmente este email');
    }

    if (data.disposable) {
      suggestions.push('Este email puede ser temporal o desechable');
    }

    if (data.role) {
      suggestions.push('Considerar buscar un email personal en lugar de uno de rol');
    }

    return suggestions;
  }
} 