'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Spinner } from '@heroui/react';
import Illustration from './Illustration';

// ========================================================================================
// TIPOS Y INTERFACES
// ========================================================================================

export type LoadingVariant = 
  | 'screen'      // Pantalla completa (inicialización)
  | 'page'        // Sección de página
  | 'inline'      // En línea con contenido
  | 'button'      // Dentro de botones
  | 'overlay'     // Overlay sobre contenido
  | 'minimal';    // Mínimo (solo spinner)

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  message?: string;
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  showMessage?: boolean;
  fullScreen?: boolean;
}

// ========================================================================================
// CONFIGURACIONES
// ========================================================================================

const sizeConfig = {
  xs: { spinner: 16, illustration: 'sm', padding: 'py-2', text: 'text-xs' },
  sm: { spinner: 20, illustration: 'sm', padding: 'py-4', text: 'text-sm' },
  md: { spinner: 24, illustration: 'md', padding: 'py-8', text: 'text-base' },
  lg: { spinner: 32, illustration: 'lg', padding: 'py-16', text: 'text-lg' },
  xl: { spinner: 40, illustration: 'lg', padding: 'py-24', text: 'text-xl' }
} as const;

const colorConfig = {
  primary: 'text-blue-500',
  secondary: 'text-gray-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  danger: 'text-red-500',
  default: 'text-gray-400'
} as const;

// ========================================================================================
// COMPONENTES DE LOADING
// ========================================================================================

/**
 * Spinner simple y rápido
 */
export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: Pick<LoadingProps, 'size' | 'color' | 'className'>) {
  return (
    <Spinner 
      size={size === 'xs' ? 'sm' : size === 'xl' ? 'lg' : size}
      color={color}
      className={className}
    />
  );
}

/**
 * Puntos animados para indicar carga
 */
export function LoadingDots({ 
  size = 'md', 
  color = 'primary',
  className = ''
}: Pick<LoadingProps, 'size' | 'color' | 'className'>) {
  const dotSize = size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const colorClass = colorConfig[color];

  return (
    <div className={`flex justify-center space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
          className={`${dotSize} ${colorClass} rounded-full`}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton loading para contenido
 */
export function LoadingSkeleton({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

// ========================================================================================
// COMPONENTE PRINCIPAL
// ========================================================================================

export default function LoadingSystem({
  variant = 'inline',
  size = 'md',
  message = 'Cargando...',
  className = '',
  color = 'primary',
  showMessage = true,
  fullScreen = false
}: LoadingProps) {
  const config = sizeConfig[size];

  // ========================================================================================
  // VARIANTE: PANTALLA COMPLETA
  // ========================================================================================
  if (variant === 'screen' || fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Logo o ilustración */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Mensaje */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4"
          >
            {message}
          </motion.h2>

          {/* Puntos animados */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <LoadingDots size={size} color={color} />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ========================================================================================
  // VARIANTE: OVERLAY
  // ========================================================================================
  if (variant === 'overlay') {
    return (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LoadingSpinner size={size} color={color} className="mb-4" />
          {showMessage && (
            <p className={`${config.text} text-gray-600 dark:text-gray-400 font-medium`}>
              {message}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // ========================================================================================
  // VARIANTE: PÁGINA/SECCIÓN
  // ========================================================================================
  if (variant === 'page') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`flex flex-col items-center justify-center ${config.padding} ${className}`}
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="mb-6"
        >
          <Illustration name="loading" size={config.illustration as any} className="opacity-80" />
        </motion.div>
        
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <p className={`${config.text} text-gray-600 dark:text-gray-400 font-medium mb-3`}>
              {message}
            </p>
            <LoadingDots size={size} color={color} />
          </motion.div>
        )}
      </motion.div>
    );
  }

  // ========================================================================================
  // VARIANTE: BOTÓN
  // ========================================================================================
  if (variant === 'button') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LoadingSpinner size={size} color="default" className="mr-2" />
        {showMessage && (
          <span className={`${config.text}`}>{message}</span>
        )}
      </div>
    );
  }

  // ========================================================================================
  // VARIANTE: MÍNIMAL
  // ========================================================================================
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <LoadingSpinner size={size} color={color} />
      </div>
    );
  }

  // ========================================================================================
  // VARIANTE: INLINE (DEFAULT)
  // ========================================================================================
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-center space-x-3 ${config.padding} ${className}`}
    >
      <LoadingSpinner size={size} color={color} />
      {showMessage && (
        <span className={`${config.text} text-gray-600 dark:text-gray-400 font-medium`}>
          {message}
        </span>
      )}
    </motion.div>
  );
}

// ========================================================================================
// HOOKS DE CONVENIENCIA
// ========================================================================================

/**
 * Hook para estados de loading simples
 */
export function useLoading(initialState = false) {
  const [loading, setLoading] = React.useState(initialState);
  
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const toggleLoading = () => setLoading(prev => !prev);
  
  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading
  };
}

/**
 * Hook para operaciones async con loading
 */
export function useAsyncLoading<T extends any[], R>(
  asyncFn: (...args: T) => Promise<R>
) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  const execute = async (...args: T): Promise<R | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn(...args);
      return result;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, error, execute };
} 