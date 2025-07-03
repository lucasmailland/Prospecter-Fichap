'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Lead, UserRole } from '@/types/common.types';
import { useAuth } from '@/contexts/AuthContext';
import { HeroUILeadsTable } from '@/components/table/HeroUILeadsTable';
import LeadForm from '@/components/forms/LeadForm';
import LeadDetailsModal from '@/components/leads/LeadDetailsModal';
import { toast } from 'react-hot-toast';

export default function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  // Cargar leads
  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/prospects');
      const data = await response.json();
      
      if (data.success) {
        setLeads(data.data || []);
      } else {
        throw new Error(data.error || 'Error al cargar leads');
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError((err as Error).message);
      toast.error('Error al cargar leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Crear nuevo lead
  const handleCreateLead = async (leadData: unknown) => {
    try {
      const response = await fetch('/api/prospects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (result.success) {
        setShowCreateModal(false);
        await fetchLeads(); // Recargar leads
        toast.success('Lead creado exitosamente');
      } else {
        throw new Error(result.error || 'Error al crear lead');
      }
    } catch (err) {
      console.error('Error creating lead:', err);
      toast.error((err as Error).message);
    }
  };

  // Manejar edición de lead
  const handleEditLead = async (leadData: unknown) => {
    if (!editingLead) return;

    try {
      console.log('📝 Enviando datos de edición:', leadData);
      
      const response = await fetch(`/api/prospects/${editingLead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();
      console.log('📝 Respuesta de edición:', result);

      if (result.success) {
        setShowEditModal(false);
        setEditingLead(null);
        await fetchLeads(); // Recargar leads
        toast.success('Lead actualizado exitosamente');
      } else {
        throw new Error(result.error || 'Error al actualizar lead');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      toast.error((err as Error).message);
    }
  };

  // Funciones para la tabla
  const handleLeadSelect = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setShowDetailsModal(true);
  };

  const handleLeadEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowEditModal(true);
  };

  const handleLeadDelete = (lead: Lead) => {
    setLeadToDelete(lead.id);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!leadToDelete) return;

    try {
      const response = await fetch(`/api/prospects/${leadToDelete}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        await fetchLeads(); // Recargar leads
        toast.success('Lead eliminado exitosamente');
      } else {
        throw new Error(result.error || 'Error al eliminar lead');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast.error((err as Error).message);
    } finally {
      setShowDeleteConfirm(false);
      setLeadToDelete(null);
    }
  };

  // Manejar acciones masivas
  const handleBulkAction = async (action: string, selectedLeads: Lead[]) => {
    const leadIds = selectedLeads.map(lead => lead.id);
    
    try {
      let endpoint = '/api/prospects/bulk';
      let method = 'POST';
      let body: any = { action, leadIds };

      switch (action) {
        case 'mark-contacted':
          body.status = 'CONTACTED';
          break;
        case 'mark-qualified':
          body.status = 'VALIDATED';
          break;
        case 'change-priority':
          // Aquí podrías abrir un modal para seleccionar la prioridad
          body.priority = 3; // Por ahora, prioridad alta
          break;
        case 'export-csv':
          // Generar CSV y descargar
          const csvContent = generateCSV(selectedLeads);
          downloadCSV(csvContent, 'leads-export.csv');
          toast.success(`${selectedLeads.length} leads exportados`);
          return;
        case 'copy-data':
          // Copiar al clipboard
          const textContent = selectedLeads.map(lead => 
            `${lead.fullName || lead.firstName + ' ' + lead.lastName} - ${lead.email} - ${lead.company}`
          ).join('\n');
          await navigator.clipboard.writeText(textContent);
          toast.success('Datos copiados al portapapeles');
          return;
        case 'delete-leads':
          if (confirm(`¿Estás seguro de eliminar ${selectedLeads.length} leads?`)) {
            method = 'DELETE';
          } else {
            return;
          }
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        await fetchLeads(); // Recargar leads
        toast.success(`Acción "${action}" aplicada a ${selectedLeads.length} leads`);
      } else {
        throw new Error(result.error || 'Error en acción masiva');
      }
    } catch (err) {
      console.error('Error in bulk action:', err);
      toast.error((err as Error).message);
    }
  };

  // Funciones auxiliares para exportación
  const generateCSV = (data: Lead[]) => {
    const headers = ['Nombre', 'Email', 'Empresa', 'Cargo', 'Teléfono', 'País', 'Estado', 'Score', 'Prioridad', 'Fuente', 'Creado'];
    const rows = data.map(lead => [
      lead.fullName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim(),
      lead.email,
      lead.company || '',
      lead.jobTitle || '',
      lead.phone || '',
      lead.country || '',
      lead.status,
      lead.score,
      lead.priority,
      lead.source,
      new Date(lead.createdAt).toLocaleDateString('es-ES')
    ]);
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Gestión de Leads
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra y rastrea tus leads de prospección con análisis avanzado de IA
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Icon icon="solar:add-circle-linear" className="w-5 h-5" />}
          onPress={() => setShowCreateModal(true)}
        >
          Nuevo Lead
        </Button>
      </motion.div>

      {/* Estado de carga y errores */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <Icon icon="solar:danger-circle-linear" className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                size="sm"
                color="danger"
                variant="light"
                className="mt-2"
                onPress={fetchLeads}
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Información de debug */}
      <div className="text-sm text-gray-500">
        {loading ? 'Cargando leads...' : `${leads.length} leads encontrados`}
      </div>

      {/* HeroUI Advanced Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <HeroUILeadsTable
          leads={leads}
          loading={loading}
          userRole={user?.role as UserRole}
          onLeadSelect={handleLeadSelect}
          onLeadEdit={handleLeadEdit}
          onLeadDelete={handleLeadDelete}
          onBulkAction={handleBulkAction}
          onRefresh={fetchLeads}
        />
      </motion.div>

      {/* Modal para crear lead */}
      {showCreateModal && (
        <LeadForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLead}
          mode="create"
        />
      )}

      {/* Modal para editar lead */}
      {showEditModal && editingLead && (
        <LeadForm
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingLead(null);
          }}
          onSubmit={handleEditLead}
          initialData={editingLead}
          mode="edit"
        />
      )}

      {/* Modal de detalles del lead */}
      {showDetailsModal && selectedLeadId && (
        <LeadDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedLeadId(null);
          }}
          leadId={selectedLeadId}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Icon icon="solar:danger-circle-linear" className="w-6 h-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmar Eliminación
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de que quieres eliminar este lead? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="light"
                onPress={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </Button>
              <Button
                color="danger"
                onPress={confirmDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
