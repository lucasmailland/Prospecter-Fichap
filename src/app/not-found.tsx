'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Illustration from '@/components/ui/Illustration';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Ilustración */}
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Illustration name="empty-search" size="xl" className="opacity-60" />
            </motion.div>
          </div>

          {/* Contenido */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
                404
              </h1>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                Página no encontrada
              </h2>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed"
            >
              Lo sentimos, no pudimos encontrar la página que estás buscando. 
              Verifica la URL o regresa al dashboard.
            </motion.p>
          </div>

          {/* Acciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/"
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              <HomeIcon className="h-4 w-4" />
              <span>Ir al Dashboard</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Volver atrás</span>
            </button>
          </motion.div>

          {/* Links útiles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8 border-t border-gray-100 dark:border-gray-800"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Enlaces útiles:
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <Link 
                href="/leads" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Leads
              </Link>
              <Link 
                href="/analytics" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Analytics
              </Link>
              <Link 
                href="/settings" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Configuración
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 