import { useEffect, useState } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { KeyIcon, SparklesIcon, GlobeAltIcon, ChartBarIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const API_TABS = [
  { id: 'openai', name: 'OpenAI', icon: SparklesIcon },
  { id: 'hubspot', name: 'HubSpot', icon: GlobeAltIcon },
  { id: 'clearbit', name: 'Clearbit', icon: ChartBarIcon },
  { id: 'hunterio', name: 'Hunter.io', icon: EnvelopeIcon },
  { id: 'mailboxlayer', name: 'MailboxLayer', icon: KeyIcon },
];

const API_FIELDS = {
  openai: [
    { key: 'OPENAI_API_KEY', label: 'API Key', type: 'password', help: 'Clave secreta de OpenAI (sk-...)', required: true },
    { key: 'OPENAI_MODEL', label: 'Modelo', type: 'text', help: 'Ej: gpt-4o', required: true },
    { key: 'OPENAI_TEMPERATURE', label: 'Temperatura', type: 'number', help: 'Creatividad (0-1)', required: true },
    { key: 'OPENAI_MAX_TOKENS', label: 'Máx. Tokens', type: 'number', help: 'Límite de tokens por respuesta', required: true },
    { key: 'OPENAI_IS_ACTIVE', label: 'Activo', type: 'checkbox', help: 'Habilitar integración', required: false },
  ],
  hubspot: [
    { key: 'HUBSPOT_API_KEY', label: 'API Key', type: 'password', help: 'Token privado de HubSpot', required: true },
    { key: 'HUBSPOT_ENV', label: 'Ambiente', type: 'text', help: 'production, sandbox, etc.', required: true },
    { key: 'HUBSPOT_ACCOUNT_NAME', label: 'Nombre de cuenta', type: 'text', help: 'Identificador de la cuenta', required: false },
  ],
  clearbit: [
    { key: 'CLEARBIT_API_KEY', label: 'API Key', type: 'password', help: 'Clave de Clearbit', required: true },
    { key: 'CLEARBIT_NAME', label: 'Nombre', type: 'text', help: 'Nombre de integración', required: false },
  ],
  hunterio: [
    { key: 'HUNTERIO_API_KEY', label: 'API Key', type: 'password', help: 'Clave de Hunter.io', required: true },
    { key: 'HUNTERIO_NAME', label: 'Nombre', type: 'text', help: 'Nombre de integración', required: false },
  ],
  mailboxlayer: [
    { key: 'MAILBOXLAYER_API_KEY', label: 'API Key', type: 'password', help: 'Clave de MailboxLayer', required: true },
    { key: 'MAILBOXLAYER_NAME', label: 'Nombre', type: 'text', help: 'Nombre de integración', required: false },
  ],
};

export default function ApiSettingsTabs({ isAdmin }: { isAdmin: boolean }) {
  const [activeTab, setActiveTab] = useState('openai');
  const [configs, setConfigs] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  // const _fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/settings/apis');
      
      if (res.status === 401) {
        setError('No tienes permisos para acceder a esta configuración. Solo los administradores pueden ver y editar las APIs.');
        return;
      }
      
      if (res.status === 403) {
        setError('Acceso denegado. Se requieren permisos de administrador.');
        return;
      }
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      if (data.success) {
        const map: unknown = {};
        data.configs.forEach((c: unknown) => { 
          map[c.key] = c.value; 
          // Guardar información adicional para campos encriptados
          if (c.isEncrypted) {
            map[`${c.key}_hasValue`] = c.hasValue;
          }
        });
        setConfigs(map);
      } else {
        setError(data.error || 'Error al cargar configuración');
      }
    } catch (e) {
console.warn('Error fetching configs:', e);
      setError('Error de conexión. Verifica que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  // const _handleChange = (key: string, value: unknown) => {
    setConfigs((prev: unknown) => ({ ...prev, [key]: value }));
  };

  // const _handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const fields = API_FIELDS[activeTab as keyof typeof API_FIELDS];
      const updates = fields
        .map(f => ({ 
          key: f.key, 
          value: configs[f.key] || '',
          isEncrypted: f.type === 'password'
        }))
        .filter(update => {
          // Para campos encriptados, solo actualizar si el usuario escribió algo
          if (update.isEncrypted && !update.value && configs[`${update.key}_hasValue`]) {
            return false; // No sobreescribir clave existente si el input está vacío
          }
          return true;
        });
      
      const res = await fetch('/api/settings/apis', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Configuración guardada correctamente');
        fetchConfigs();
      } else {
        setError(data.error || 'Error al guardar');
      }
    } catch (e) {
      setError('Error de red');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)} className="mb-6">
        {API_TABS.map(tab => (
          <Tab key={tab.id} title={<span className="flex items-center"><tab.icon className="w-5 h-5 mr-2" />{tab.name}</span>} />
        ))}
      </Tabs>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
        {loading ? (
          <div className="text-center text-gray-500">Cargando configuración...</div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="space-y-6">
            {API_FIELDS[activeTab as keyof typeof API_FIELDS].map(field => (
              <div key={field.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={!!configs[field.key] && configs[field.key] !== 'false'}
                    onChange={e => handleChange(field.key, e.target.checked ? 'true' : 'false')}
                    className="w-5 h-5 text-blue-600 rounded"
                    disabled={!isAdmin}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={configs[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={
                      field.type === 'password' && configs[`${field.key}_hasValue`]
                        ? 'API Key configurada (oculta por seguridad)'
                        : field.help
                    }
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={!isAdmin}
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {field.type === 'password' && configs[`${field.key}_hasValue`]
                    ? 'Deja vacío para mantener la clave actual'
                    : field.help
                  }
                </p>
              </div>
            ))}
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            {isAdmin && (
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            )}
            {!isAdmin && <div className="text-gray-400 text-sm">Solo los administradores pueden editar la configuración de APIs.</div>}
          </form>
        )}
      </div>
    </div>
  );
} 