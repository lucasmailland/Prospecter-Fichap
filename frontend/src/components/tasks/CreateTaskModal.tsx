'use client';

import React, { useState, useEffect } from 'react';
import { X, Brain, Calendar, Clock, User, Building, Mail, Phone, MessageSquare, Zap, Sparkles } from 'lucide-react';
import { TaskCategory, TaskType, TaskPriority } from '@/types/common.types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<any>;
  onGenerateAI: (data: any) => Promise<any>;
}

interface FormData {
  subject: string;
  description: string;
  category: TaskCategory;
  type: TaskType;
  priority: TaskPriority;
  contactEmail: string;
  contactName: string;
  companyName: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number;
  customMessage: string;
}

const initialFormData: FormData = {
  subject: '',
  description: '',
  category: TaskCategory.PROSPECTING,
  type: TaskType.EMAIL,
  priority: TaskPriority.MEDIUM,
  contactEmail: '',
  contactName: '',
  companyName: '',
  scheduledDate: '',
  scheduledTime: '',
  estimatedDuration: 30,
  customMessage: ''
};

export default function CreateTaskModal({ isOpen, onClose, onCreate, onGenerateAI }: CreateTaskModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [step, setStep] = useState(1); // 1: Basic Info, 2: AI Suggestions, 3: Review

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setAiSuggestions(null);
      setErrors({});
      setStep(1);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.subject.trim()) newErrors.subject = 'El asunto es requerido';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'El email es requerido';
    if (!formData.contactName.trim()) newErrors.contactName = 'El nombre es requerido';
    if (!formData.companyName.trim()) newErrors.companyName = 'La empresa es requerida';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateAI = async () => {
    if (!validateForm()) return;

    setLoadingAI(true);
    try {
      const suggestions = await onGenerateAI(formData);
      setAiSuggestions(suggestions);
      setStep(2);
    } catch (_error) {
      console.error('Error generating AI suggestions:', _error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoadingSubmit(true);
    try {
      const taskData = {
        ...formData,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        ...(aiSuggestions && {
          aiGeneratedEmail: aiSuggestions.emailTemplate,
          aiGeneratedScript: aiSuggestions.callScript,
          aiGeneratedComment: aiSuggestions.comment
        })
      };
      
      await onCreate(taskData);
      onClose();
    } catch (_error) {
      console.error('Error creating task:', _error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: null }));
    }
  };

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case TaskType.EMAIL: return <Mail className="w-4 h-4" />;
      case TaskType.CALL: return <Phone className="w-4 h-4" />;
      case TaskType.MEETING: return <Calendar className="w-4 h-4" />;
      case TaskType.LINKEDIN_MESSAGE: return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW: return 'bg-blue-100 text-blue-800 border-blue-200';
      case TaskPriority.MEDIUM: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case TaskPriority.HIGH: return 'bg-orange-100 text-orange-800 border-orange-200';
      case TaskPriority.URGENT: return 'bg-red-100 text-red-800 border-red-200';
      case TaskPriority.CRITICAL: return 'bg-red-200 text-red-900 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Crear Nueva Tarea</h2>
              <p className="text-sm text-gray-600">
                Paso {step} de 3 - {step === 1 ? 'Información básica' : step === 2 ? 'Sugerencias de IA' : 'Revisión final'}
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

        {/* Progress Bar */}
        <div className="px-6 py-2 bg-gray-50">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i}
                </div>
                {i < 3 && (
                  <div className={`flex-1 h-2 rounded ${
                    i < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Task Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Tarea
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.values(TaskType).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateFormData('type', type)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        {getTypeIcon(type)}
                        <span className="text-xs font-medium">{type.replace('_', ' ')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value as TaskCategory)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.values(TaskCategory).map((category) => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(TaskPriority).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => updateFormData('priority', priority)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                          formData.priority === priority
                            ? getPriorityColor(priority)
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => updateFormData('subject', e.target.value)}
                  placeholder="Ej: Seguimiento de propuesta comercial"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.subject ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Descripción detallada de la tarea..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Nombre del Contacto *
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    placeholder="Juan Pérez"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contactName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email del Contacto *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    placeholder="juan@empresa.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Empresa *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  placeholder="Acme Corp"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.companyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Fecha Programada
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => updateFormData('scheduledDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => updateFormData('scheduledTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duración (min)
                  </label>
                  <select
                    value={formData.estimatedDuration}
                    onChange={(e) => updateFormData('estimatedDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 min</option>
                    <option value={30}>30 min</option>
                    <option value={45}>45 min</option>
                    <option value={60}>1 hora</option>
                    <option value={120}>2 horas</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: AI Suggestions */}
          {step === 2 && aiSuggestions && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-900">Sugerencias de IA</h3>
                  <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {Math.round(aiSuggestions.successProbability * 100)}% éxito
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📧 Email Generado</h4>
                    <div className="bg-white p-4 rounded-lg border text-sm">
                      <div className="whitespace-pre-wrap">{aiSuggestions.emailTemplate}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">📞 Script de Llamada</h4>
                    <div className="bg-white p-4 rounded-lg border text-sm">
                      <div className="whitespace-pre-wrap">{aiSuggestions.callScript}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-xs text-gray-600">Mejor momento</div>
                    <div className="font-medium">{aiSuggestions.bestDay} {aiSuggestions.bestTime}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-xs text-gray-600">Probabilidad</div>
                    <div className="font-medium text-green-600">{Math.round(aiSuggestions.successProbability * 100)}%</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="text-xs text-gray-600">Comentario CRM</div>
                    <div className="font-medium text-sm">{aiSuggestions.comment}</div>
                  </div>
                </div>
              </div>

              {/* Custom Message Override */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje Personalizado (opcional)
                </label>
                <textarea
                  value={formData.customMessage}
                  onChange={(e) => updateFormData('customMessage', e.target.value)}
                  placeholder="Sobrescribe el mensaje generado por IA..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Si dejas esto vacío, se usará el contenido generado por IA
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Revisión Final</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información de la Tarea</h4>
                    <div className="space-y-2">
                      <div><span className="text-gray-600">Tipo:</span> {formData.type.replace('_', ' ')}</div>
                      <div><span className="text-gray-600">Categoría:</span> {formData.category.replace('_', ' ')}</div>
                      <div><span className="text-gray-600">Prioridad:</span> {formData.priority}</div>
                      <div><span className="text-gray-600">Asunto:</span> {formData.subject}</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información del Contacto</h4>
                    <div className="space-y-2">
                      <div><span className="text-gray-600">Nombre:</span> {formData.contactName}</div>
                      <div><span className="text-gray-600">Email:</span> {formData.contactEmail}</div>
                      <div><span className="text-gray-600">Empresa:</span> {formData.companyName}</div>
                    </div>
                  </div>
                </div>

                {(formData.scheduledDate || formData.scheduledTime) && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Programación</h4>
                    <div className="text-sm">
                      {formData.scheduledDate && (
                        <span>📅 {new Date(formData.scheduledDate).toLocaleDateString()}</span>
                      )}
                      {formData.scheduledTime && (
                        <span className="ml-4">🕐 {formData.scheduledTime}</span>
                      )}
                      <span className="ml-4">⏱️ {formData.estimatedDuration} minutos</span>
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
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anterior
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            {step === 1 && (
              <button
                onClick={handleGenerateAI}
                disabled={loadingAI}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loadingAI ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                <span>{loadingAI ? 'Generando...' : 'Generar con IA'}</span>
              </button>
            )}

            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Revisar
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleSubmit}
                disabled={loadingSubmit}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingSubmit ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>{loadingSubmit ? 'Creando...' : 'Crear Tarea'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 