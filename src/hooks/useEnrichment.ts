import { useState } from 'react';
import { enrichmentService } from '../services/enrichment.service';
import {
  EnrichmentResult,
  BulkEnrichmentResult,
  ProviderStatus,
  EnrichmentStats,
} from '../types/api.types';

interface UseEnrichmentReturn {
  loading: boolean;
  error: string | null;
  enrichLead: (leadId: string, types?: string[]) => Promise<EnrichmentResult>;
  bulkEnrich: (leadIds: string[], types?: string[]) => Promise<BulkEnrichmentResult>;
  validateEmail: (leadId: string) => Promise<EnrichmentResult>;
  enrichCompany: (leadId: string) => Promise<EnrichmentResult>;
  enrichPerson: (leadId: string) => Promise<EnrichmentResult>;
  calculateScore: (leadId: string) => Promise<EnrichmentResult>;
  getProvidersStatus: () => Promise<ProviderStatus[]>;
  getEnrichmentStats: (days?: number) => Promise<EnrichmentStats>;
  estimateCost: (leadIds: string[], types: string[]) => Promise<{ totalCost: number; breakdown: Record<string, number> }>;
}

export const useEnrichment = (): UseEnrichmentReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsyncOperation = async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en operación de enriquecimiento';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Enriquecer un lead específico
  const enrichLead = async (
    leadId: string,
    types?: string[]
  ): Promise<EnrichmentResult> => {
    return handleAsyncOperation(() => 
      enrichmentService.enrichLead(leadId, types)
    );
  };

  // Enriquecimiento masivo
  const bulkEnrich = async (
    leadIds: string[],
    types?: string[]
  ): Promise<BulkEnrichmentResult> => {
    return handleAsyncOperation(() =>
      enrichmentService.bulkEnrich(leadIds, types)
    );
  };

  // Validar solo email
  const validateEmail = async (leadId: string): Promise<EnrichmentResult> => {
    return handleAsyncOperation(() =>
      enrichmentService.validateEmail(leadId)
    );
  };

  // Enriquecer empresa
  const enrichCompany = async (leadId: string): Promise<EnrichmentResult> => {
    return handleAsyncOperation(() =>
      enrichmentService.enrichCompany(leadId)
    );
  };

  // Enriquecer persona
  const enrichPerson = async (leadId: string): Promise<EnrichmentResult> => {
    return handleAsyncOperation(() =>
      enrichmentService.enrichPerson(leadId)
    );
  };

  // Calcular score
  const calculateScore = async (leadId: string): Promise<EnrichmentResult> => {
    return handleAsyncOperation(() =>
      enrichmentService.calculateScore(leadId)
    );
  };

  // Obtener estado de proveedores
  const getProvidersStatus = async (): Promise<ProviderStatus[]> => {
    return handleAsyncOperation(async () => {
      const response = await enrichmentService.getProvidersStatus();
      return response.providers;
    });
  };

  // Obtener estadísticas
  const getEnrichmentStats = async (days: number = 30): Promise<EnrichmentStats> => {
    return handleAsyncOperation(() =>
      enrichmentService.getEnrichmentStats(days)
    );
  };

  // Estimar costo
  const estimateCost = async (
    leadIds: string[],
    types: string[]
  ): Promise<{ totalCost: number; breakdown: Record<string, number> }> => {
    return handleAsyncOperation(() =>
      enrichmentService.estimateCost(leadIds, types)
    );
  };

  return {
    loading,
    error,
    enrichLead,
    bulkEnrich,
    validateEmail,
    enrichCompany,
    enrichPerson,
    calculateScore,
    getProvidersStatus,
    getEnrichmentStats,
    estimateCost,
  };
}; 