'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/ui/Modal';
import LoadingSystem from '@/components/ui/LoadingSystem';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  BriefcaseIcon,
  TagIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface LeadFormData {
  // Información básica
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  
  // Información profesional
  company: string;
  jobTitle: string;
  website: string;
  linkedinUrl: string;
  
  // Información de empresa y ubicación
  companySize: string;
  industry: string;
  location: string;
  country: string;
  city: string;
  state: string;
  timezone: string;
  language: string;
  
  // Información de lead
  source: string;
  status: string;
  priority: number;
  score: number;
  notes: string;
  
  // Campos adicionales para tracking
  lastContactedAt: string;
  department: string;
  tags: string[];
  nextFollowUpDate: string;
}

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: unknown) => Promise<void>;
  initialData?: Partial<LeadFormData>;
  mode?: 'create' | 'edit';
}

const tabs = [
  { id: 'basic', name: 'Información Básica', icon: UserIcon },
  { id: 'professional', name: 'Información Profesional', icon: BriefcaseIcon },
  { id: 'contact', name: 'Contacto y Ubicación', icon: MapPinIcon },
  { id: 'lead', name: 'Datos del Lead', icon: TagIcon },
  { id: 'notes', name: 'Notas y Seguimiento', icon: DocumentTextIcon },
];

