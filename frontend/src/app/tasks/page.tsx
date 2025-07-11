'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatus, TaskPriority, TaskType } from '@/types/common.types';

import { CheckCircle, XCircle, Clock, Send, Plus, Filter, Search, Calendar, 
         Brain, BarChart3, Settings, Users, HelpCircle, Download, Upload,
         Eye, Edit, Trash2, MoreHorizontal, Zap, Target, MessageSquare, Phone } from 'lucide-react';
import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import AIAssistantModal from '@/components/tasks/AIAssistantModal';

const TasksPage = () => {
  const {
    tasks,
    loading,
    error,
    pagination,
    filters,
    selectedTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    setPage,
    refreshTasks,
    selectTask,
    deselectTask,
    selectAllTasks,
    deselectAllTasks,
    approveTask,
    rejectTask,
    syncToHubSpot,
    bulkAction,
    generateAISuggestions
  } = useTasks();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const stats = {
    total: tasks.length,
    draft: tasks.filter(t => t.status === 'PENDING').length,
    approved: tasks.filter(t => t.status === 'APPROVED').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    synced: tasks.filter(t => t.status === 'COMPLETED').length, // Placeholder
    aiGenerated: tasks.filter(t => t.type === 'AI_GENERATED').length
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ ...filters, searchTerm: term });
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'PENDING': return 'text-gray-600 bg-gray-100';
      case 'IN_PROGRESS': return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'COMPLETED': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'LOW': return 'text-blue-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-orange-600';
      case 'URGENT': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'MANUAL': return <Target className="w-4 h-4" />;
      case 'AUTOMATED': return <Zap className="w-4 h-4" />;
      case 'TEMPLATE': return <MessageSquare className="w-4 h-4" />;
      case 'AI_GENERATED': return <Brain className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
              <p className="text-gray-600 mt-1">
                Gestiona y valida tareas antes de sincronizar con HubSpot
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAIPanel(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                <Brain className="w-5 h-5" />
                <span>AI Assistant</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Tarea</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              </div>
              <Edit className="w-8 h-8 text-gray-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sincronizadas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.synced}</p>
              </div>
              <Send className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Generated</p>
                <p className="text-2xl font-bold text-purple-600">{stats.aiGenerated}</p>
              </div>
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar tareas..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                <span>Filtros</span>
              </button>
              <button
                onClick={refreshTasks}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedTasks.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedTasks.length} tareas seleccionadas
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => bulkAction('approve')}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => bulkAction('sync')}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Sincronizar
                  </button>
                  <button
                    onClick={() => bulkAction('delete')}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedTasks.length === tasks.length && tasks.length > 0}
                      onChange={(e) => e.target.checked ? selectAllTasks() : deselectAllTasks()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarea
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Programada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span>Cargando tareas...</span>
                      </div>
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <Target className="w-12 h-12 text-gray-300" />
                        <span>No hay tareas creadas aún</span>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Crear primera tarea
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={(e) => 
                            e.target.checked ? selectTask(task.id) : deselectTask(task.id)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-400">
                            {getTypeIcon(task.type)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {task.subject}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.contactName}</div>
                        <div className="text-sm text-gray-500">{task.contactEmail}</div>
                        {task.companyName && (
                          <div className="text-sm text-gray-500">{task.companyName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {task.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.scheduledDate && (
                          <div>
                            <div>{new Date(task.scheduledDate).toLocaleDateString()}</div>
                            {task.scheduledTime && (
                              <div className="text-xs">{task.scheduledTime}</div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${50}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            50%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {task.status === 'PENDING' && (
                            <button
                              onClick={() => approveTask(task.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {task.status === 'APPROVED' && (
                            <button
                              onClick={() => syncToHubSpot(task.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Mostrando {((pagination.currentPage - 1) * 20) + 1} a{' '}
                  {Math.min(pagination.currentPage * 20, pagination.total)} de {pagination.total} tareas
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setPage(pagination.currentPage + 1)}
                    disabled={!pagination.hasMore}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={async (id: string, data: any) => {
            await updateTask(id, data);
          }}
          onApprove={approveTask}
          onReject={rejectTask}
          onSync={syncToHubSpot}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createTask}
        onGenerateAI={generateAISuggestions}
      />

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
        selectedTasks={tasks.filter(t => selectedTasks.includes(t.id))}
        onOptimize={async (tasks) => {
          // Simulate AI optimization
          return {
            optimizations: tasks.map(task => ({
              taskId: task.id,
              originalScore: task.successProbability || 0.5,
              optimizedScore: Math.min(1, (task.successProbability || 0.5) + 0.2),
              improvements: [
                'Personalizar saludo con información de la empresa',
                'Agregar call-to-action específico',
                'Optimizar hora de envío basado en zona horaria'
              ],
              newContent: {
                email: 'Email optimizado con mejor personalización...',
                script: 'Script mejorado con técnicas de persuasión...'
              }
            })),
            suggestions: [
              'Considera enviar emails los martes por la mañana',
              'Personaliza más el mensaje usando datos de la empresa'
            ],
            insights: [
              'Tasa de respuesta promedio: 15%',
              'Mejor día para contactar: Martes'
            ]
          };
        }}
        onGenerateContent={async (task, contentType) => {
          // Simulate AI content generation
          const contents = {
            email: `Estimado/a ${task.contactName},

Espero que se encuentre bien. He estado revisando la información de ${task.companyName} y me parece que podríamos ayudarles a mejorar sus resultados.

¿Tendría disponibilidad para una breve llamada de 15 minutos la próxima semana?

Saludos cordiales,
[Tu nombre]`,
            script: `1. Saludo personalizado: "Hola ${task.contactName}, habla [tu nombre]"
2. Propósito: "Te contacto porque vi que ${task.companyName} podría beneficiarse de..."
3. Pregunta abierta: "¿Cómo están manejando actualmente...?"
4. Propuesta de valor: "En casos similares hemos logrado..."
5. Próximo paso: "¿Cuándo podrías dedicar 15 minutos para explorar esto?"`,
            meeting: `Reunión con ${task.contactName} - ${task.companyName}

Objetivos:
- Entender sus necesidades actuales
- Presentar nuestra solución
- Definir próximos pasos

Agenda:
1. Presentaciones (5 min)
2. Situación actual (10 min)
3. Nuestra propuesta (15 min)
4. Q&A (10 min)
5. Próximos pasos (5 min)`
          };
          
          return {
            content: contents[contentType as keyof typeof contents] || 'Contenido generado...',
            tips: [
              'Personaliza el mensaje con datos específicos de la empresa',
              'Mantén un tono profesional pero amigable',
              'Incluye un call-to-action claro'
            ]
          };
        }}
      />
    </div>
  );
};

export default TasksPage; 