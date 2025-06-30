'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import LeadForm from '@/components/forms/LeadForm';
import Modal from '@/components/ui/Modal';
import Dropdown from '@/components/ui/Dropdown';
import LoadingState from '@/components/ui/LoadingState';
import { useToast } from '@/components/ui/Toast';
import { useLeads } from '@/hooks/useLeads';
import { useEnrichment } from '@/hooks/useEnrichment';
import { designSystem } from '@/styles/design-system';
import { Lead } from '@/types/api.types';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  SparklesIcon,
  TrashIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function LeadsPage() {
  const {
    leads,
    loading,
    error,
    createLead,
    updateLead,
    deleteLead,
    refreshLeads,
    searchLeads,
    filterByStatus,
  } = useLeads();

  const {
    enrichLead,
    bulkEnrich,
    loading: enriching,
    error: enrichmentError,
  } = useEnrichment();

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { showToast } = useToast();

  // Calcular stats en tiempo real desde los leads
  const getFilterCounts = () => {
    return {
      all: leads.length,
      qualified: leads.filter(lead => lead.status === 'qualified').length,
      potential: leads.filter(lead => lead.status === 'potential').length,
      cold: leads.filter(lead => lead.status === 'cold').length,
      hot: leads.filter(lead => lead.status === 'hot').length,
      warm: leads.filter(lead => lead.status === 'warm').length,
    };
  };

  const filterCounts = getFilterCounts();
  
  const filterOptions = [
    { key: 'all', label: 'Todos los leads', count: filterCounts.all },
    { key: 'qualified', label: 'Qualificados', count: filterCounts.qualified },
    { key: 'potential', label: 'Potenciales', count: filterCounts.potential },
    { key: 'cold', label: 'Fríos', count: filterCounts.cold },
    { key: 'hot', label: 'Calientes', count: filterCounts.hot },
    { key: 'warm', label: 'Tibios', count: filterCounts.warm },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return designSystem.score.excellent;
    if (score >= 60) return designSystem.score.good;
    if (score >= 40) return designSystem.score.fair;
    return designSystem.score.poor;
  };

  const getStatusStyles = (status: string) => {
    const statusMap = {
      'qualified': designSystem.leadStatus.qualified,
      'potential': designSystem.leadStatus.potential,
      'cold': designSystem.leadStatus.cold,
      'hot': designSystem.leadStatus.hot,
      'warm': designSystem.leadStatus.warm,
    };
    return statusMap[status as keyof typeof statusMap] || designSystem.leadStatus.cold;
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const handleBulkEnrich = async () => {
    try {
      showToast(`Enriqueciendo ${selectedLeads.length} leads...`, 'info');
      await bulkEnrich(selectedLeads);
      showToast(`${selectedLeads.length} leads enriquecidos exitosamente`, 'success');
      setSelectedLeads([]);
      refreshLeads();
    } catch (error) {
      showToast('Error al enriquecer leads', 'error');
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const leadId of selectedLeads) {
        await deleteLead(leadId);
      }
      showToast(`${selectedLeads.length} leads eliminados`, 'success');
      setSelectedLeads([]);
    } catch (error) {
      showToast('Error al eliminar leads', 'error');
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    await searchLeads(term);
  };

  const handleFilterChange = async (filter: string) => {
    setSelectedFilter(filter);
    await filterByStatus(filter);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleEnrichLead = async (lead: Lead) => {
    try {
      showToast(`Enriqueciendo lead: ${lead.fullName || lead.firstName || 'Lead'}`, 'info');
      await enrichLead(lead.id);
      showToast('Lead enriquecido exitosamente', 'success');
      refreshLeads();
    } catch (error) {
      showToast('Error al enriquecer lead', 'error');
    }
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedLead) {
      try {
        await deleteLead(selectedLead.id);
        showToast(`Lead eliminado: ${selectedLead.fullName || selectedLead.firstName}`, 'success');
      } catch (error) {
        showToast('Error al eliminar lead', 'error');
      }
      setShowDeleteModal(false);
      setSelectedLead(null);
    }
  };

  const handleCreateLead = async (leadData: any) => {
    try {
      await createLead(leadData);
      showToast('Lead creado exitosamente', 'success');
      setShowCreateModal(false);
    } catch (error) {
      showToast('Error al crear lead', 'error');
    }
  };

  const handleUpdateLead = async (leadData: any) => {
    if (selectedLead) {
      try {
        await updateLead(selectedLead.id, leadData);
        showToast('Lead actualizado exitosamente', 'success');
        setShowEditModal(false);
        setSelectedLead(null);
      } catch (error) {
        showToast('Error al actualizar lead', 'error');
      }
    }
  };

  if (loading && leads.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingState message="Cargando leads..." size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={refreshLeads}
            className={designSystem.button.secondary}
          >
            Reintentar
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={designSystem.spacing.section}>
        {/* Header minimalista */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-gray-100 dark:border-gray-800 pb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={designSystem.typography.h1}>Leads</h1>
              <p className={`${designSystem.typography.body} mt-1`}>
                Gestiona y enriquece tu base de leads
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => showToast('Exportando leads...', 'info')}
                className={`${designSystem.button.secondary} flex items-center space-x-1.5`}
              >
                <ArrowDownTrayIcon className="h-3 w-3" />
                <span>Exportar</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className={`${designSystem.button.primary} flex items-center space-x-1.5`}
              >
                <PlusIcon className="h-3 w-3" />
                <span>Nuevo Lead</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filtros y búsqueda compactos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
        >
          <div className="relative flex-1 max-w-sm">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por email, empresa o nombre..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className={`${designSystem.input.base} pl-8 text-xs`}
            />
          </div>
          <div className="flex items-center space-x-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Acciones bulk minimalistas */}
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 rounded-md"
          >
            <span className={`${designSystem.typography.body} text-blue-800 dark:text-blue-200`}>
              {selectedLeads.length} leads seleccionados
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkEnrich}
                disabled={enriching}
                className="px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors disabled:opacity-50"
              >
                {enriching ? 'Enriqueciendo...' : 'Enriquecer'}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="px-2 py-1 text-xs font-medium text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        )}

        {/* Tabla compacta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${designSystem.card.base} overflow-hidden`}
        >
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
              <LoadingState message="Actualizando..." size="sm" />
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded text-xs"
                    />
                  </th>
                  <th className={`px-4 py-2 text-left ${designSystem.typography.h3}`}>LEAD</th>
                  <th className={`px-4 py-2 text-left ${designSystem.typography.h3}`}>EMPRESA</th>
                  <th className={`px-4 py-2 text-left ${designSystem.typography.h3}`}>SCORE</th>
                  <th className={`px-4 py-2 text-left ${designSystem.typography.h3}`}>ESTADO</th>
                  <th className={`px-4 py-2 text-left ${designSystem.typography.h3}`}>ACTUALIZADO</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {leads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`${designSystem.card.interactive} hover:bg-gray-50/50 dark:hover:bg-gray-800/30`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleSelectLead(lead.id)}
                        className="rounded text-xs"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className={`${designSystem.typography.caption} text-[9px]`}>
                            {(lead.fullName || lead.firstName || lead.email)
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className={`${designSystem.typography.h3} text-xs`}>
                            {lead.fullName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Sin nombre'}
                          </div>
                          <div className={`${designSystem.typography.caption} text-[10px]`}>{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className={`${designSystem.typography.h3} text-xs`}>
                          {lead.company || 'Sin empresa'}
                        </div>
                        <div className={`${designSystem.typography.caption} text-[10px]`}>
                          {lead.jobTitle || 'Sin cargo'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${getStatusStyles(lead.status).bg} ${getStatusStyles(lead.status).text}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center space-x-1 ${designSystem.typography.caption} text-[10px]`}>
                        <ClockIcon className="h-2.5 w-2.5" />
                        <span>{new Date(lead.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Dropdown
                        trigger={
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                            <EllipsisHorizontalIcon className="h-3 w-3" />
                          </button>
                        }
                        items={[
                          {
                            label: 'Ver detalles',
                            icon: <EyeIcon className="h-3 w-3" />,
                            onClick: () => handleViewLead(lead),
                          },
                          {
                            label: 'Editar',
                            icon: <PencilIcon className="h-3 w-3" />,
                            onClick: () => handleEditLead(lead),
                          },
                          {
                            label: 'Enriquecer',
                            icon: <SparklesIcon className="h-3 w-3" />,
                            onClick: () => handleEnrichLead(lead),
                          },
                          {
                            label: 'Eliminar',
                            icon: <TrashIcon className="h-3 w-3" />,
                            onClick: () => handleDeleteLead(lead),
                            className: 'text-red-600 dark:text-red-400',
                          },
                        ]}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Modales */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Crear Nuevo Lead"
        >
          <LeadForm
            onSubmit={handleCreateLead}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>

        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Editar Lead"
        >
          {selectedLead && (
            <LeadForm
              initialData={{
                id: selectedLead.id,
                name: selectedLead.fullName || `${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`.trim(),
                email: selectedLead.email,
                company: selectedLead.company,
                phone: selectedLead.phone,
                status: selectedLead.status,
              }}
              onSubmit={handleUpdateLead}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </Modal>

        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Detalles del Lead"
        >
          {selectedLead && (
            <div className={designSystem.spacing.section}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Nombre</label>
                  <p className={designSystem.typography.body}>
                    {selectedLead.fullName || `${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`.trim() || 'Sin nombre'}
                  </p>
                </div>
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Email</label>
                  <p className={designSystem.typography.body}>{selectedLead.email}</p>
                </div>
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Empresa</label>
                  <p className={designSystem.typography.body}>{selectedLead.company || 'Sin empresa'}</p>
                </div>
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Cargo</label>
                  <p className={designSystem.typography.body}>{selectedLead.jobTitle || 'Sin cargo'}</p>
                </div>
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Score</label>
                  <p className={`text-sm font-bold ${getScoreColor(selectedLead.score)}`}>
                    {selectedLead.score}
                  </p>
                </div>
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Estado</label>
                  <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${getStatusStyles(selectedLead.status).bg} ${getStatusStyles(selectedLead.status).text}`}>
                    {selectedLead.status}
                  </span>
                </div>
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Email Válido</label>
                  <p className={designSystem.typography.body}>
                    {selectedLead.isEmailValid ? 'Sí' : 'No'}
                  </p>
                </div>
                <div>
                  <label className={`${designSystem.typography.h3} text-[10px] mb-0.5 block`}>Alta Prioridad</label>
                  <p className={designSystem.typography.body}>
                    {selectedLead.isHighPriority ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
        >
          {selectedLead && (
            <div className={designSystem.spacing.section}>
              <p className={designSystem.typography.body}>
                ¿Estás seguro de que quieres eliminar el lead{' '}
                <strong>
                  {selectedLead.fullName || `${selectedLead.firstName || ''} ${selectedLead.lastName || ''}`.trim()}
                </strong>?
                Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={designSystem.button.secondary}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
} 