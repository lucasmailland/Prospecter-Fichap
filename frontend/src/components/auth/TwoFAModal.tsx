'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { commonClasses } from '@/styles/design-system';
import { cn } from '@/utils/sanitizer';
import LoadingSystem from '@/components/ui/LoadingSystem';

interface TwoFAModalProps {
  isOpen: boolean;
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TwoFAModal({ isOpen, email, onSuccess, onCancel }: TwoFAModalProps) {
  const { verify2FA } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isBackupCode, setIsBackupCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await verify2FA(email, code.trim());
      if (result.success) {
        onSuccess();
        setCode('');
        setError('');
      } else {
        setError(result.error || 'Código inválido');
      }
    } catch (_error) {
      setError('Error verificando código');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Solo permitir números para códigos TOTP, alfanuméricos para backup codes
    const sanitized = isBackupCode 
      ? value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)
      : value.replace(/\D/g, '').slice(0, 6);
    
    setCode(sanitized);
  };

  const toggleBackupCode = () => {
    setIsBackupCode(!isBackupCode);
    setCode('');
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Verificación 2FA"
      size="md"
      showCloseButton={false}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Verificación Requerida
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isBackupCode 
              ? 'Ingresa uno de tus códigos de respaldo de 8 caracteres'
              : 'Ingresa el código de 6 dígitos de tu app de autenticación'
            }
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Usuario: <span className="font-mono">{email}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className={commonClasses.flexStart}>
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isBackupCode ? 'Código de Respaldo' : 'Código de Verificación'}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className={cn(commonClasses.input, 'text-center text-lg font-mono tracking-wider')}
              placeholder={isBackupCode ? 'A1B2C3D4' : process.env.NEXT_PUBLIC_TEST_VALUE || 'SECURE_TEST'}
              maxLength={isBackupCode ? 8 : 6}
              autoComplete="one-time-code"
              autoFocus
              required
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {isBackupCode 
                  ? 'Código alfanumérico de 8 caracteres'
                  : 'Código numérico de 6 dígitos'
                }
              </p>
              <div className="flex items-center text-xs text-gray-400">
                <ClockIcon className="h-3 w-3 mr-1" />
                <span>Expira en ~30s</span>
              </div>
            </div>
          </div>

          {/* Toggle Backup Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleBackupCode}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              {isBackupCode 
                ? '← Usar código de la app' 
                : '¿Perdiste tu dispositivo? Usar código de respaldo →'
              }
            </button>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className={cn(commonClasses.buttonSecondary, 'flex-1')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !code}
              className={cn(commonClasses.buttonPrimary, 'flex-1', {
                [commonClasses.disabled]: loading || !code
              })}
            >
              {loading ? <LoadingSystem /> : 'Verificar'}
            </button>
          </div>
        </form>

        {/* Help */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ¿Problemas con la verificación?
          </p>
          <div className="space-y-1">
            <p className="text-xs text-gray-400">
              • Asegúrate de que la hora de tu dispositivo esté sincronizada
            </p>
            <p className="text-xs text-gray-400">
              • Intenta con un código de respaldo si tienes disponible
            </p>
            <p className="text-xs text-gray-400">
              • Contacta soporte si sigues teniendo problemas
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
} 