'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Select, 
  SelectItem, 
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@heroui/react';
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
  
  const { isOpen, onOpen, onClose } = useDisclosure();
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
// console.error('Error loading templates:', error);
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
    onOpen();
  };

  const openEditModal = (template: PromptTemplate) => {
    setEditingTemplate(template);
    onOpen();
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
        <CardBody className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Buscar prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              placeholder="Filtrar por categoría"
              selectedKeys={selectedCategory ? [selectedCategory] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedCategory(selected || '');
              }}
              className="md:w-64"
            >
              <SelectItem key="" value="">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Templates Table */}
          <Table>
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>CATEGORÍA</TableColumn>
              <TableColumn>VARIABLES</TableColumn>
              <TableColumn>PÚBLICO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{template.name}</p>
                      {template.description && (
                        <p className="text-sm text-gray-600">{template.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={getCategoryColor(template.category) as any}
                      variant="flat"
                      size="sm"
                    >
                      {categories.find(c => c.value === template.category)?.label}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {extractVariables(template.prompt).map((variable, index) => (
                        <Chip key={index} size="sm" variant="bordered">
                          {variable}
                        </Chip>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={template.isPublic ? 'success' : 'default'}
                      variant="flat"
                      size="sm"
                    >
                      {template.isPublic ? 'Público' : 'Privado'}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => openEditModal(template)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No se encontraron prompts</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create/Edit Modal */}
      <PromptModal
        isOpen={isOpen}
        onClose={onClose}
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
    } catch (error) {
// console.error('Error saving prompt:', error);
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
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          {template ? 'Editar Prompt' : 'Crear Nuevo Prompt'}
        </ModalHeader>
        <ModalBody className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Email de seguimiento comercial"
          />

          <Textarea
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe el propósito de este prompt"
            rows={2}
          />

          <Select
            label="Categoría"
            selectedKeys={[formData.category]}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              setFormData({ ...formData, category: selected });
            }}
          >
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </Select>

          <Textarea
            label="Prompt"
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            placeholder="Escribe tu prompt aquí. Usa {variable} para variables dinámicas"
            rows={8}
          />

          {variables.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Variables detectadas:</p>
              <div className="flex flex-wrap gap-2">
                {variables.map((variable, index) => (
                  <Chip key={index} size="sm" variant="bordered">
                    {variable}
                  </Chip>
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
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            color="primary" 
            onClick={handleSave}
            isLoading={isSaving}
          >
            {template ? 'Actualizar' : 'Crear'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
} 