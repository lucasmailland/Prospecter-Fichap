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
  Divider,
  Chip,
  Tabs,
  Tab
} from '@heroui/react';
import LoadingSystem from '@/components/ui/LoadingSystem';
import { toast } from '@/components/ui/Toast';

interface Lead {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
}

interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  prompt: string;
  variables: Record<string, any>;
}

const generationTypes = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'MESSAGE', label: 'Mensaje' },
  { value: 'PROPOSAL', label: 'Propuesta' },
  { value: 'FOLLOW_UP', label: 'Seguimiento' },
  { value: 'ANALYSIS', label: 'Análisis' },
  { value: 'SUMMARY', label: 'Resumen' }
];

export default function ContentGenerator() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generationType, setGenerationType] = useState<string>('EMAIL');
  const [customPrompt, setCustomPrompt] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState('template');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [generationType]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        updateVariablesFromTemplate(template);
      }
    }
  }, [selectedTemplate, selectedLead]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load leads
      const leadsResponse = await fetch('/api/prospects');
      const leadsData = await leadsResponse.json();
      if (leadsData.success) {
        setLeads(leadsData.data);
      }

      // Load templates
      await loadTemplates();
    } catch (error) {
      console.error('Error loading data:', error);
      setToast({ message: 'Error al cargar datos', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch(`/api/ai/prompts?category=${generationType}`);
      const data = await response.json();
      
      if (data.success) {
        setTemplates(data.data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const updateVariablesFromTemplate = (template: PromptTemplate) => {
    const templateVariables = extractVariables(template.prompt);
    const newVariables: Record<string, string> = {};
    
    // Auto-fill variables from selected lead
    const lead = leads.find(l => l.id === selectedLead);
    if (lead) {
      templateVariables.forEach(variable => {
        switch (variable.toLowerCase()) {
          case 'firstname':
          case 'nombre':
            newVariables[variable] = lead.firstName || '';
            break;
          case 'lastname':
          case 'apellido':
            newVariables[variable] = lead.lastName || '';
            break;
          case 'fullname':
          case 'nombrecompleto':
            newVariables[variable] = lead.fullName || `${lead.firstName} ${lead.lastName}`;
            break;
          case 'email':
            newVariables[variable] = lead.email;
            break;
          case 'company':
          case 'empresa':
            newVariables[variable] = lead.company || '';
            break;
          case 'jobtitle':
          case 'cargo':
            newVariables[variable] = lead.jobTitle || '';
            break;
          case 'industry':
          case 'industria':
            newVariables[variable] = lead.industry || '';
            break;
          default:
            newVariables[variable] = '';
        }
      });
    } else {
      templateVariables.forEach(variable => {
        newVariables[variable] = '';
      });
    }
    
    setVariables(newVariables);
  };

  const extractVariables = (prompt: string): string[] => {
    const matches = prompt.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const generateContent = async () => {
    const isUsingTemplate = activeTab === 'template' && selectedTemplate;
    const prompt = activeTab === 'custom' ? customPrompt : '';
    
    if (!isUsingTemplate && !prompt) {
      setToast({ message: 'Selecciona un template o escribe un prompt personalizado', type: 'error' });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: generationType,
          input: prompt || 'Generar contenido usando el template seleccionado',
          leadId: selectedLead || undefined,
          promptTemplateId: isUsingTemplate ? selectedTemplate : undefined,
          customPrompt: prompt || undefined,
          variables: variables
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.data.content);
        setToast({ 
          message: `Contenido generado exitosamente. Tokens: ${data.data.tokensUsed}, Costo: $${data.data.cost.toFixed(4)}`, 
          type: 'success' 
        });
      } else {
        setToast({ message: data.error || 'Error al generar contenido', type: 'error' });
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setToast({ message: 'Error al generar contenido', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setToast({ message: 'Contenido copiado al portapapeles', type: 'success' });
  };

  if (isLoading) {
    return <LoadingSystem variant="page" />;
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
  const templateVariables = selectedTemplateData ? extractVariables(selectedTemplateData.prompt) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div>
            <h3 className="text-lg font-semibold">Generador de Contenido IA</h3>
            <p className="text-sm text-gray-600">
              Genera contenido personalizado usando IA para tus leads
            </p>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Tipo de contenido"
              selectedKeys={[generationType]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setGenerationType(selected);
                setSelectedTemplate('');
              }}
            >
              {generationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Lead (opcional)"
              placeholder="Selecciona un lead"
              selectedKeys={selectedLead ? [selectedLead] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedLead(selected || '');
              }}
            >
              {leads.map((lead) => (
                <SelectItem key={lead.id} value={lead.id}>
                  {lead.fullName} - {lead.company}
                </SelectItem>
              ))}
            </Select>

            <div className="flex items-end">
              <Button 
                color="primary" 
                onClick={generateContent}
                isLoading={isGenerating}
                className="w-full"
              >
                Generar Contenido
              </Button>
            </div>
          </div>

          <Divider />

          {/* Prompt Selection */}
          <Tabs 
            selectedKey={activeTab} 
            onSelectionChange={(key) => setActiveTab(key as string)}
          >
            <Tab key="template" title="Usar Template">
              <div className="space-y-4 pt-4">
                <Select
                  label="Template"
                  placeholder="Selecciona un template"
                  selectedKeys={selectedTemplate ? [selectedTemplate] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedTemplate(selected || '');
                  }}
                >
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </Select>

                {selectedTemplateData && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Preview del Template:</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedTemplateData.prompt}
                    </p>
                  </div>
                )}

                {/* Variables */}
                {templateVariables.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Variables del Template:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {templateVariables.map((variable) => (
                        <Input
                          key={variable}
                          label={variable}
                          value={variables[variable] || ''}
                          onChange={(e) => setVariables({
                            ...variables,
                            [variable]: e.target.value
                          })}
                          placeholder={`Valor para {${variable}}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Tab>

            <Tab key="custom" title="Prompt Personalizado">
              <div className="pt-4">
                <Textarea
                  label="Prompt personalizado"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Escribe tu prompt personalizado aquí..."
                  rows={6}
                  description="Describe exactamente qué tipo de contenido quieres generar"
                />
              </div>
            </Tab>
          </Tabs>

          {/* Generated Content */}
          {generatedContent && (
            <>
              <Divider />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Contenido Generado:</h4>
                  <Button size="sm" variant="bordered" onClick={copyToClipboard}>
                    Copiar
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {generatedContent}
                  </pre>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 