export default function LeadForm({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: LeadFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<LeadFormData>({
    // Información básica
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    
    // Información profesional
    company: initialData?.company || '',
    jobTitle: initialData?.jobTitle || '',
    website: initialData?.website || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    
    // Información de empresa y ubicación
    companySize: initialData?.companySize || '',
    industry: initialData?.industry || '',
    location: initialData?.location || '',
    country: initialData?.country || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    timezone: initialData?.timezone || '',
    language: initialData?.language || '',
    
    // Información de lead
    source: initialData?.source || 'manual',
    status: initialData?.status || 'new',
    priority: initialData?.priority || 2,
    score: initialData?.score || 0,
    notes: initialData?.notes || '',
    
    // Campos adicionales para tracking
    lastContactedAt: initialData?.lastContactedAt || '',
    department: initialData?.department || '',
    tags: initialData?.tags || [],
    nextFollowUpDate: initialData?.nextFollowUpDate || '',
  });

  // const _validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const _handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setActiveTab('basic'); // Ir a la primera tab si hay errores
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        // Información básica
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        
        // Información profesional
        company: formData.company,
        jobTitle: formData.jobTitle,
        website: formData.website,
        linkedinUrl: formData.linkedinUrl,
        
        // Información de empresa y ubicación
        companySize: formData.companySize,
        industry: formData.industry,
        location: formData.location,
        country: formData.country,
        city: formData.city,
        state: formData.state,
        timezone: formData.timezone,
        language: formData.language,
        
        // Información de lead
        source: formData.source,
        status: formData.status,
        priority: formData.priority,
        score: formData.score,
        notes: formData.notes,
        
        // Campos adicionales para tracking
        lastContactedAt: formData.lastContactedAt,
        department: formData.department,
        tags: formData.tags,
        nextFollowUpDate: formData.nextFollowUpDate,
      };
      
// console.log('📤 Enviando datos del formulario:', submitData);
      await onSubmit(submitData);
    } catch (_error) {
console.warn('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const _handleChange = (field: keyof LeadFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // const _addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      handleChange('tags', [...formData.tags, tag]);
    }
  };

  // const _removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // const _renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-2" />
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    errors.firstName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="María"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                    errors.lastName ? 'border-red-300 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="González"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="María González"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="maria@empresa.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="+54 11 1234-5678"
                />
              </div>
            </div>
          </div>
        );

      case 'professional':
        return (
          <div className="space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="Tech Solutions Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BriefcaseIcon className="h-4 w-4 inline mr-2" />
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="Directora de Marketing"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Departamento
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="">Seleccionar departamento</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Ventas</option>
                  <option value="it">IT/Tecnología</option>
                  <option value="hr">Recursos Humanos</option>
                  <option value="finance">Finanzas</option>
                  <option value="operations">Operaciones</option>
                  <option value="executive">Ejecutivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industria
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="">Seleccionar industria</option>
                  <option value="technology">Tecnología</option>
                  <option value="finance">Finanzas</option>
                  <option value="healthcare">Salud</option>
                  <option value="education">Educación</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufactura</option>
                  <option value="consulting">Consultoría</option>
                  <option value="real-estate">Inmobiliaria</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño de empresa
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleChange('companySize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="">Seleccionar tamaño</option>
                  <option value="1-10">1-10 empleados</option>
                  <option value="11-50">11-50 empleados</option>
                  <option value="51-200">51-200 empleados</option>
                  <option value="201-500">201-500 empleados</option>
                  <option value="501-1000">501-1000 empleados</option>
                  <option value="1000+">1000+ empleados</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <GlobeAltIcon className="h-4 w-4 inline mr-2" />
                  Sitio web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="https://empresa.com"
                />
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="https://linkedin.com/in/maria-gonzalez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-2" />
                  Ubicación general
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="Buenos Aires, Argentina"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="Buenos Aires"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado/Provincia
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  placeholder="CABA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="">Seleccionar país</option>
                  <option value="AR">Argentina</option>
                  <option value="US">Estados Unidos</option>
                  <option value="ES">España</option>
                  <option value="MX">México</option>
                  <option value="CO">Colombia</option>
                  <option value="CL">Chile</option>
                  <option value="PE">Perú</option>
                  <option value="BR">Brasil</option>
                  <option value="UY">Uruguay</option>
                  <option value="PY">Paraguay</option>
                  <option value="BO">Bolivia</option>
                  <option value="EC">Ecuador</option>
                  <option value="VE">Venezuela</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zona horaria
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="">Seleccionar zona horaria</option>
                  <option value="America/Argentina/Buenos_Aires">GMT-3 (Buenos Aires)</option>
                  <option value="America/New_York">GMT-5 (New York)</option>
                  <option value="Europe/Madrid">GMT+1 (Madrid)</option>
                  <option value="America/Mexico_City">GMT-6 (México)</option>
                  <option value="America/Bogota">GMT-5 (Bogotá)</option>
                  <option value="America/Santiago">GMT-4 (Santiago)</option>
                  <option value="America/Lima">GMT-5 (Lima)</option>
                  <option value="America/Sao_Paulo">GMT-3 (São Paulo)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Idioma
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="">Seleccionar idioma</option>
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="pt">Portugués</option>
                  <option value="fr">Francés</option>
                  <option value="it">Italiano</option>
                  <option value="de">Alemán</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'lead':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fuente del lead
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="manual">Manual</option>
                  <option value="website">Sitio web</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referido</option>
                  <option value="cold-email">Email frío</option>
                  <option value="event">Evento</option>
                  <option value="import">Importación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estado del lead
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="new">Nuevo</option>
                  <option value="contacted">Contactado</option>
                  <option value="qualified">Calificado</option>
                  <option value="proposal">Propuesta</option>
                  <option value="negotiation">Negociación</option>
                  <option value="closed-won">Cerrado ganado</option>
                  <option value="closed-lost">Cerrado perdido</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                >
                  <option value="1">🔴 Alta</option>
                  <option value="2">🟡 Media</option>
                  <option value="3">🟢 Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Score (0-100)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => handleChange('score', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {formData.score}/100
                </div>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DocumentTextIcon className="h-4 w-4 inline mr-2" />
                Notas
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                placeholder="Información adicional sobre el lead, conversaciones previas, intereses específicos..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-2" />
                  Último contacto
                </label>
                <input
                  type="date"
                  value={formData.lastContactedAt}
                  onChange={(e) => handleChange('lastContactedAt', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CalendarIcon className="h-4 w-4 inline mr-2" />
                  Próximo seguimiento
                </label>
                <input
                  type="date"
                  value={formData.nextFollowUpDate}
                  onChange={(e) => handleChange('nextFollowUpDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <TagIcon className="h-4 w-4 inline mr-2" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, _index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Agregar tag..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      addTag(input.value.trim());
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  onClick={(e) => {
                    const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                    addTag(input.value.trim());
                    input.value = '';
                  }}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'edit' ? 'Editar Lead' : 'Nuevo Lead'}
      size="xl"
    >
      {isSubmitting ? (
        <div className="p-8">
          <LoadingSystem 
            message={mode === 'edit' ? "Actualizando lead..." : "Creando nuevo lead..."} 
            size="md" 
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {renderTabContent()}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === 'edit' ? 'Actualizar Lead' : 'Crear Lead'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </Modal>
  );
} 