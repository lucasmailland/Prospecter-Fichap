import { useState, useEffect } from 'react';
import { leadsService } from '../services/leads.service';
import { Lead, CreateProspectDto, UpdateProspectDto } from '../types/api.types';

interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  createLead: (leadData: CreateProspectDto) => Promise<void>;
  updateLead: (id: string, leadData: UpdateProspectDto) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  refreshLeads: () => Promise<void>;
  searchLeads: (searchTerm: string) => Promise<void>;
  filterByStatus: (status: string) => Promise<void>;
}

export const useLeads = (): UseLeadsReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los leads
  const refreshLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await leadsService.getLeads();
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar leads');
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo lead
  const createLead = async (leadData: CreateProspectDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const newLead = await leadsService.createLead(leadData);
      setLeads(prev => [...prev, newLead]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear lead');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar lead existente
  const updateLead = async (id: string, leadData: UpdateProspectDto) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedLead = await leadsService.updateLead(id, leadData);
      setLeads(prev => prev.map(lead => 
        lead.id === id ? updatedLead : lead
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar lead');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar lead
  const deleteLead = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await leadsService.deleteLead(id);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar lead');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar leads
  const searchLeads = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      refreshLeads();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await leadsService.searchLeads(searchTerm);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar leads');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por estado
  const filterByStatus = async (status: string) => {
    if (status === 'all') {
      refreshLeads();
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await leadsService.getLeadsByStatus(status);
      setLeads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al filtrar leads');
    } finally {
      setLoading(false);
    }
  };

  // Cargar leads al montar el componente
  useEffect(() => {
    refreshLeads();
  }, []);

  return {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    refreshLeads,
    searchLeads,
    filterByStatus,
  };
}; 