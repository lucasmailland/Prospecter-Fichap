'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import TeamManagement from '@/components/settings/TeamManagement';
import ApiSettingsTabs from '@/components/settings/ApiSettingsTabs';
import { UserRole } from '@/types/common.types';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  KeyIcon,
  GlobeAltIcon,
  ChartBarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const tabs = [
  { id: 'profile', name: 'Perfil', icon: UserIcon },
  { id: 'apis', name: 'APIs', icon: KeyIcon },
  { id: 'notifications', name: 'Notificaciones', icon: BellIcon },
  { id: 'security', name: 'Seguridad', icon: ShieldCheckIcon },
  { id: 'team', name: 'Equipo', icon: UsersIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Cargando configuración...</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Información Personal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name || ''}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email || ''}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    defaultValue="Prospecter Inc."
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cargo
                  </label>
                  <input
                    type="text"
                    defaultValue={user.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Guardar Cambios
              </button>
            </div>
          </div>
        );
      
      case 'apis':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configuración de APIs
              </h3>
              <ApiSettingsTabs isAdmin={user.role === 'ADMIN'} />
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Preferencias de Notificaciones
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Nuevos leads</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recibir notificación cuando se agregue un nuevo lead
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Enriquecimiento completado</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Notificar cuando se complete el enriquecimiento de datos
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Reportes semanales</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Recibir resumen semanal de actividad
                    </p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Configuración de Seguridad
              </h3>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Cambiar Contraseña
                  </h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Contraseña actual"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="password"
                      placeholder="Nueva contraseña"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="password"
                      placeholder="Confirmar nueva contraseña"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Actualizar Contraseña
                  </button>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Autenticación de Dos Factores
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Añade una capa extra de seguridad a tu cuenta
                  </p>
                  <button 
                    onClick={() => window.location.href = '/settings/security'}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    Configurar 2FA
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'team':
        return <TeamManagement />;
      
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Sección en desarrollo...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Configuración
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Gestiona tu cuenta y las preferencias de la aplicación
        </p>
      </div>

      {/* Settings Content */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-100 dark:border-gray-700">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 