import { apiService } from './api.service';
import {
  Lead,
  CreateLeadDto,
  UpdateLeadDto,
  CreateProspectDto,
  UpdateProspectDto,
} from '../types/api.types';

class LeadsService {
  private endpoint = '/prospects';

  // Obtener todos los leads
  async getLeads(): Promise<Lead[]> {
    return apiService.get<Lead[]>(this.endpoint);
  }

  // Obtener un lead por ID
  async getLead(id: string): Promise<Lead> {
    return apiService.get<Lead>(`${this.endpoint}/${id}`);
  }

  // Crear nuevo lead
  async createLead(leadData: CreateProspectDto): Promise<Lead> {
    return apiService.post<Lead>(this.endpoint, leadData);
  }

  // Actualizar lead existente
  async updateLead(id: string, leadData: UpdateProspectDto): Promise<Lead> {
    return apiService.put<Lead>(`${this.endpoint}/${id}`, leadData);
  }

  // Eliminar lead
  async deleteLead(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`${this.endpoint}/${id}`);
  }

  // Filtrar leads por estado
  async getLeadsByStatus(status: string): Promise<Lead[]> {
    const allLeads = await this.getLeads();
    return allLeads.filter(lead => lead.status === status);
  }

  // Buscar leads por término
  async searchLeads(searchTerm: string): Promise<Lead[]> {
    const allLeads = await this.getLeads();
    const term = searchTerm.toLowerCase();
    
    return allLeads.filter(lead =>
      lead.email?.toLowerCase().includes(term) ||
      lead.fullName?.toLowerCase().includes(term) ||
      lead.company?.toLowerCase().includes(term) ||
      lead.firstName?.toLowerCase().includes(term) ||
      lead.lastName?.toLowerCase().includes(term)
    );
  }

  // Obtener estadísticas básicas de leads
  async getLeadsStats(): Promise<{
    total: number;
    qualified: number;
    potential: number;
    cold: number;
    averageScore: number;
  }> {
    const leads = await this.getLeads();
    
    return {
      total: leads.length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      potential: leads.filter(l => l.status === 'potential').length,
      cold: leads.filter(l => l.status === 'cold').length,
      averageScore: leads.length > 0 
        ? leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length 
        : 0,
    };
  }
}

export const leadsService = new LeadsService(); 