'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Input, Button, Select, SelectItem, Divider } from '@heroui/react';
import LoadingSystem from '@/components/ui/LoadingSystem';
import { toast } from '@/components/ui/Toast';

const OPENAI_KEYS = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'OPENAI_TEMPERATURE',
  'OPENAI_MAX_TOKENS',
  'OPENAI_IS_ACTIVE',
];

export default function OpenAIConfig({ onConfigComplete }: { onConfigComplete?: () => void }) {
  const [config, setConfig] = useState({
    OPENAI_API_KEY: '',
    OPENAI_MODEL: 'gpt-4o',
    OPENAI_TEMPERATURE: 0.7,
    OPENAI_MAX_TOKENS: 1000,
    OPENAI_IS_ACTIVE: true,
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings/apis');
      const data = await res.json();
      if (data.success) {
        const configMap: any = {};
        data.configs.forEach((c: any) => { 
          configMap[c.key] = c.value; 
          // Guardar información adicional para campos encriptados
          if (c.isEncrypted) {
            configMap[`${c.key}_hasValue`] = c.hasValue;
          }
        });
        setConfig(configMap);
        setIsConfigured(true);
      }
    } catch (error) {
// console.error('Error fetching config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = OPENAI_KEYS.map(key => ({ 
        key, 
        value: config[key] || '',
        isEncrypted: key === 'OPENAI_API_KEY'
      })).filter(update => {
        // Para campos encriptados, solo actualizar si el usuario escribió algo
        if (update.isEncrypted && !update.value && config[`${update.key}_hasValue`]) {
          return false; // No sobreescribir clave existente si el input está vacío
        }
        return true;
      });

      const res = await fetch('/api/settings/apis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (res.ok) {
        toast.success('Configuración guardada correctamente');
        fetchConfig();
        if (onConfigComplete) onConfigComplete();
      } else {
        toast.error('Error al guardar la configuración');
      }
    } catch (error) {
// console.error('Error saving config:', error);
      toast.error('Error de conexión');
    } finally {
      setIsSaving(false);
    }
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
              <h3 className="text-lg font-semibold">Configuración de OpenAI</h3>
              <p className="text-sm text-gray-600">
                Configura tu API Key de OpenAI para habilitar todas las funcionalidades de IA
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Estado:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isConfigured ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConfigured ? 'Configurado' : 'No configurado'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="API Key de OpenAI"
            placeholder={
              config.OPENAI_API_KEY_hasValue 
                ? "API Key configurada (oculta por seguridad)" 
                : "sk-..."
            }
            value={config.OPENAI_API_KEY}
            onChange={(e) => setConfig({ ...config, OPENAI_API_KEY: e.target.value })}
            type="password"
            description={
              config.OPENAI_API_KEY_hasValue 
                ? "Deja vacío para mantener la clave actual" 
                : "Tu API Key será encriptada y almacenada de forma segura"
            }
          />

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Modelo"
              value={config.OPENAI_MODEL}
              onChange={(e) => setConfig({ ...config, OPENAI_MODEL: e.target.value })}
              placeholder="Ej: gpt-4o"
            />
            <Input
              label="Máximo de Tokens"
              type="number"
              value={config.OPENAI_MAX_TOKENS}
              onChange={(e) => setConfig({ ...config, OPENAI_MAX_TOKENS: e.target.value })}
              min={100}
              max={4000}
              description="Límite de tokens por respuesta"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Temperatura</p>
              <p className="text-sm text-gray-600">
                Controla la creatividad (0 = más preciso, 1 = más creativo)
              </p>
            </div>
            <div className="w-32">
              <Input
                type="number"
                value={config.OPENAI_TEMPERATURE}
                onChange={(e) => setConfig({ ...config, OPENAI_TEMPERATURE: e.target.value })}
                min={0}
                max={1}
                step={0.1}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={!!config.OPENAI_IS_ACTIVE && config.OPENAI_IS_ACTIVE !== 'false'}
              onChange={e => setConfig({ ...config, OPENAI_IS_ACTIVE: e.target.checked ? 'true' : 'false' })}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <label className="text-sm">Activo</label>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              color="primary"
              onClick={handleSave}
              isLoading={isSaving}
            >
              Guardar Configuración
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 