'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { commonClasses } from '@/styles/design-system';
import { cn } from '@/utils/sanitizer';
import LoadingSystem from '@/components/ui/LoadingSystem';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (urlToken && urlEmail) {
      setToken(urlToken);
      setEmail(urlEmail);
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams]);

  const validatePassword = (inputPassword: string) => {
    const MIN_LENGTH = 8;
    const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    
    if (inputPassword.length < MIN_LENGTH) {
      return `La contraseña debe tener al menos ${MIN_LENGTH} caracteres`;
    }
    if (!PASSWORD_PATTERN.test(inputPassword)) {
      return 'La contraseña debe contener al menos una mayúscula, una minúscula y un número';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al restablecer contraseña');
      }

      setSuccess(true);
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push('/auth/signin?message=password-reset-success');
      }, 3000);

    } catch (error) {
      // console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al restablecer contraseña');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (inputValue: string) => {
    let strengthScore = 0;
    const checks = {
      hasMinLength: inputValue.length >= 8,
      hasLowercase: /[a-z]/.test(inputValue),
      hasUppercase: /[A-Z]/.test(inputValue),
      hasNumbers: /\d/.test(inputValue),
      hasSpecialChars: /[^a-zA-Z\d]/.test(inputValue)
    };

    Object.values(checks).forEach(check => {
      if (check) strengthScore++;
    });

    if (strengthScore < 2) return { level: 'weak', color: 'red', text: 'Débil' };
    if (strengthScore < 4) return { level: 'medium', color: 'yellow', text: 'Media' };
    return { level: 'strong', color: 'green', text: 'Fuerte' };
  };

  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  // Token inválido
  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className={cn(commonClasses.card, commonClasses.cardPadding)}>
            <div className="text-red-500 mb-4">
              <ExclamationTriangleIcon className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Enlace Inválido
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              El enlace de restablecimiento no es válido o ha expirado.
            </p>
            <Link
              href="/auth/forgot-password"
              className={cn(commonClasses.buttonPrimary, 'w-full inline-block text-center')}
            >
              Solicitar Nuevo Enlace
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Éxito
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className={cn(commonClasses.card, commonClasses.cardPadding)}>
            <div className="text-green-500 mb-4">
              <CheckCircleIcon className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Contraseña Actualizada!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tu contraseña ha sido restablecida exitosamente.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Formulario principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl mb-4"
          >
            <KeyIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Nueva Contraseña
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(commonClasses.card, commonClasses.cardPadding)}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className={commonClasses.flexStart}>
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className={cn(commonClasses.input, 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed')}
              />
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className={commonClasses.input}
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.color === 'red' ? 'bg-red-500 w-1/3' :
                          passwordStrength.color === 'yellow' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.color === 'red' ? 'text-red-600' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={commonClasses.input}
                placeholder="Confirma tu nueva contraseña"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className={cn(commonClasses.buttonPrimary, 'w-full', {
                [commonClasses.disabled]: loading || !newPassword || !confirmPassword
              })}
            >
              {loading ? <LoadingSystem /> : 'Actualizar Contraseña'}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              💡 Consejos para una contraseña segura:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Al menos 8 caracteres de longitud</li>
              <li>• Combina mayúsculas, minúsculas y números</li>
              <li>• Incluye símbolos especiales (!@#$%)</li>
              <li>• No uses información personal</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 