'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from '@/hooks/common/useForm';
import LoadingSystem from '@/components/ui/LoadingSystem';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { register: registerUser, loading } = useAuth();
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    canSubmit,
    isValid,
  } = useForm<RegisterFormData>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
    validationSchema: {
      name: {
        required: true,
        minLength: 2,
        custom: (value: string) => {
          if (value && !/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            return 'El nombre solo puede contener letras y espacios';
          }
          return null;
        },
      },
      email: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minLength: 8,
        custom: (value: string) => {
          if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return 'La contraseña debe tener al menos una mayúscula, una minúscula y un número';
          }
          return null;
        },
      },
      confirmPassword: {
        required: true,
        custom: (value: string) => {
          if (value && value !== values.password) {
            return 'Las contraseñas no coinciden';
          }
          return null;
        },
      },
      acceptTerms: {
        required: true,
        custom: (value: boolean) => {
          if (!Boolean(value)) {
            return 'Debes aceptar los términos y condiciones';
          }
          return null;
        },
      },
    },
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (formData) => {
      setSubmitError('');
      // Debug: console.log('Datos enviados:', formData);
      const result = await registerUser(formData.name, formData.email, formData.password);
      
      if (result.success) {
        router.push('/');
      } else {
        setSubmitError(result.error || 'Error al crear la cuenta');
      }
    },
  });

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(values.password);
  
  const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Únete a Prospecter
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Crea tu cuenta y comienza a prospectar
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
          {submitError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
              </div>
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={values.name}
                onChange={handleChange('name')}
                onBlur={handleBlur('name')}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:border-transparent transition-colors ${
                  touched.name && errors.name
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="Juan Pérez"
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:border-transparent transition-colors ${
                  touched.email && errors.email
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                }`}
                placeholder="juan@ejemplo.com"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange('password')}
                  onBlur={handleBlur('password')}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:border-transparent transition-colors ${
                    touched.password && errors.password
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {values.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Seguridad: {strengthLabels[passwordStrength - 1] || 'Muy débil'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        strengthColors[passwordStrength - 1] || 'bg-red-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={values.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:border-transparent transition-colors ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {values.confirmPassword && values.password === values.confirmPassword && (
                <div className="mt-1 flex items-center text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  <span className="text-xs">Las contraseñas coinciden</span>
                </div>
              )}
              
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={!!values.acceptTerms}
                  onChange={handleChange('acceptTerms')}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Acepto los{' '}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    política de privacidad
                  </Link>
                </span>
              </label>
              {touched.acceptTerms && errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isValid}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <LoadingSystem />
              ) : (
                <>
                  <UserPlusIcon className="w-5 h-5 mr-2" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                href="/auth/signin"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 