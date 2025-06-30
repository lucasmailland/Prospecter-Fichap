'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Illustration from '@/components/ui/Illustration';
import LoadingState from '@/components/ui/LoadingState';
import { CreateProspectDto, UpdateProspectDto } from '@/types/api.types';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Interfaz local simplificada que coincide con los DTOs del backend
interface LocalLead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status?: string;
}

interface LeadFormProps {
  initialData?: LocalLead;
  onSubmit: (leadData: CreateProspectDto | UpdateProspectDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function LeadForm({ initialData, onSubmit, onCancel, isLoading = false }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    company: initialData?.company || '',
    phone: initialData?.phone || '',
    status: initialData?.status || 'cold',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusOptions = [
    { value: 'qualified', label: 'Qualificado', color: 'green' },
    { value: 'potential', label: 'Potencial', color: 'yellow' },
    { value: 'cold', label: 'Frío', color: 'blue' },
    { value: 'hot', label: 'Caliente', color: 'red' },
    { value: 'warm', label: 'Tibio', color: 'orange' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Preparar datos según el DTO del backend
      const submitData: CreateProspectDto | UpdateProspectDto = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        status: formData.status || undefined,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (isSubmitting) {
    return (
      <div className="p-8">
        <LoadingState 
          message={initialData ? "Actualizando lead..." : "Creando nuevo lead..."} 
          size="md" 
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Editar Lead' : 'Nuevo Lead'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {initialData ? 'Actualiza la información del lead' : 'Agrega un nuevo prospecto a tu base de datos'}
            </p>
          </div>
          {!initialData && (
            <div className="hidden lg:block">
              <Illustration name="success" size="sm" className="opacity-30" />
            </div>
          )}
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <UserIcon className="h-4 w-4 inline mr-2" />
              Nombre completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                errors.name 
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Ej: María González"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <EnvelopeIcon className="h-4 w-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                errors.email 
                  ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="maria@empresa.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Optional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BuildingOfficeIcon className="h-4 w-4 inline mr-2" />
              Empresa
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
              placeholder="Tech Solutions Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <PhoneIcon className="h-4 w-4 inline mr-2" />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors"
              placeholder="+54 11 1234-5678"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Estado del Lead
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={formData.status === option.value}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="sr-only"
                />
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-colors w-full ${
                  formData.status === option.value
                    ? option.color === 'green'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : option.color === 'yellow'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      : option.color === 'red'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : option.color === 'orange'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    option.color === 'green' ? 'bg-green-500' : 
                    option.color === 'yellow' ? 'bg-yellow-500' : 
                    option.color === 'red' ? 'bg-red-500' : 
                    option.color === 'orange' ? 'bg-orange-500' : 
                    'bg-blue-500'
                  }`} />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {initialData ? 'Actualizar Lead' : 'Crear Lead'}
          </button>
        </div>
      </form>
    </motion.div>
  );
} 