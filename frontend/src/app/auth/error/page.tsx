'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function AuthError() {
  // const _searchParams = useSearchParams()
  // const _router = useRouter()
  // const _error = searchParams.get('error')

  // const _getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Error de configuración',
          description: 'Hay un problema con la configuración del servidor.',
          suggestion: 'Por favor, contacta al administrador del sistema.'
        }
      case 'AccessDenied':
        return {
          title: 'Acceso denegado',
          description: 'No tienes permisos para acceder a esta aplicación.',
          suggestion: 'Asegúrate de usar una cuenta autorizada.'
        }
      case 'Verification':
        return {
          title: 'Error de verificación',
          description: 'El enlace de verificación ha expirado o no es válido.',
          suggestion: 'Solicita un nuevo enlace de verificación.'
        }
      case 'Default':
      default:
        return {
          title: 'Error de autenticación',
          description: 'Ocurrió un error inesperado durante el inicio de sesión.',
          suggestion: 'Intenta nuevamente en unos momentos.'
        }
    }
  }

  const { title, description, suggestion } = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-6">
        {/* Logo y header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {description}
          </p>
        </div>

        {/* Error details */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">
                ¿Qué puedes hacer?
              </h3>
              <p className="text-sm text-red-700">
                {suggestion}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Intentar nuevamente
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al inicio
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Si el problema persiste, contacta al{' '}
            <a href="mailto:support@prospecter.com" className="text-gray-600 hover:text-gray-900">
              soporte técnico
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 