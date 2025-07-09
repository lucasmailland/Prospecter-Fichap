'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '@prisma/client';
import { X, Edit, CheckCircle, XCircle, Send, Clock, Calendar, User, Building, Mail, Phone, MessageSquare, Brain, Zap, History, AlertCircle } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: unknown) => Promise<void>;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onSync: (id: string) => Promise<void>;
}

export default function TaskDetailModal({ 
  task, 
  isOpen, 
  onClose, 
  onUpdate, 
  onApprove, 
  onReject, 
  onSync 
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (task && isOpen) {
      setEditData({
        subject: task.subject,
        description: task.description || '',
        customMessage: task.customMessage || '',
        scheduledDate: task.scheduledDate ? new Date(task.scheduledDate).toISOString().split('T')[0] : '',
        scheduledTime: task.scheduledTime || '',
        estimatedDuration: task.estimatedDuration
      });
      setIsEditing(false);
      setActiveTab('details');
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  // const _getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DRAFT: return 'bg-gray-100 text-gray-800 border-gray-200';
      case TaskStatus.PENDING_APPROVAL: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TaskStatus.APPROVED: return 'bg-green-100 text-green-800 border-green-200';
      case TaskStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      case TaskStatus.SCHEDULED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case TaskStatus.COMPLETED: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // const _getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW: return 'text-blue-600';
      case TaskPriority.MEDIUM: return 'text-yellow-600';
      case TaskPriority.HIGH: return 'text-orange-600';
      case TaskPriority.URGENT: return 'text-red-600';
      case TaskPriority.CRITICAL: return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  // const _getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return <Mail className="w-4 h-4" />;
      case 'CALL': return <Phone className="w-4 h-4" />;
      case 'MEETING': return <Calendar className="w-4 h-4" />;
      case 'LINKEDIN_MESSAGE': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // const _handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(task.id, editData);
      setIsEditing(false);
    } catch (_error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  // const _handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(task.id);
    } catch (_error) {
      console.error('Error approving task:', error);
    } finally {
      setLoading(false);
    }
  };

  // const _handleReject = async () => {
    if (!rejectReason.trim()) return;
    
    setLoading(true);
    try {
      await onReject(task.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
    } catch (_error) {
      console.error('Error rejecting task:', error);
    } finally {
      setLoading(false);
    }
  };

  // const _handleSync = async () => {
    setLoading(true);
    try {
      await onSync(task.id);
    } catch (_error) {
      console.error('Error syncing task:', error);
    } finally {
      setLoading(false);
    }
  };

  // const _formatDate = (date: unknown) => {
    if (!date) return 'No programada';
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                {getTypeIcon(task.type)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{task.subject}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.syncedToHubspot && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      ✓ Sincronizado
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Detalles
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'ai'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-1" />
              IA & Contenido
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History className="w-4 h-4 inline mr-1" />
              Timeline
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de la Tarea</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.subject}
                            onChange={(e) => setEditData({...editData, subject: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-900">{task.subject}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        {isEditing ? (
                          <textarea
                            value={editData.description}
                            onChange={(e) => setEditData({...editData, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-gray-700">{task.description || 'Sin descripción'}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                          <p className="text-gray-900">{task.type.replace('_', ' ')}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                          <p className="text-gray-900">{task.category.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Contacto</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{task.contactName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{task.contactEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{task.companyName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Programación</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.scheduledDate}
                          onChange={(e) => setEditData({...editData, scheduledDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{formatDate(task.scheduledDate)}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                      {isEditing ? (
                        <input
                          type="time"
                          value={editData.scheduledTime}
                          onChange={(e) => setEditData({...editData, scheduledTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{task.scheduledTime || 'No especificada'}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                      {isEditing ? (
                        <select
                          value={editData.estimatedDuration}
                          onChange={(e) => setEditData({...editData, estimatedDuration: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value={15}>15 min</option>
                          <option value={30}>30 min</option>
                          <option value={45}>45 min</option>
                          <option value={60}>1 hora</option>
                          <option value={120}>2 horas</option>
                        </select>
                      ) : (
                        <span className="text-gray-700">{task.estimatedDuration} minutos</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Score */}
                {task.successProbability && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-900">Probabilidad de Éxito</span>
                        <span className="text-lg font-bold text-purple-700">
                          {Math.round(task.successProbability * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${task.successProbability * 100}%` }}
                        ></div>
                      </div>
                      {task.bestContactDay && task.bestContactTime && (
                        <div className="mt-3 text-sm text-purple-700">
                          <strong>Mejor momento:</strong> {task.bestContactDay} a las {task.bestContactTime}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI & Content Tab */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                {/* AI Generated Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido Generado por IA</h3>
                  
                  {task.aiGeneratedEmail && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">📧 Email</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="whitespace-pre-wrap text-sm">{task.aiGeneratedEmail}</div>
                      </div>
                    </div>
                  )}

                  {task.aiGeneratedScript && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">📞 Script de Llamada</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="whitespace-pre-wrap text-sm">{task.aiGeneratedScript}</div>
                      </div>
                    </div>
                  )}

                  {task.aiGeneratedComment && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">💬 Comentario CRM</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="text-sm">{task.aiGeneratedComment}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Custom Message */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Mensaje Personalizado</h4>
                  {isEditing ? (
                    <textarea
                      value={editData.customMessage}
                      onChange={(e) => setEditData({...editData, customMessage: e.target.value})}
                      placeholder="Mensaje personalizado que sobrescribe el contenido de IA..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      {task.customMessage ? (
                        <div className="whitespace-pre-wrap text-sm">{task.customMessage}</div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No hay mensaje personalizado</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline de la Tarea</h3>
                
                <div className="space-y-4">
                  {/* Created */}
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Tarea Creada</div>
                      <div className="text-sm text-gray-500">
                        {new Date(task.createdAt).toLocaleString('es-ES')}
                      </div>
                    </div>
                  </div>

                  {/* Updated */}
                  {task.updatedAt !== task.createdAt && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-full">
                        <Edit className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Última Actualización</div>
                        <div className="text-sm text-gray-500">
                          {new Date(task.updatedAt).toLocaleString('es-ES')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approved */}
                  {task.approvedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Tarea Aprobada</div>
                        <div className="text-sm text-gray-500">
                          {new Date(task.approvedAt).toLocaleString('es-ES')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Synced */}
                  {task.syncedAt && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Send className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Sincronizada con HubSpot</div>
                        <div className="text-sm text-gray-500">
                          {new Date(task.syncedAt).toLocaleString('es-ES')}
                        </div>
                        {task.hubspotTaskId && (
                          <div className="text-xs text-gray-400">ID: {task.hubspotTaskId}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejected */}
                  {task.status === TaskStatus.REJECTED && task.rejectedReason && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <XCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Tarea Rechazada</div>
                        <div className="text-sm text-gray-500">{task.rejectedReason}</div>
                      </div>
                    </div>
                  )}

                  {/* Sync Error */}
                  {task.syncError && (
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Error de Sincronización</div>
                        <div className="text-sm text-gray-500">{task.syncError}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-3">
              {task.status === TaskStatus.DRAFT && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Aprobar</span>
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar</span>
                  </button>
                </>
              )}

              {task.status === TaskStatus.APPROVED && !task.syncedToHubspot && (
                <button
                  onClick={handleSync}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Sincronizar</span>
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                    <span>Guardar</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rechazar Tarea</h3>
            <p className="text-gray-600 mb-4">Por favor, proporciona una razón para el rechazo:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Razón del rechazo..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 