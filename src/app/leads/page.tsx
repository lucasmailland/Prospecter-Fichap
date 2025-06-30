'use client';

import Layout from '@/components/layout/Layout';
import Modal from '@/components/ui/Modal';
import Dropdown from '@/components/ui/Dropdown';
import LeadForm from '@/components/forms/LeadForm';
import Illustration from '@/components/ui/Illustration';
import { useToast } from '@/components/ui/Toast';
import { designSystem, getStatusStyles, getScoreStyles } from '@/styles/design-system';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  TrashIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  XCircleIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';

interface Lead {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  company: string;
  position: string;
  score: number;
  status: string;
  phone: string;
  industry: string;
  employees: string;
  revenue: string;
  enrichedAt: string;
  source: string;
  website?: string;
  linkedinUrl?: string;
  notes?: string;
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const leads: Lead[] = [
    {
      id: 1,
      email: 'sarah.johnson@techcorp.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      company: 'TechCorp Inc.',
      position: 'VP Marketing',
      score: 92,
      status: 'qualified',
      phone: '+1 (555) 123-4567',
      industry: 'Technology',
      employees: '500-1000',
      revenue: '$50M',
      enrichedAt: '2 min ago',
      source: 'LinkedIn',
      website: 'https://techcorp.com',
      linkedinUrl: 'https://linkedin.com/in/sarah-johnson',
      notes: 'Muy interesada en soluciones de automatización'
    },
    {
      id: 2,
      email: 'mike.chen@innovate.io',
      firstName: 'Mike',
      lastName: 'Chen',
      company: 'Innovate Solutions',
      position: 'CTO',
      score: 87,
      status: 'qualified',
      phone: '+1 (555) 987-6543',
      industry: 'SaaS',
      employees: '100-500',
      revenue: '$25M',
      enrichedAt: '5 min ago',
      source: 'Website'
    },
    {
      id: 3,
      email: 'anna.rodriguez@startup.co',
      firstName: 'Anna',
      lastName: 'Rodriguez',
      company: 'Startup.co',
      position: 'Founder',
      score: 76,
      status: 'potential',
      phone: '+1 (555) 456-7890',
      industry: 'Fintech',
      employees: '10-50',
      revenue: '$5M',
      enrichedAt: '8 min ago',
      source: 'Import'
    },
    {
      id: 4,
      email: 'john.doe@enterprise.com',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Enterprise Corp',
      position: 'Director',
      score: 45,
      status: 'cold',
      phone: '+1 (555) 321-0987',
      industry: 'Manufacturing',
      employees: '1000+',
      revenue: '$100M',
      enrichedAt: '12 min ago',
      source: 'Cold Email'
    },
    {
      id: 5,
      email: 'lisa.wang@growth.com',
      firstName: 'Lisa',
      lastName: 'Wang',
      company: 'Growth Co',
      position: 'Growth Manager',
      score: 89,
      status: 'qualified',
      phone: '+1 (555) 654-3210',
      industry: 'Marketing',
      employees: '50-100',
      revenue: '$15M',
      enrichedAt: '15 min ago',
      source: 'Referral'
    },
  ];

