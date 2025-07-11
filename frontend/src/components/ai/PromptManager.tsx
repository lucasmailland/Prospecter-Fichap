'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSystem from '@/components/ui/LoadingSystem';
import { toast } from '@/components/ui/Toast';

interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  prompt: string;
  variables: Record<string, any>;
  isPublic: boolean;
  isActive: boolean;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

const categories = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'ANALYSIS', label: 'Análisis' },
  { value: 'FOLLOW_UP', label: 'Seguimiento' },
  { value: 'PROPOSAL', label: 'Propuesta' },
  { value: 'OBJECTION_HANDLING', label: 'Manejo de Objeciones' },
  { value: 'RESEARCH', label: 'Investigación' },
  { value: 'CUSTOM', label: 'Personalizado' }
];

export default function PromptManager() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<PromptTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedCategory, searchQuery]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/prompts');
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
        console.warn('Error loading templates:', error);
      setToast({ message: 'Error al cargar templates', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;
    
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredTemplates(filtered);
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const extractVariables = (prompt: string): string[] => {
    const matches = prompt.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      EMAIL: 'primary',
      LINKEDIN: 'secondary',
      WHATSAPP: 'success',
      ANALYSIS: 'warning',
      FOLLOW_UP: 'danger',
      PROPOSAL: 'default',
      OBJECTION_HANDLING: 'primary',
      RESEARCH: 'secondary',
      CUSTOM: 'default'
    };
    return colors[category] || 'default';
  };

  if (isLoading) {
    return <LoadingSystem variant="page" />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center w-full">
            <div>
              <h3 className="text-lg font-semibold">Gestión de Prompts</h3>
              <p className="text-sm text-gray-600">
                Crea y gestiona templates de prompts para diferentes tipos de contenido
              </p>
            </div>
            <Button color="primary" onClick={openCreateModal}>
              Crear Prompt
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Templates Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">NOMBRE</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">CATEGORÍA</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">VARIABLES</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">PÚBLICO</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.map((template) => (
                  <tr key={template.id}>
                    <td className="border border-gray-200 px-4 py-2">
                      <div>
                        <p className="font-medium">{template.name}</p>
                        {template.description && (
                          <p className="text-sm text-gray-600">{template.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {categories.find(c => c.value === template.category)?.label}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex flex-wrap gap-1">
                        {extractVariables(template.prompt).map((variable, index) => (
                          <span key={index} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <span className={`inline-block px-2 py-1 rounded text-sm ${
                        template.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.isPublic ? 'Público' : 'Privado'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <Button
                        onClick={() => openEditModal(template)}
                        className="text-sm"
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron prompts</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={editingTemplate}
        onSave={loadTemplates}
        onToast={setToast}
      />

            {toast && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {toast.message}
        </div>
      )}
    </div>
  );
} 

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: PromptTemplate | null;
  onSave: () => void;
  onToast: (toast: { message: string; type: 'success' | 'error' }) => void;
}

function PromptModal({ isOpen, onClose, template, onSave, onToast }: PromptModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'EMAIL',
    prompt: '',
    isPublic: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        category: template.category,
        prompt: template.prompt,
        isPublic: template.isPublic
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'EMAIL',
        prompt: '',
        isPublic: false
      });
    }
  }, [template]);

  const handleSave = async () => {
    if (!formData.name || !formData.prompt) {
      onToast({ message: 'Nombre y prompt son requeridos', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/ai/prompts', {
        method: template ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: template?.id
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        onToast({ 
          message: template ? 'Prompt actualizado' : 'Prompt creado exitosamente', 
          type: 'success' 
        });
        onSave();
        onClose();
      } else {
        onToast({ message: data.error || 'Error al guardar prompt', type: 'error' });
      }
    } catch (_error) {
      console.warn('Error saving prompt:', _error);
      onToast({ message: 'Error al guardar prompt', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const extractVariables = (prompt: string): string[] => {
    const matches = prompt.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const variables = extractVariables(formData.prompt);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={template ? 'Editar Prompt' : 'Crear Nuevo Prompt'}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">
          {template ? 'Editar Prompt' : 'Crear Nuevo Prompt'}
        </h2>
        <div className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Email de seguimiento comercial"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe el propósito de este prompt"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
            <textarea
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="Escribe tu prompt aquí. Usa {variable} para variables dinámicas"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {variables.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Variables detectadas:</p>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable, index) => (
                  <span key={index} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">
                    {variable}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            />
            <label htmlFor="isPublic" className="text-sm">
              Hacer público (otros usuarios podrán usar este prompt)
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            loading={isSaving}
            className="bg-blue-600 text-white"
          >
            {template ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </div>
    </Modal>
  );
} 