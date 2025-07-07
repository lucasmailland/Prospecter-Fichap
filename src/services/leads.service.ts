// Imports comentados para evitar errores de linting mientras no se usan
// import { prisma } from '@/lib/prisma';
// import { 
//   Lead, 
//   LeadStatus, 
//   LeadSource, 
//   CreateLeadForm, 
//   UpdateLeadForm,
//   LeadFilters,
//   LeadSortOptions,
//   PaginatedResponse,
//   ApiResponse,
//   LeadWithUser,
//   LeadWithEnrichments,
//   LeadWithFullData
// } from '@/types/common.types';

// ========================================================================================
// TIPOS INTERNOS
// ========================================================================================

// Interface comentada para evitar errores de linting
// interface LeadQueryOptions {
//   page?: number;
//   limit?: number;
//   filters?: LeadFilters;
//   sort?: LeadSortOptions;
//   includeUser?: boolean;
//   includeEnrichments?: boolean;
// }

// ========================================================================================
// UTILITY FUNCTIONS
// ========================================================================================

// Funciones comentadas temporalmente para evitar errores de linting
// /**
//  * Parse JSON string safely
//  */
// function parseJsonSafely(jsonString: string | null): Record<string, unknown> | null {
//   if (!jsonString) return null;
//   try {
//     return JSON.parse(jsonString);
//   } catch {
//     return null;
//   }
// }

// /**
//  * Stringify JSON safely
//  */
// function stringifyJsonSafely(obj: unknown): string | null {
//   if (!obj) return null;
//   try {
//     return JSON.stringify(obj);
//   } catch {
//     return null;
//   }
// }

// ========================================================================================
// SERVICIO PRINCIPAL
// ========================================================================================

// Cliente API para llamadas desde el frontend
export class LeadsService {
  
  /**
   * Obtener leads con paginación y filtros
   */
  static async getLeads(options: Record<string, unknown> = {}): Promise<unknown> {
    try {
      const { page = 1, limit = 10, filters = {} } = options;
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.status) {
        params.append('status', Array.isArray(filters.status) ? filters.status[0] : filters.status);
      }
      
      const response = await fetch(`/api/prospects?${params}`);
      return await response.json();
      
    } catch (error) {
// console.error('Error fetching leads:', error);
      return {
        success: false,
        error: 'Error al obtener leads'
      };
    }
  }
  
  /**
   * Crear un nuevo lead
   */
  static async createLead(data: Record<string, unknown>, _userId: string): Promise<unknown> {
    try {
      const response = await fetch('/api/prospects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
      
    } catch (error) {
// console.error('Error creating lead:', error);
      return {
        success: false,
        error: 'Error al crear lead'
      };
    }
  }
  
  /**
   * Actualizar lead
   */
  static async updateLead(id: string, data: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await fetch(`/api/prospects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
      
    } catch (error) {
// console.error('Error updating lead:', error);
      return {
        success: false,
        error: 'Error al actualizar lead'
      };
    }
  }
  
  /**
   * Eliminar lead
   */
  static async deleteLead(id: string): Promise<any> {
    try {
      const response = await fetch(`/api/prospects/${id}`, {
        method: 'DELETE',
      });
      
      return await response.json();
      
    } catch (error) {
// console.error('Error deleting lead:', error);
      return {
        success: false,
        error: 'Error al eliminar lead'
      };
    }
  }
  
  /**
   * Obtener lead por ID
   */
  static async getLeadById(id: string, options: any = {}): Promise<any> {
    try {
      const response = await fetch(`/api/prospects/${id}`);
      return await response.json();
      
    } catch (error) {
// console.error('Error getting lead:', error);
      return {
        success: false,
        error: 'Error al obtener lead'
      };
    }
  }
  
  /**
   * Verificar si email existe
   */
  static async isEmailExists(email: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/prospects/check-email?email=${email}`);
      const result = await response.json();
      return result.exists || false;
      
    } catch (error) {
// console.error('Error checking email:', error);
      return false;
    }
  }
  
  /**
   * Crear múltiples leads
   */
  static async createBulkLeads(leadsData: any[], userId: string): Promise<any> {
    try {
      const response = await fetch('/api/prospects/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leads: leadsData }),
      });
      
      return await response.json();
      
    } catch (error) {
// console.error('Error creating bulk leads:', error);
      return {
        success: false,
        error: 'Error al crear leads en lote'
      };
    }
  }
  
  /**
   * Actualizar múltiples leads
   */
  static async updateBulkLeads(updates: Array<{ id: string; data: any }>): Promise<any> {
    try {
      const response = await fetch('/api/prospects/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });
      
      return await response.json();
      
    } catch (error) {
// console.error('Error updating bulk leads:', error);
      return {
        success: false,
        error: 'Error al actualizar leads en lote'
      };
    }
  }
  
  /**
   * Obtener estadísticas de leads
   */
  static async getLeadStats(userId: string): Promise<any> {
    try {
      const response = await fetch(`/api/prospects/stats?userId=${userId}`);
      return await response.json();
      
    } catch (error) {
// console.error('Error getting lead stats:', error);
      return {
        success: false,
        error: 'Error al obtener estadísticas'
      };
    }
  }
} 