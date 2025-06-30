import { apiService } from './api.service';
import {
  EnrichLeadDto,
  BulkEnrichDto,
  EnrichmentResult,
  BulkEnrichmentResult,
  ProviderStatus,
  EnrichmentStats,
} from '../types/api.types';

class EnrichmentService {
  private endpoint = '/enrichment';

  // Enriquecer un lead específico
  async enrichLead(
    leadId: string,
    enrichmentTypes?: string[]
  ): Promise<EnrichmentResult> {
    const payload: EnrichLeadDto = {
      leadId,
      enrichmentTypes: enrichmentTypes || [
        'email_validation',
        'company_enrichment',
        'person_enrichment',
        'scoring'
      ],
    };

    return apiService.post<EnrichmentResult>(`${this.endpoint}/lead`, payload);
  }

  // Enriquecimiento masivo de leads
  async bulkEnrich(
    leadIds: string[],
    enrichmentTypes?: string[]
  ): Promise<BulkEnrichmentResult> {
    const payload: BulkEnrichDto = {
      leadIds,
      enrichmentTypes: enrichmentTypes || [
        'email_validation',
        'company_enrichment',
        'person_enrichment',
        'scoring'
      ],
    };

    return apiService.post<BulkEnrichmentResult>(`${this.endpoint}/bulk`, payload);
  }

  // Obtener estado de los proveedores de APIs
  async getProvidersStatus(): Promise<{ providers: ProviderStatus[] }> {
    return apiService.get<{ providers: ProviderStatus[] }>(`${this.endpoint}/providers/status`);
  }

  // Obtener estadísticas de enriquecimiento
  async getEnrichmentStats(days: number = 30): Promise<EnrichmentStats> {
    return apiService.get<EnrichmentStats>(`${this.endpoint}/stats?days=${days}`);
  }

  // Validar solo email
  async validateEmail(leadId: string): Promise<EnrichmentResult> {
    return this.enrichLead(leadId, ['email_validation']);
  }

  // Solo enriquecimiento de empresa
  async enrichCompany(leadId: string): Promise<EnrichmentResult> {
    return this.enrichLead(leadId, ['company_enrichment']);
  }

  // Solo enriquecimiento de persona
  async enrichPerson(leadId: string): Promise<EnrichmentResult> {
    return this.enrichLead(leadId, ['person_enrichment']);
  }

  // Solo scoring
  async calculateScore(leadId: string): Promise<EnrichmentResult> {
    return this.enrichLead(leadId, ['scoring']);
  }

  // Obtener proveedores activos
  async getActiveProviders(): Promise<ProviderStatus[]> {
    const { providers } = await this.getProvidersStatus();
    return providers.filter(provider => provider.isActive);
  }

  // Verificar si hay límites de rate
  async checkRateLimits(): Promise<{
    hasLimits: boolean;
    limitedProviders: string[];
  }> {
    const { providers } = await this.getProvidersStatus();
    const limitedProviders = providers
      .filter(p => p.isRateLimited)
      .map(p => p.name);

    return {
      hasLimits: limitedProviders.length > 0,
      limitedProviders,
    };
  }

  // Calcular costo estimado
  async estimateCost(
    leadIds: string[],
    enrichmentTypes: string[]
  ): Promise<{ totalCost: number; breakdown: Record<string, number> }> {
    const { providers } = await this.getProvidersStatus();
    
    // Simulación del cálculo de costo basado en tipos de enriquecimiento
    const costPerType: Record<string, number> = {
      email_validation: 0.01,
      company_enrichment: 0.05,
      person_enrichment: 0.03,
      scoring: 0.02,
    };

    const breakdown: Record<string, number> = {};
    let totalCost = 0;

    enrichmentTypes.forEach(type => {
      const cost = (costPerType[type] || 0) * leadIds.length;
      breakdown[type] = cost;
      totalCost += cost;
    });

    return { totalCost, breakdown };
  }
}

export const enrichmentService = new EnrichmentService(); 