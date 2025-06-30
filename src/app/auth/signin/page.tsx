'use client'

import { signIn, getProviders } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface Provider {
  id: string
  name: string
  type: string
}

const providerIcons = {
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="#0077B5" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  'azure-ad': (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#00A4EF" d="M0 0h11.377v11.372H0z"/>
      <path fill="#FFB900" d="M12.623 0H24v11.372H12.623z"/>
      <path fill="#00A4EF" d="M0 12.628h11.377V24H0z"/>
      <path fill="#00A4EF" d="M12.623 12.628H24V24H12.623z"/>
    </svg>
  )
}

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  useEffect(() => {
    (async () => {
      const res = await getProviders()
      setProviders(res)
    })()
  }, [])

  const handleSignIn = async (providerId: string) => {
    setLoading(providerId)
    try {
      await signIn(providerId, { 
        callbackUrl: '/',
        redirect: true 
      })
    } catch (error) {
      console.error('Error signing in:', error)
      setLoading(null)
    }
  }

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error al iniciar sesión con el proveedor'
      case 'OAuthCallback':
        return 'Error en la respuesta del proveedor'
      case 'OAuthCreateAccount':
        return 'Error al crear la cuenta'
      case 'EmailCreateAccount':
        return 'Error al crear la cuenta con email'
      case 'Callback':
        return 'Error en el callback'
      case 'OAuthAccountNotLinked':
        return 'Esta cuenta ya está vinculada con otro proveedor'
      case 'EmailSignin':
        return 'Error al enviar el email de verificación'
      case 'CredentialsSignin':
        return 'Credenciales incorrectas'
      case 'SessionRequired':
        return 'Sesión requerida'
      default:
        return 'Error desconocido en la autenticación'
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      <div className="mx-auto w-full max-w-md px-6">
        {/* Logo y header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
            Bienvenido a Prospecter
          </h1>
          <p className="text-sm text-gray-500">
            Inicia sesión con tu cuenta profesional
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Error de autenticación
                </h3>
                <p className="text-sm text-red-700">
                  {getErrorMessage(error)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Provider buttons */}
        <div className="space-y-3">
          {providers && Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => handleSignIn(provider.id)}
              disabled={loading === provider.id}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                {loading === provider.id ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <div className="mr-3">
                    {providerIcons[provider.id as keyof typeof providerIcons]}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {loading === provider.id 
                    ? 'Conectando...' 
                    : `Continuar con ${provider.name}`
                  }
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 