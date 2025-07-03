'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSystem from '@/components/ui/LoadingSystem';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    const result = await resetPassword(email);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Error al enviar email de recuperación');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-6"
            >
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Email enviado!
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Te hemos enviado un enlace de recuperación a <span className="font-semibold">{email}</span>. 
              Revisa tu bandeja de entrada y sigue las instrucciones.
            </p>

            <div className="space-y-4">
              <Link
                href="/auth/signin"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200"
              >
                Volver al inicio de sesión
              </Link>
              
              <button
                onClick={() => setSuccess(false)}
                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium"
              >
                ¿No recibiste el email? Intentar de nuevo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver al inicio de sesión
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            No te preocupes, te ayudamos a recuperarla
          </p>
        </div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8"
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="tu@email.com"
                />
                <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSystem /> : 'Enviar enlace de recuperación'}
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start">
              <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  ¿Qué pasa después?
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                  <li>• Recibirás un email con un enlace seguro</li>
                  <li>• El enlace expira en 24 horas</li>
                  <li>• Podrás crear una nueva contraseña</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Sigues teniendo problemas?{' '}
              <a
                href="mailto:soporte@prospecter.com"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Contacta soporte
              </a>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
