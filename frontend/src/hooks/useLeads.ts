import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { LeadsService } from '@/services/leads.service';
import { 
  Lead, 
  CreateLeadForm, 
  UpdateLeadForm, 
  LeadFilters, 
  LeadSortOptions,
  PaginatedResponse,
  ApiResponse,
  LeadStatus,
  LeadSource
} from '@/types/common.types';

// ========================================================================================
// TIPOS INTERNOS
// ========================================================================================

interface UseLeadsOptions {
  page?: number;
  limit?: number;
  filters?: LeadFilters;
  sort?: LeadSortOptions;
  includeUser?: boolean;
  includeEnrichments?: boolean;
  autoFetch?: boolean;
}

interface UseLeadsReturn {
  // Estado
  leads: Lead[];
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponse<Lead>['pagination'] | null;
  
  // Acciones CRUD
  createLead: (data: CreateLeadForm) => Promise<ApiResponse<Lead>>;
  updateLead: (id: string, data: UpdateLeadForm) => Promise<ApiResponse<Lead>>;
  deleteLead: (id: string) => Promise<ApiResponse<void>>;
  getLeadById: (id: string) => Promise<ApiResponse<Lead>>;
  
  // Acciones de consulta
  fetchLeads: (options?: Partial<UseLeadsOptions>) => Promise<void>;
  refreshLeads: () => Promise<void>;
  
  // Acciones bulk
  createBulkLeads: (leadsData: CreateLeadForm[]) => Promise<ApiResponse<{ created: number; errors: string[] }>>;
  updateBulkLeads: (updates: Array<{ id: string; data: UpdateLeadForm }>) => Promise<ApiResponse<{ updated: number; errors: string[] }>>;
  
  // Utilidades
  isEmailExists: (email: string) => Promise<boolean>;
  getLeadStats: () => Promise<ApiResponse<any>>;
}

// ========================================================================================
// HOOK PRINCIPAL
// ========================================================================================

