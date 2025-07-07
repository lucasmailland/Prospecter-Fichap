'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from './Navbar';
import LoadingSystem from '@/components/ui/LoadingSystem';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // ✅ ARREGLO: useEffect debe ir ANTES de cualquier return
  useEffect(() => {
    if (!isLoading && !user && !pathname?.startsWith('/auth')) {
      router.push('/auth/signin');
    }
  }, [user, isLoading, pathname, router]);

  // Si está cargando la autenticación
  if (isLoading) {
    return <LoadingSystem variant="page" message="Iniciando Prospecter..." size="lg" />;
  }

  // Para páginas de auth, mostrar sin layout
  if (pathname?.startsWith('/auth')) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Si no hay usuario, mostrar loading mientras redirige
  if (!user) {
    return <LoadingSystem variant="page" message="Redirigiendo al login..." size="lg" />;
  }

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Prospecter
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : ''}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center mb-3">
            <img 
              src={user.image} 
              alt={user.name || 'User'}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header/Navbar Completo */}
        <Navbar 
          user={user} 
          logout={logout}
          currentPath={pathname || '/'}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
