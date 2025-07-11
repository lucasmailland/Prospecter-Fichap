'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import LoadingSystem from '@/components/ui/LoadingSystem';
import { 
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// ========================================================================================
// INTERFACES Y TIPOS
// ========================================================================================

interface HubSpotStats {
  emails: {
    total: number;
    incomingEmails: number;
    outgoingEmails: number;
    deliveredEmails: number;
    openedEmails: number;
    clickedEmails: number;
  };
  calls: {
    total: number;
    incomingCalls: number;
    outgoingCalls: number;
    connectedCalls: number;
    missedCalls: number;
    averageDuration: number;
  };
  notes: {
    total: number;
    notesWithAttachments: number;
    averageBodyLength: number;
  };
  activities: {
    total: number;
    emailActivities: number;
    callActivities: number;
    meetingActivities: number;
    noteActivities: number;
    connectedOutcomes: number;
  };
  tasks: {
    total: number;
    completedTasks: number;
    pendingTasks: number;
    statusCounts: Record<string, number>;
  };
  contacts: {
    total: number;
    companies: number;
    deals: number;
  };
}

interface TabData {
  emails: unknown[];
  calls: unknown[];
  notes: unknown[];
  activities: unknown[];
  tasks: unknown[];
  contacts: unknown[];
}

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================

export default function HubSpotUnifiedDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<HubSpotStats | null>(null);
  const [tabData, setTabData] = useState<TabData>({
    emails: [],
    calls: [],
    notes: [],
    activities: [],
    tasks: [],
    contacts: []
  });
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    status: '',
    type: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false
  });

  // ========================================================================================
  // EFECTOS Y FUNCIONES
  // ========================================================================================

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') {
      loadTabData(activeTab);
    }
  }, [activeTab, filters, pagination.page]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas de todos los endpoints en paralelo
      const [emailsRes, callsRes, notesRes, activitiesRes, tasksRes, overviewRes] = await Promise.all([
        fetch('/api/hubspot/emails?limit=1'),
        fetch('/api/hubspot/calls?limit=1'),
        fetch('/api/hubspot/notes?limit=1'),
        fetch('/api/hubspot/activities?limit=1'),
        fetch('/api/hubspot/tasks?limit=1'),
        fetch('/api/hubspot/sync-full')
      ]);

      const [emailsData, callsData, notesData, activitiesData, tasksData, overviewData] = await Promise.all([
        emailsRes.json(),
        callsRes.json(),
        notesRes.json(),
        activitiesRes.json(),
        tasksRes.json(),
        overviewRes.json()
      ]);

      setStats({
        emails: emailsData.stats,
        calls: callsData.stats,
        notes: notesData.stats,
        activities: activitiesData.stats,
        tasks: tasksData.stats,
        contacts: {
          total: overviewData.data.contacts,
          companies: overviewData.data.companies,
          deals: overviewData.data.deals
        }
      });

    } catch (error) {
      console.error('Error loading HubSpot data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab: string) => {
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type })
      });

      const response = await fetch(`/api/hubspot/${tab}?${params}`);
      const data = await response.json();

      if (data.success) {
        setTabData(prev => ({
          ...prev,
          [tab]: data.data
        }));
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          hasMore: data.pagination.hasMore
        }));
      }
    } catch (error) {
      console.error(`Error loading ${tab} data:`, error);
    }
  };

  const handleRefresh = () => {
    loadInitialData();
    if (activeTab !== 'overview') {
      loadTabData(activeTab);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatNumber = (num: number) => num.toLocaleString('es-ES');
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ========================================================================================
  // CONFIGURACIÓN DE TABS
  // ========================================================================================

  const tabs = [
    { 
      id: 'overview', 
      label: 'Resumen General', 
      icon: ChartBarIcon,
      description: 'Vista consolidada de todos los datos'
    },
    { 
      id: 'emails', 
      label: `Emails (${stats?.emails.total ? formatNumber(stats.emails.total) : '...'})`, 
      icon: EnvelopeIcon,
      description: 'Emails enviados y recibidos'
    },
    { 
      id: 'calls', 
      label: `Llamadas (${stats?.calls.total ? formatNumber(stats.calls.total) : '...'})`, 
      icon: PhoneIcon,
      description: 'Registro de llamadas'
    },
    { 
      id: 'notes', 
      label: `Notas (${stats?.notes.total ? formatNumber(stats.notes.total) : '...'})`, 
      icon: DocumentTextIcon,
      description: 'Notas y comentarios'
    },
    { 
      id: 'activities', 
      label: `Actividades (${stats?.activities.total ? formatNumber(stats.activities.total) : '...'})`, 
      icon: ClipboardDocumentListIcon,
      description: 'Todas las actividades'
    },
    { 
      id: 'tasks', 
      label: `Tareas (${stats?.tasks.total ? formatNumber(stats.tasks.total) : '...'})`, 
      icon: ClockIcon,
      description: 'Tareas programadas'
    }
  ];

  // ========================================================================================
  // RENDER
  // ========================================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSystem variant="screen" message="Cargando datos de HubSpot..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">HubSpot Dashboard</h1>
              <p className="text-gray-600 mt-1">Vista unificada de todos los datos sincronizados</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowPathIcon className="h-4 w-4" />
                <span>Actualizar</span>
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sincronizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Contacts & Companies */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatNumber(stats.contacts.total)}
                  </p>
                  <p className="text-sm text-gray-500">Contactos</p>
                  <p className="text-xs text-gray-400">
                    {formatNumber(stats.contacts.companies)} empresas
                  </p>
                </div>
              </div>
            </Card>

            {/* Emails */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <EnvelopeIcon className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-600">
                    {formatNumber(stats.emails.total)}
                  </p>
                  <p className="text-sm text-gray-500">Emails</p>
                  <p className="text-xs text-gray-400">
                    {Math.round((stats.emails.openedEmails / stats.emails.total) * 100)}% abiertos
                  </p>
                </div>
              </div>
            </Card>

            {/* Calls */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PhoneIcon className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(stats.calls.total)}
                  </p>
                  <p className="text-sm text-gray-500">Llamadas</p>
                  <p className="text-xs text-gray-400">
                    {formatDuration(stats.calls.averageDuration)} promedio
                  </p>
                </div>
              </div>
            </Card>

            {/* Tasks */}
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ClockIcon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-orange-600">
                    {formatNumber(stats.tasks.total)}
                  </p>
                  <p className="text-sm text-gray-500">Tareas</p>
                  <p className="text-xs text-gray-400">
                    {Math.round((stats.tasks.statusCounts.COMPLETED || 0) / stats.tasks.total * 100)}% completadas
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg shadow-sm border border-t-0 border-gray-200">
          {activeTab === 'overview' && stats && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Email Stats */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-green-600" />
                    Estadísticas de Email
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total emails:</span>
                      <span className="font-medium">{formatNumber(stats.emails.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enviados:</span>
                      <span className="font-medium">{formatNumber(stats.emails.outgoingEmails)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recibidos:</span>
                      <span className="font-medium">{formatNumber(stats.emails.incomingEmails)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entregados:</span>
                      <span className="font-medium">{formatNumber(stats.emails.deliveredEmails)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Abiertos:</span>
                      <span className="font-medium">{formatNumber(stats.emails.openedEmails)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clicks:</span>
                      <span className="font-medium">{formatNumber(stats.emails.clickedEmails)}</span>
                    </div>
                  </div>
                </Card>

                {/* Activities Stats */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Actividades por Tipo
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total actividades:</span>
                      <span className="font-medium">{formatNumber(stats.activities.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emails:</span>
                      <span className="font-medium">{formatNumber(stats.activities.emailActivities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Llamadas:</span>
                      <span className="font-medium">{formatNumber(stats.activities.callActivities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reuniones:</span>
                      <span className="font-medium">{formatNumber(stats.activities.meetingActivities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Notas:</span>
                      <span className="font-medium">{formatNumber(stats.activities.noteActivities)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conexiones exitosas:</span>
                      <span className="font-medium">{formatNumber(stats.activities.connectedOutcomes)}</span>
                    </div>
                  </div>
                </Card>

                {/* Tasks Stats */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-orange-600" />
                    Estado de Tareas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total tareas:</span>
                      <span className="font-medium">{formatNumber(stats.tasks.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completadas:</span>
                      <span className="font-medium text-green-600">
                        {formatNumber(stats.tasks.statusCounts.COMPLETED || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">En progreso:</span>
                      <span className="font-medium text-blue-600">
                        {formatNumber(stats.tasks.statusCounts.IN_PROGRESS || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pendientes:</span>
                      <span className="font-medium text-orange-600">
                        {formatNumber(stats.tasks.statusCounts.NOT_STARTED || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Diferidas:</span>
                      <span className="font-medium text-gray-600">
                        {formatNumber(stats.tasks.statusCounts.DEFERRED || 0)}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Notes Stats */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
                    Estadísticas de Notas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total notas:</span>
                      <span className="font-medium">{formatNumber(stats.notes.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Con adjuntos:</span>
                      <span className="font-medium">{formatNumber(stats.notes.notesWithAttachments)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Longitud promedio:</span>
                      <span className="font-medium">{stats.notes.averageBodyLength} caracteres</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-64">
                  <Input
                    placeholder="Buscar..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    icon={<MagnifyingGlassIcon className="h-4 w-4" />}
                  />
                </div>
                <div className="flex space-x-4">
                  <Input
                    type="date"
                    placeholder="Desde"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="Hasta"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>

              {/* Tab Content */}
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-medium mb-2">Vista de {tabs.find(t => t.id === activeTab)?.label}</h3>
                <p>Tabla detallada en desarrollo. Los endpoints están listos y funcionando.</p>
                <p className="text-sm mt-2">
                  Datos disponibles: {pagination.total.toLocaleString()} registros
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 