export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const { data: session } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponse<Lead>['pagination'] | null>(null);
  
  const {
    page = 1,
    limit = 10,
    filters = {},
    sort = { field: 'createdAt', order: 'desc' },
    includeUser = false,
    includeEnrichments = false,
    autoFetch = true
  } = options;
  
  // ========================================================================================
  // FETCH LEADS
  // ========================================================================================
  
  // const _fetchLeads = useCallback(async (fetchOptions?: Partial<UseLeadsOptions>) => {
    if (!session?.user?.id) {
      setError('Usuario no autenticado');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const mergedOptions = {
        page,
        limit,
        filters,
        sort,
        includeUser,
        includeEnrichments,
        ...fetchOptions
      };
      
      const result = await LeadsService.getLeads(mergedOptions);
      
      if (result.success && result.data) {
        setLeads(result.data.data);
        setPagination(result.data.pagination);
      } else {
        setError(result.error || 'Error al obtener leads');
        setLeads([]);
        setPagination(null);
      }
    } catch (err) {
console.warn('Error fetching leads:', err);
      setError('Error interno del servidor');
      setLeads([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, page, _limit, filters, sort, includeUser, includeEnrichments]);
  
  // ========================================================================================
  // CRUD OPERATIONS
  // ========================================================================================
  
  // const _createLead = useCallback(async (data: CreateLeadForm): Promise<ApiResponse<Lead>> => {
    if (!session?.user?.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    try {
      const result = await LeadsService.createLead(data, session.user.id);
      
      if (result.success) {
        // Refrescar la lista después de crear
        await fetchLeads();
      }
      
      return result;
    } catch (err) {
console.warn('Error creating lead:', err);
      return { success: false, error: 'Error interno del servidor' };
    }
  }, [session?.user?.id, fetchLeads]);
  
  // const _updateLead = useCallback(async (id: string, data: UpdateLeadForm): Promise<ApiResponse<Lead>> => {
    try {
      const result = await LeadsService.updateLead(id, data);
      
      if (result.success) {
        // Actualizar el lead en la lista local
        setLeads(prevLeads => 
          prevLeads.map(lead => 
            lead.id === id ? { ...lead, ...result.data } : lead
          )
        );
      }
      
      return result;
    } catch (err) {
console.warn('Error updating lead:', err);
      return { success: false, error: 'Error interno del servidor' };
    }
  }, []);
  
  // const _deleteLead = useCallback(async (id: string): Promise<ApiResponse<void>> => {
    try {
      const result = await LeadsService.deleteLead(id);
      
      if (result.success) {
        // Remover el lead de la lista local
        setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
        
        // Actualizar paginación
        if (pagination) {
          setPagination(prev => prev ? {
            ...prev,
            total: prev.total - 1,
            totalPages: Math.ceil((prev.total - 1) / prev.limit)
          } : null);
        }
      }
      
      return result;
    } catch (err) {
console.warn('Error deleting lead:', err);
      return { success: false, error: 'Error interno del servidor' };
    }
  }, [pagination]);
  
  // const _getLeadById = useCallback(async (id: string): Promise<ApiResponse<Lead>> => {
    try {
      return await LeadsService.getLeadById(id, { includeUser, includeEnrichments });
    } catch (err) {
console.warn('Error getting lead by id:', err);
      return { success: false, error: 'Error interno del servidor' };
    }
  }, [includeUser, includeEnrichments]);
  
  // ========================================================================================
  // BULK OPERATIONS
  // ========================================================================================
  
  // const _createBulkLeads = useCallback(async (leadsData: CreateLeadForm[]): Promise<ApiResponse<{ created: number; errors: string[] }>> => {
    if (!session?.user?.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    try {
      const result = await LeadsService.createBulkLeads(leadsData, session.user.id);
      
      if (result.success) {
        // Refrescar la lista después de crear en lote
        await fetchLeads();
      }
      
      return result;
    } catch (err) {
console.warn('Error creating bulk leads:', err);
      return { success: false, error: 'Error interno del servidor' };
    }
  }, [session?.user?.id, fetchLeads]);
  
  // const _updateBulkLeads = useCallback(async (updates: Array<{ id: string; data: UpdateLeadForm }>): Promise<ApiResponse<{ updated: number; errors: string[] }>> => {
    try {
      const result = await LeadsService.updateBulkLeads(updates);
      
      if (result.success) {
        // Refrescar la lista después de actualizar en lote
        await fetchLeads();
      }
      
      return result;
    } catch (err) {
console.warn('Error updating bulk leads:', err);
      return { success: false, error: 'Error interno del servidor' };
    }
  }, [fetchLeads]);
  
  // ========================================================================================
  // UTILITY METHODS
  // ========================================================================================
  
  // const _isEmailExists = useCallback(async (email: string): Promise<boolean> => {
    try {
      return await LeadsService.isEmailExists(email);
    } catch (err) {
console.warn('Error checking email existence:', err);
      return false;
    }
  }, []);
  
  // const _getLeadStats = useCallback(async (): Promise<ApiResponse<any>> => {
    if (!session?.user?.id) {
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    try {
      return await LeadsService.getLeadStats(session.user.id);
    } catch (err) {
console.warn('Error getting lead stats:', err);
      return { success: false, error: 'Error interno del servidor' };
    }
  }, [session?.user?.id]);
  
  // const _refreshLeads = useCallback(async () => {
    await fetchLeads();
  }, [fetchLeads]);
  
  // ========================================================================================
  // EFFECTS
  // ========================================================================================
  
  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (autoFetch && session?.user?.id) {
      fetchLeads();
    }
  }, [autoFetch, session?.user?.id, fetchLeads]);
  
  // ========================================================================================
  // RETURN
  // ========================================================================================
  
  return {
    // Estado
    leads,
    loading,
    error,
    pagination,
    
    // Acciones CRUD
    createLead,
    updateLead,
    deleteLead,
    getLeadById,
    
    // Acciones de consulta
    fetchLeads,
    refreshLeads,
    
    // Acciones bulk
    createBulkLeads,
    updateBulkLeads,
    
    // Utilidades
    isEmailExists,
    getLeadStats
  };
}

// ========================================================================================
// HOOKS ESPECIALIZADOS
// ========================================================================================

/**
 * Hook para leads de un usuario específico
 */
export function useUserLeads(userId: string, options?: Omit<UseLeadsOptions, 'filters'>) {
  return useLeads({
    ...options,
    filters: { ...options?.filters, userId }
  });
}

/**
 * Hook para leads con filtros específicos
 */
export function useFilteredLeads(filters: LeadFilters, options?: Omit<UseLeadsOptions, 'filters'>) {
  return useLeads({
    ...options,
    filters
  });
}

/**
 * Hook para leads por status
 */
export function useLeadsByStatus(status: LeadStatus | LeadStatus[], options?: Omit<UseLeadsOptions, 'filters'>) {
  // const _statusArray = Array.isArray(status) ? status : [status];
  return useLeads({
    ...options,
    filters: { ...options?.filters, status: statusArray }
  });
}

/**
 * Hook para leads por source
 */
export function useLeadsBySource(source: LeadSource | LeadSource[], options?: Omit<UseLeadsOptions, 'filters'>) {
  // const _sourceArray = Array.isArray(source) ? source : [source];
  return useLeads({
    ...options,
    filters: { ...options?.filters, source: sourceArray }
  });
} 