'use client';

import React, { useState } from 'react';
import { Task } from '@prisma/client';
import { X, Brain, Sparkles, RefreshCw, Target, MessageSquare, Mail, Phone, Calendar, Zap, TrendingUp, Clock, User } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTasks: Task[];
  onOptimize: (tasks: Task[]) => Promise<any>;
  onGenerateContent: (task: Task, contentType: string) => Promise<any>;
}

interface AIResponse {
  optimizations: {
    taskId: string;
    originalScore: number;
    optimizedScore: number;
    improvements: string[];
    newContent: {
      email?: string;
      script?: string;
      comment?: string;
    };
  }[];
  suggestions: string[];
  insights: string[];
}

export default function AIAssistantModal({ 
  isOpen, 
  onClose, 
  selectedTasks, 
  onOptimize, 
  onGenerateContent 
}: AIAssistantModalProps) {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [activeTab, setActiveTab] = useState('optimize');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [contentType, setContentType] = useState('email');
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  if (!isOpen) return null;

  // const _handleOptimize = async () => {
    if (selectedTasks.length === 0) return;

    setLoading(true);
    try {
      const response = await onOptimize(selectedTasks);
      setAiResponse(response);
    } catch (_error) {
      console.error('Error optimizing tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // const _handleGenerateContent = async (task: Task, type: string) => {
    setLoading(true);
    try {
      const content = await onGenerateContent(task, type);
      setGeneratedContent(content);
    } catch (_error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  // const _getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  // const _getScoreBackground = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 border-green-200';
    if (score >= 0.6) return 'bg-yellow-100 border-yellow-200';
    if (score >= 0.4) return 'bg-orange-100 border-orange-200';
    return 'bg-red-100 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-600">
                {selectedTasks.length} tarea{selectedTasks.length !== 1 ? 's' : ''} seleccionada{selectedTasks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('optimize')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'optimize'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Optimizar Tareas
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'generate'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Generar Contenido
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'insights'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Insights
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Optimize Tab */}
          {activeTab === 'optimize' && (
            <div className="space-y-6">
              {!aiResponse ? (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Optimizar Tareas con IA</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Nuestra IA analizará tus tareas seleccionadas y sugerirá mejoras para aumentar 
                      la probabilidad de éxito.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-purple-900">Mensajes Optimizados</h4>
                      <p className="text-sm text-purple-700">Mejora el contenido y el tono</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                      <Clock className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                      <h4 className="font-medium text-pink-900">Mejor Timing</h4>
                      <p className="text-sm text-pink-700">Encuentra el momento ideal</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-blue-900">Personalización</h4>
                      <p className="text-sm text-blue-700">Adapta según el perfil</p>
                    </div>
                  </div>

                  <button
                    onClick={handleOptimize}
                    disabled={loading || selectedTasks.length === 0}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <RefreshCw className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Optimizando...' : 'Optimizar Tareas'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Optimization Results */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Sparkles className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">Resultados de Optimización</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round(aiResponse.optimizations.reduce((acc, opt) => acc + opt.optimizedScore, 0) / aiResponse.optimizations.length * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Probabilidad Promedio</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-blue-600">
                          +{Math.round(aiResponse.optimizations.reduce((acc, opt) => acc + (opt.optimizedScore - opt.originalScore), 0) / aiResponse.optimizations.length * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Mejora Promedio</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-purple-600">
                          {aiResponse.optimizations.length}
                        </div>
                        <div className="text-sm text-gray-600">Tareas Optimizadas</div>
                      </div>
                    </div>
                  </div>

                  {/* Individual Task Results */}
                  <div className="space-y-4">
                    {aiResponse.optimizations.map((optimization, _index) => {
                      const task = selectedTasks.find(t => t.id === optimization.taskId);
                      if (!task) return null;

                      return (
                        <div key={optimization.taskId} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-gray-900">{task.subject}</h4>
                              <p className="text-sm text-gray-600">{task.contactName} • {task.companyName}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className={`text-lg font-bold ${getScoreColor(optimization.originalScore)}`}>
                                  {Math.round(optimization.originalScore * 100)}%
                                </div>
                                <div className="text-xs text-gray-500">Original</div>
                              </div>
                              <div className="text-gray-400">→</div>
                              <div className="text-center">
                                <div className={`text-lg font-bold ${getScoreColor(optimization.optimizedScore)}`}>
                                  {Math.round(optimization.optimizedScore * 100)}%
                                </div>
                                <div className="text-xs text-gray-500">Optimizado</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Mejoras Sugeridas</h5>
                              <ul className="space-y-1">
                                {optimization.improvements.map((improvement, i) => (
                                  <li key={i} className="text-sm text-gray-600 flex items-start">
                                    <span className="text-green-500 mr-2">•</span>
                                    {improvement}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Contenido Optimizado</h5>
                              <div className="space-y-2">
                                {optimization.newContent.email && (
                                  <div className="bg-gray-50 p-3 rounded border">
                                    <div className="text-xs text-gray-500 mb-1">Email</div>
                                    <div className="text-sm">{optimization.newContent.email.substring(0, 100)}...</div>
                                  </div>
                                )}
                                {optimization.newContent.script && (
                                  <div className="bg-gray-50 p-3 rounded border">
                                    <div className="text-xs text-gray-500 mb-1">Script</div>
                                    <div className="text-sm">{optimization.newContent.script.substring(0, 100)}...</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generate Content Tab */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Generar Contenido para Tarea</h3>
                
                {/* Task Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Tarea</label>
                  <select
                    value={selectedTask?.id || ''}
                    onChange={(e) => setSelectedTask(selectedTasks.find(t => t.id === e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona una tarea...</option>
                    {selectedTasks.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.subject} - {task.contactName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content Type Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contenido</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => setContentType('email')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        contentType === 'email'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Mail className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Email</div>
                    </button>
                    <button
                      onClick={() => setContentType('script')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        contentType === 'script'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Phone className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Script</div>
                    </button>
                    <button
                      onClick={() => setContentType('meeting')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        contentType === 'meeting'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Calendar className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Reunión</div>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => selectedTask && handleGenerateContent(selectedTask, contentType)}
                  disabled={!selectedTask || loading}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Generando...' : 'Generar Contenido'}</span>
                </button>
              </div>

              {/* Generated Content */}
              {generatedContent && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Contenido Generado</h4>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="whitespace-pre-wrap text-sm">{generatedContent.content}</div>
                  </div>
                  {generatedContent.tips && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 mb-2">Consejos de Optimización</h5>
                      <ul className="space-y-1">
                        {generatedContent.tips.map((tip: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2">💡</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Insights & Recomendaciones</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Análisis de Rendimiento</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <span className="text-sm text-gray-600">Tasa de Éxito Promedio</span>
                        <span className="font-medium text-green-600">
                          {Math.round(selectedTasks.reduce((acc, task) => acc + (task.successProbability || 0), 0) / selectedTasks.length * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <span className="text-sm text-gray-600">Mejor Tipo de Contacto</span>
                        <span className="font-medium text-blue-600">
                          {selectedTasks.filter(t => t.type === 'EMAIL').length > selectedTasks.filter(t => t.type === 'CALL').length ? 'Email' : 'Llamada'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                        <span className="text-sm text-gray-600">Prioridad Común</span>
                        <span className="font-medium text-purple-600">
                          {selectedTasks.filter(t => t.priority === 'HIGH').length > selectedTasks.length / 2 ? 'Alta' : 'Media'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recomendaciones</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">Timing Óptimo</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Martes y miércoles entre 10:00-11:00 AM muestran mejores resultados
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2 mb-1">
                          <User className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">Personalización</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Mensajes personalizados aumentan 40% la tasa de respuesta
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border">
                        <div className="flex items-center space-x-2 mb-1">
                          <MessageSquare className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Seguimiento</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Considera un seguimiento después de 3-5 días sin respuesta
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Potenciado por IA • Probabilidad de éxito mejorada
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 