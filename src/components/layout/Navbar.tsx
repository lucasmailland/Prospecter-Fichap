'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useClickOutside } from '@/hooks/common/useClickOutside';
import { User } from '@/types/common.types';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';
import {
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface NavbarProps {
  user: User;
  logout: () => void;
  currentPath: string;
}

export default function Navbar({ user, logout }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Usar hook centralizado para click outside
  const userMenuRef = useClickOutside<HTMLDivElement>(() => setShowUserMenu(false), showUserMenu);



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Buscar:', searchQuery);
      // Aquí implementarías la lógica de búsqueda
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="px-6 py-4">
        {/* Navbar compacto */}
        <div className="flex items-center justify-between">
          {/* Espacio izquierdo */}
          <div className="flex-1"></div>
          
          {/* Barra de búsqueda centrada */}
          <div className="flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar leads, empresas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </form>
          </div>

          {/* Controles de la derecha */}
          <div className="flex items-center space-x-2 flex-1 justify-end">
            {/* Notificaciones */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <BellIcon className="w-5 h-5" />
              {MOCK_NOTIFICATIONS.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {MOCK_NOTIFICATIONS.count}
                </span>
              )}
            </button>

            {/* Toggle tema */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {theme === 'dark' ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            {/* Menú de usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  
                  <button className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <UserCircleIcon className="w-4 h-4 mr-3" />
                    Ver Perfil
                  </button>
                  
                  <button className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Cog6ToothIcon className="w-4 h-4 mr-3" />
                    Configuración
                  </button>
                  
                  <button className="w-full flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <QuestionMarkCircleIcon className="w-4 h-4 mr-3" />
                    Ayuda
                  </button>
                  
                  <div className="border-t border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}