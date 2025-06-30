'use client';

import Layout from '@/components/layout/Layout';
import Illustration from '@/components/ui/Illustration';
import { designSystem } from '@/styles/design-system';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  UserIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      companyName: 'TechCorp Inc.',
      timezone: 'America/New_York',
      language: 'es',
      autoSave: true,
    },
    apis: {
      clearbit: { key: 'ck_live_1234567890abcdef', enabled: true, status: 'active' },
      hunter: { key: 'hunter_1234567890abcdef', enabled: true, status: 'active' },
      mailboxlayer: { key: 'ml_1234567890abcdef', enabled: false, status: 'inactive' },
    },
    notifications: {
      emailAlerts: true,
      enrichmentComplete: true,
      dailyReports: false,
      weeklyReports: true,
    },
    team: [
      { id: 1, name: 'John Doe', email: 'john@techcorp.com', role: 'Admin', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@techcorp.com', role: 'User', status: 'active' },
      { id: 3, name: 'Mike Johnson', email: 'mike@techcorp.com', role: 'User', status: 'pending' },
    ]
  });

  const tabs = [
    { key: 'general', label: 'General', icon: <CogIcon className="h-4 w-4" /> },
    { key: 'apis', label: 'APIs', icon: <KeyIcon className="h-4 w-4" /> },
    { key: 'notifications', label: 'Notificaciones', icon: <BellIcon className="h-4 w-4" /> },
    { key: 'team', label: 'Equipo', icon: <UserIcon className="h-4 w-4" /> },
    { key: 'security', label: 'Seguridad', icon: <ShieldCheckIcon className="h-4 w-4" /> },
  ];

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      'active': designSystem.colors.success,
      'inactive': designSystem.colors.neutral,
      'pending': designSystem.colors.warning,
      'error': designSystem.colors.danger,
    };
    return statusMap[status as keyof typeof statusMap] || designSystem.colors.neutral;
  };

  const getRoleColor = (role: string) => {
    const roleMap = {
      'Admin': designSystem.colors.info,
      'User': designSystem.colors.neutral,
    };
    return roleMap[role as keyof typeof roleMap] || designSystem.colors.neutral;
  };

  return (
    <Layout>
      <div className={designSystem.spacing.section}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-gray-100 dark:border-gray-800 pb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className={designSystem.typography.h1}>Configuración</h1>
                <p className={`${designSystem.typography.body} mt-2`}>
                  Gestiona tu cuenta, APIs y preferencias del sistema
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Illustration name="settings" size="md" className="opacity-40" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className={`${designSystem.card.base} ${designSystem.spacing.card}`}>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.key
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className={`${designSystem.card.base} ${designSystem.spacing.card}`}>
                <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
                  <h3 className={designSystem.typography.h2}>Configuración General</h3>
                  <p className={`${designSystem.typography.body} mt-1`}>Ajustes básicos de tu cuenta</p>
                </div>
                <div className={`${designSystem.spacing.cardContent} ${designSystem.spacing.section}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block ${designSystem.typography.caption} mb-2`}>
                        Nombre de la empresa
                      </label>
                      <input
                        type="text"
                        value={settings.general.companyName}
                        onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                        className={designSystem.input.base}
                      />
                    </div>
                    <div>
                      <label className={`block ${designSystem.typography.caption} mb-2`}>
                        Zona horaria
                      </label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                        className={designSystem.input.base}
                      >
                        <option value="America/New_York">New York (UTC-5)</option>
                        <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
                        <option value="Europe/Madrid">Madrid (UTC+1)</option>
                        <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block ${designSystem.typography.caption} mb-2`}>
                        Idioma
                      </label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                        className={designSystem.input.base}
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    <div>
                      <label className={`flex items-center space-x-3 cursor-pointer`}>
                        <input
                          type="checkbox"
                          checked={settings.general.autoSave}
                          onChange={(e) => handleSettingChange('general', 'autoSave', e.target.checked)}
                          className="rounded border-gray-300 dark:border-gray-600 text-gray-600 focus:ring-gray-500"
                        />
                        <div>
                          <div className={designSystem.typography.h3}>Guardado automático</div>
                          <div className={designSystem.typography.caption}>
                            Guarda cambios automáticamente
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className={designSystem.button.primary}>
                      Guardar cambios
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Settings */}
            {activeTab === 'apis' && (
              <div className={`${designSystem.card.base} ${designSystem.spacing.card}`}>
                <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
                  <h3 className={designSystem.typography.h2}>Configuración de APIs</h3>
                  <p className={`${designSystem.typography.body} mt-1`}>Gestiona tus conexiones de API</p>
                </div>
                <div className={`${designSystem.spacing.cardContent} ${designSystem.spacing.section}`}>
                  {Object.entries(settings.apis).map(([provider, config]) => (
                    <div key={provider} className={`${designSystem.card.base} ${designSystem.card.hover} ${designSystem.spacing.card}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${getStatusColor(config.status).bg} flex items-center justify-center`}>
                            <KeyIcon className={`h-5 w-5 ${getStatusColor(config.status).icon}`} />
                          </div>
                          <div>
                            <h4 className={`${designSystem.typography.h3} capitalize`}>{provider}</h4>
                            <p className={designSystem.typography.caption}>
                              {config.status === 'active' ? 'Conectado y funcionando' : 'Desconectado'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(config.status).bg} ${getStatusColor(config.status).text}`}>
                            {config.status}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.enabled}
                              onChange={(e) => {
                                const newApis = { ...settings.apis };
                                (newApis as any)[provider].enabled = e.target.checked;
                                setSettings(prev => ({ ...prev, apis: newApis }));
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
                          </label>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className={`block ${designSystem.typography.caption} mb-2`}>
                            API Key
                          </label>
                          <div className="relative">
                            <input
                              type={showApiKey ? 'text' : 'password'}
                              value={config.key}
                              onChange={(e) => {
                                const newApis = { ...settings.apis };
                                (newApis as any)[provider].key = e.target.value;
                                setSettings(prev => ({ ...prev, apis: newApis }));
                              }}
                              className={`${designSystem.input.base} pr-10`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              {showApiKey ? (
                                <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                              ) : (
                                <EyeIcon className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button className={designSystem.button.secondary}>
                            Probar conexión
                          </button>
                          <button className={designSystem.button.primary}>
                            Guardar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className={`${designSystem.card.base} ${designSystem.spacing.card}`}>
                <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
                  <h3 className={designSystem.typography.h2}>Notificaciones</h3>
                  <p className={`${designSystem.typography.body} mt-1`}>Controla qué notificaciones recibes</p>
                </div>
                <div className={`${designSystem.spacing.cardContent} ${designSystem.spacing.item}`}>
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div>
                        <div className={designSystem.typography.h3}>
                          {key === 'emailAlerts' && 'Alertas por email'}
                          {key === 'enrichmentComplete' && 'Enriquecimiento completado'}
                          {key === 'dailyReports' && 'Reportes diarios'}
                          {key === 'weeklyReports' && 'Reportes semanales'}
                        </div>
                        <div className={designSystem.typography.caption}>
                          {key === 'emailAlerts' && 'Recibe alertas importantes por correo'}
                          {key === 'enrichmentComplete' && 'Notificación cuando se complete el enriquecimiento'}
                          {key === 'dailyReports' && 'Resumen diario de actividad'}
                          {key === 'weeklyReports' && 'Resumen semanal de rendimiento'}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Management */}
            {activeTab === 'team' && (
              <div className={`${designSystem.card.base} ${designSystem.spacing.card}`}>
                <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={designSystem.typography.h2}>Gestión de Equipo</h3>
                      <p className={`${designSystem.typography.body} mt-1`}>Administra usuarios y permisos</p>
                    </div>
                    <button className={`${designSystem.button.primary} flex items-center space-x-2`}>
                      <UserIcon className="h-4 w-4" />
                      <span>Invitar usuario</span>
                    </button>
                  </div>
                </div>
                <div className={designSystem.spacing.cardContent}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-100 dark:border-gray-700">
                        <tr>
                          <th className={`text-left py-3 ${designSystem.typography.caption} uppercase tracking-wider`}>
                            Usuario
                          </th>
                          <th className={`text-left py-3 ${designSystem.typography.caption} uppercase tracking-wider`}>
                            Rol
                          </th>
                          <th className={`text-left py-3 ${designSystem.typography.caption} uppercase tracking-wider`}>
                            Estado
                          </th>
                          <th className="w-20 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {settings.team.map((member) => (
                          <tr key={member.id} className={designSystem.card.interactive}>
                            <td className="py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                  <span className={designSystem.typography.caption}>
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <div className={designSystem.typography.h3}>{member.name}</div>
                                  <div className={designSystem.typography.caption}>{member.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(member.role).bg} ${getRoleColor(member.role).text}`}>
                                {member.role}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.status).bg} ${getStatusColor(member.status).text}`}>
                                {member.status}
                              </span>
                            </td>
                            <td className="py-4">
                              <button className={designSystem.button.ghost}>
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className={`${designSystem.card.base} ${designSystem.spacing.card}`}>
                <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
                  <h3 className={designSystem.typography.h2}>Seguridad</h3>
                  <p className={`${designSystem.typography.body} mt-1`}>Configuración de seguridad y acceso</p>
                </div>
                <div className={`${designSystem.spacing.cardContent} ${designSystem.spacing.section}`}>
                  <div className={`${designSystem.card.base} ${designSystem.card.hover} ${designSystem.spacing.card} ${designSystem.colors.success.bg} ${designSystem.colors.success.border}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 ${designSystem.colors.success.bg} rounded-lg`}>
                        <CheckIcon className={`h-5 w-5 ${designSystem.colors.success.icon}`} />
                      </div>
                      <div>
                        <h4 className={`${designSystem.typography.h3} ${designSystem.colors.success.text} mb-2`}>
                          Autenticación de dos factores habilitada
                        </h4>
                        <p className={`${designSystem.typography.body} ${designSystem.colors.success.text} mb-3`}>
                          Tu cuenta está protegida con 2FA. Excelente trabajo manteniendo tu cuenta segura.
                        </p>
                        <button className={`text-xs font-medium ${designSystem.colors.success.text} hover:opacity-80 transition-opacity`}>
                          Gestionar 2FA →
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className={designSystem.typography.h3}>Cambiar contraseña</h4>
                      <p className={`${designSystem.typography.body} mb-4`}>
                        Actualiza tu contraseña regularmente para mantener tu cuenta segura
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block ${designSystem.typography.caption} mb-2`}>
                            Contraseña actual
                          </label>
                          <input
                            type="password"
                            className={designSystem.input.base}
                            placeholder="Ingresa tu contraseña actual"
                          />
                        </div>
                        <div>
                          <label className={`block ${designSystem.typography.caption} mb-2`}>
                            Nueva contraseña
                          </label>
                          <input
                            type="password"
                            className={designSystem.input.base}
                            placeholder="Ingresa tu nueva contraseña"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <button className={designSystem.button.primary}>
                          Actualizar contraseña
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className={designSystem.typography.h3}>Sesiones activas</h4>
                      <p className={`${designSystem.typography.body} mb-4`}>
                        Revisa y gestiona tus sesiones activas
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className={designSystem.typography.h3}>Chrome en MacOS</div>
                              <div className={designSystem.typography.caption}>
                                192.168.1.1 • Activa ahora
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${designSystem.colors.success.bg} ${designSystem.colors.success.text}`}>
                            Actual
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className={designSystem.typography.h3}>Firefox en Windows</div>
                              <div className={designSystem.typography.caption}>
                                192.168.1.5 • Hace 2 horas
                              </div>
                            </div>
                          </div>
                          <button className={designSystem.button.ghost}>
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 