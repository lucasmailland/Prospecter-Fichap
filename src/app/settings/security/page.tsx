'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  QrCodeIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { commonClasses } from '@/styles/design-system';
import { cn } from '@/utils/sanitizer';
import LoadingSystem from '@/components/ui/LoadingSystem';

interface TwoFASetup {
  qrCode: string;
  manualEntryKey: string;
  backupCodes: string[];
  secret: string;
}

export default function SecuritySettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [setupData, setSetupData] = useState<TwoFASetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [disableCode, setDisableCode] = useState('');

  useEffect(() => {
    checkTwoFAStatus();
  }, []);

  const checkTwoFAStatus = async () => {
    try {
      // Aquí puedes agregar una llamada API para verificar el estado del 2FA
      // Por ahora, asumimos que no está activado
      setIs2FAEnabled(false);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const initSetup2FA = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/setup');
      if (!response.ok) {
        throw new Error('Error iniciando configuración 2FA');
      }
      
      const data = await response.json();
      setSetupData(data);
      setShowSetupModal(true);
    } catch (error) {
      console.error('Error:', error);
      showToast('Error iniciando configuración 2FA', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirm2FASetup = async () => {
    if (!setupData || !verificationCode) {
      showToast('Ingresa el código de verificación', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: setupData.secret,
          token: verificationCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Código de verificación inválido');
      }

      const result = await response.json();
      setIs2FAEnabled(true);
      setShowSetupModal(false);
      setVerificationCode('');
      setSetupData(null);
      showToast('¡2FA activado exitosamente!', 'success');
      
      // Mostrar códigos de respaldo
      if (result.backupCodes) {
        showBackupCodes(result.backupCodes);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('Error activando 2FA', 'error');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!currentPassword) {
      showToast('Ingresa tu contraseña actual', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: currentPassword,
          token: disableCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Error desactivando 2FA');
      }

      setIs2FAEnabled(false);
      setShowDisableModal(false);
      setCurrentPassword('');
      setDisableCode('');
      showToast('2FA desactivado exitosamente', 'info');
    } catch (error) {
      console.error('Error:', error);
      showToast('Error desactivando 2FA', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showBackupCodes = (codes: string[]) => {
    // Crear modal con códigos de respaldo
    const codesText = codes.join('\n');
    navigator.clipboard.writeText(codesText);
    showToast('Códigos de respaldo copiados al portapapeles', 'success');
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showToast(message, 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configuración de Seguridad
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Protege tu cuenta con autenticación de dos factores y otras medidas de seguridad
          </p>
        </div>

        {/* Two-Factor Authentication Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(commonClasses.card, 'mb-6')}
        >
          <div className={commonClasses.cardPadding}>
            <div className={commonClasses.flexBetween}>
              <div className={commonClasses.flexStart}>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-4">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Autenticación de Dos Factores (2FA)
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {is2FAEnabled 
                      ? 'Tu cuenta está protegida con 2FA'
                      : 'Agrega una capa extra de seguridad a tu cuenta'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {is2FAEnabled ? (
                  <>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Activado
                    </span>
                    <button
                      onClick={() => setShowDisableModal(true)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Desactivar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={initSetup2FA}
                    disabled={loading}
                    className={cn(commonClasses.buttonPrimary, 'px-4 py-2 text-sm', {
                      [commonClasses.disabled]: loading
                    })}
                  >
                    {loading ? <LoadingSystem /> : 'Activar 2FA'}
                  </button>
                )}
              </div>
            </div>

            {!is2FAEnabled && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className={commonClasses.flexStart}>
                  <DevicePhoneMobileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                      ¿Cómo funciona 2FA?
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Necesitarás una app como Google Authenticator, Authy o similar en tu teléfono.
                      Cada vez que inicies sesión, deberás ingresar un código de 6 dígitos.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(commonClasses.card)}
        >
          <div className={commonClasses.cardPadding}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Consejos de Seguridad
            </h3>
            <div className="space-y-4">
              <div className={commonClasses.flexStart}>
                <KeyIcon className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Usa contraseñas únicas y seguras
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Combina letras, números y símbolos. Nunca reutilices contraseñas.
                  </p>
                </div>
              </div>
              <div className={commonClasses.flexStart}>
                <ExclamationTriangleIcon className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Mantén actualizada tu información
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Asegúrate de que tu email y teléfono estén actualizados para recuperación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Setup 2FA Modal */}
        <Modal
          isOpen={showSetupModal}
          onClose={() => setShowSetupModal(false)}
          title="Configurar 2FA"
          size="lg"
        >
          {setupData && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Escanea el código QR</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Usa tu app de autenticación para escanear este código
                </p>
                <div className="inline-block p-4 bg-white rounded-lg">
                  <img 
                    src={setupData.qrCode} 
                    alt="QR Code para 2FA" 
                    className="w-48 h-48"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">O ingresa manualmente:</h4>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                    {setupData.manualEntryKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(setupData.manualEntryKey, 'Clave copiada')}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Código de verificación
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Ingresa código"
                  className={commonClasses.input}
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa el código de 6 dígitos de tu app
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowSetupModal(false)}
                  className={commonClasses.buttonSecondary + ' flex-1'}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirm2FASetup}
                  disabled={loading || !verificationCode}
                  className={cn(commonClasses.buttonPrimary, 'flex-1', {
                    [commonClasses.disabled]: loading || !verificationCode
                  })}
                >
                  {loading ? <LoadingSystem /> : 'Activar 2FA'}
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Disable 2FA Modal */}
        <Modal
          isOpen={showDisableModal}
          onClose={() => setShowDisableModal(false)}
          title="Desactivar 2FA"
        >
          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className={commonClasses.flexStart}>
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-400">
                  Desactivar 2FA reducirá la seguridad de tu cuenta
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Contraseña actual
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={commonClasses.input}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {is2FAEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Código 2FA (opcional)
                </label>
                <input
                  type="text"
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value)}
                  className={commonClasses.input}
                  placeholder="Código de 6 dígitos"
                />
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowDisableModal(false)}
                className={commonClasses.buttonSecondary + ' flex-1'}
              >
                Cancelar
              </button>
              <button
                onClick={disable2FA}
                disabled={loading || !currentPassword}
                className={cn(commonClasses.buttonDanger, 'flex-1', {
                  [commonClasses.disabled]: loading || !currentPassword
                })}
              >
                {loading ? <LoadingSystem /> : 'Desactivar 2FA'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
} 