  const filters = [
    { key: 'all', label: 'Todos los leads', count: leads.length },
    { key: 'qualified', label: 'Qualificados', count: leads.filter(l => l.status === 'qualified').length },
    { key: 'potential', label: 'Potenciales', count: leads.filter(l => l.status === 'potential').length },
    { key: 'cold', label: 'Fríos', count: leads.filter(l => l.status === 'cold').length },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || lead.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const selectAllLeads = () => {
    setSelectedLeads(selectedLeads.length === filteredLeads.length ? [] : filteredLeads.map(l => l.id));
  };

  const handleCreateLead = async (leadData: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Lead creado',
        message: 'El lead se ha creado exitosamente'
      });
      setShowCreateModal(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo crear el lead'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditLead = async (leadData: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Lead actualizado',
        message: 'Los cambios se han guardado correctamente'
      });
      setShowEditModal(false);
      setCurrentLead(undefined);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar el lead'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Lead eliminado',
        message: 'El lead se ha eliminado correctamente'
      });
      setShowDeleteModal(false);
      setCurrentLead(undefined);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo eliminar el lead'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkEnrich = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast({
        type: 'success',
        title: 'Enriquecimiento completado',
        message: `${selectedLeads.length} leads enriquecidos exitosamente`
      });
      setSelectedLeads([]);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error en enriquecimiento',
        message: 'No se pudieron enriquecer algunos leads'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        type: 'success',
        title: 'Leads eliminados',
        message: `${selectedLeads.length} leads eliminados correctamente`
      });
      setSelectedLeads([]);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudieron eliminar algunos leads'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDropdownItems = (lead: Lead) => [
    {
      label: 'Ver detalles',
      icon: <EyeIcon className="h-4 w-4" />,
      onClick: () => {
        setCurrentLead(lead);
        setShowDetailModal(true);
      }
    },
    {
      label: 'Editar',
      icon: <PencilIcon className="h-4 w-4" />,
      onClick: () => {
        setCurrentLead(lead);
        setShowEditModal(true);
      }
    },
    {
      label: 'Enriquecer',
      icon: <SparklesIcon className="h-4 w-4" />,
      onClick: async () => {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          addToast({
            type: 'success',
            title: 'Lead enriquecido',
            message: `${lead.firstName} ${lead.lastName} ha sido enriquecido`
          });
        } catch (error) {
          addToast({
            type: 'error',
            title: 'Error',
            message: 'No se pudo enriquecer el lead'
          });
        } finally {
          setIsLoading(false);
        }
      }
    },
    {
      label: 'Eliminar',
      icon: <TrashIcon className="h-4 w-4" />,
      variant: 'danger' as const,
      onClick: () => {
        setCurrentLead(lead);
        setShowDeleteModal(true);
      }
    }
  ];

  return (
    <Layout>
      <div className={designSystem.spacing.section}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-gray-100 dark:border-gray-800 pb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={designSystem.typography.h1}>Leads</h1>
              <p className={`${designSystem.typography.body} mt-2`}>
                Gestiona y enriquece tu base de leads
              </p>
            </div>
            <div className="flex gap-3">
              <button className={`${designSystem.button.secondary} flex items-center space-x-2`}>
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Exportar</span>
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className={`${designSystem.button.primary} flex items-center space-x-2`}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Nuevo Lead</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-between"
        >
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por email, empresa o nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${designSystem.input.base} pl-10`}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bulk Actions */}
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${designSystem.colors.info.bg} ${designSystem.colors.info.border} rounded-lg p-4`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${designSystem.colors.info.text}`}>
                {selectedLeads.length} lead(s) seleccionado(s)
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handleBulkEnrich}
                  disabled={isLoading}
                  className={`${designSystem.button.ghost} flex items-center space-x-1 disabled:opacity-50`}
                >
                  <SparklesIcon className="h-4 w-4" />
                  <span>Enriquecer</span>
                </button>
                <button 
                  onClick={handleBulkDelete}
                  disabled={isLoading}
                  className={`${designSystem.button.ghost} flex items-center space-x-1 disabled:opacity-50`}
                >
                  <TrashIcon className="h-4 w-4" />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${designSystem.card.base} overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={selectAllLeads}
                      className="rounded border-gray-300 dark:border-gray-600 text-gray-600 focus:ring-gray-500"
                    />
                  </th>
                  <th className={`text-left px-6 py-4 ${designSystem.typography.caption} uppercase tracking-wider`}>
                    Lead
                  </th>
                  <th className={`text-left px-6 py-4 ${designSystem.typography.caption} uppercase tracking-wider`}>
                    Empresa
                  </th>
                  <th className={`text-left px-6 py-4 ${designSystem.typography.caption} uppercase tracking-wider`}>
                    Score
                  </th>
                  <th className={`text-left px-6 py-4 ${designSystem.typography.caption} uppercase tracking-wider`}>
                    Estado
                  </th>
                  <th className={`text-left px-6 py-4 ${designSystem.typography.caption} uppercase tracking-wider`}>
                    Enriquecido
                  </th>
                  <th className="w-16 px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={designSystem.card.interactive}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-gray-600 focus:ring-gray-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className={designSystem.typography.caption}>
                            {lead.firstName[0]}{lead.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className={designSystem.typography.h3}>
                            {lead.firstName} {lead.lastName}
                          </div>
                          <div className={designSystem.typography.caption}>{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={designSystem.typography.h3}>{lead.company}</div>
                      <div className={designSystem.typography.caption}>{lead.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-lg font-bold ${getScoreStyles(lead.score)}`}>
                        {lead.score}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusStyles(lead.status).bg} ${getStatusStyles(lead.status).text}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center space-x-1 ${designSystem.typography.caption}`}>
                        <ClockIcon className="h-3 w-3" />
                        <span>{lead.enrichedAt}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Dropdown items={getDropdownItems(lead)} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredLeads.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="flex justify-center mb-6">
                <Illustration 
                  name={searchQuery ? "empty-search" : "no-data"} 
                  size="lg" 
                  className="opacity-60"
                />
              </div>
              {searchQuery ? (
                <>
                  <h3 className={designSystem.typography.h2}>No se encontraron resultados</h3>
                  <p className={`${designSystem.typography.body} mb-6 max-w-md mx-auto`}>
                    No pudimos encontrar leads que coincidan con "<span className="font-medium">{searchQuery}</span>". 
                    Intenta con otros términos de búsqueda.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className={designSystem.button.ghost}
                  >
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <h3 className={designSystem.typography.h2}>Tu lista de leads está vacía</h3>
                  <p className={`${designSystem.typography.body} mb-6 max-w-md mx-auto`}>
                    Comienza agregando tu primer lead o importa una lista existente para empezar a hacer crecer tu negocio.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className={`${designSystem.button.primary} flex items-center space-x-2`}
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Crear primer lead</span>
                    </button>
                    <button className={`${designSystem.button.secondary} flex items-center space-x-2`}>
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      <span>Importar leads</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Modals */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nuevo Lead"
          size="lg"
        >
          <LeadForm
            onSubmit={handleCreateLead}
            onCancel={() => setShowCreateModal(false)}
            isLoading={isLoading}
          />
        </Modal>

        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setCurrentLead(undefined);
          }}
          title="Editar Lead"
          size="lg"
        >
          <LeadForm
            lead={currentLead ? {
              id: currentLead.id.toString(),
              name: `${currentLead.firstName} ${currentLead.lastName}`,
              email: currentLead.email,
              company: currentLead.company,
              phone: currentLead.phone,
              website: currentLead.website,
              industry: currentLead.industry,
              status: currentLead.status as 'hot' | 'warm' | 'cold',
              score: currentLead.score,
            } : undefined}
            onSubmit={handleEditLead}
            onCancel={() => {
              setShowEditModal(false);
              setCurrentLead(undefined);
            }}
            isLoading={isLoading}
          />
        </Modal>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setCurrentLead(undefined);
          }}
          title="Eliminar Lead"
        >
          <div className="space-y-4">
            <p className={designSystem.typography.body}>
              ¿Estás seguro de que quieres eliminar a <strong>{currentLead?.firstName} {currentLead?.lastName}</strong>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentLead(undefined);
                }}
                className={designSystem.button.secondary}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteLead}
                disabled={isLoading}
                className={`${designSystem.button.primary} disabled:opacity-50`}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </Modal>

        {currentLead && (
          <Modal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setCurrentLead(undefined);
            }}
            title="Detalles del Lead"
            size="lg"
          >
            <div className={designSystem.spacing.section}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${designSystem.typography.caption} mb-1`}>Nombre</label>
                  <p className={designSystem.typography.h3}>{currentLead.firstName} {currentLead.lastName}</p>
                </div>
                <div>
                  <label className={`block ${designSystem.typography.caption} mb-1`}>Email</label>
                  <p className={designSystem.typography.h3}>{currentLead.email}</p>
                </div>
                <div>
                  <label className={`block ${designSystem.typography.caption} mb-1`}>Empresa</label>
                  <p className={designSystem.typography.h3}>{currentLead.company}</p>
                </div>
                <div>
                  <label className={`block ${designSystem.typography.caption} mb-1`}>Cargo</label>
                  <p className={designSystem.typography.h3}>{currentLead.position}</p>
                </div>
                <div>
                  <label className={`block ${designSystem.typography.caption} mb-1`}>Score</label>
                  <p className={`text-lg font-bold ${getScoreStyles(currentLead.score)}`}>{currentLead.score}</p>
                </div>
                <div>
                  <label className={`block ${designSystem.typography.caption} mb-1`}>Estado</label>
                  <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusStyles(currentLead.status).bg} ${getStatusStyles(currentLead.status).text}`}>
                    {currentLead.status}
                  </span>
                </div>
              </div>
              
              {currentLead.notes && (
                <div>
                  <label className={`block ${designSystem.typography.caption} mb-1`}>Notas</label>
                  <p className={designSystem.typography.body}>{currentLead.notes}</p>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
} 