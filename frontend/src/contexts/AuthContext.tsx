'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { User } from '@/types/common.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  pending2FAEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  verify2FA: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  socialLogin: (provider: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente interno que usa NextAuth
function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [requires2FA, setRequires2FA] = useState(false);
  const [pending2FAEmail, setPending2FAEmail] = useState<string | null>(null);

  // Transformar session de NextAuth al formato User de la app
  const user: User | null = session?.user ? {
    id: session.user.id!,
    name: session.user.name!,
    email: session.user.email!,
    image: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || session.user.email || '')}&background=3b82f6&color=ffffff`,
    role: (session.user as any).role || 'user',
    lastLogin: (session.user as any).lastLogin ? new Date((session.user as any).lastLogin) : undefined,
  } : null;

  const loading = status === 'loading';

  // Login con credenciales (email/password)
  const login = async (email: string, password: string): Promise<{ success: boolean; requires2FA?: boolean; error?: string }> => {
    try {
      // Primero verificar si el usuario tiene 2FA activado
      const checkResponse = await fetch('/api/auth/check-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      let userHas2FA = false;
      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        userHas2FA = checkData.has2FA;
      }

      // Intentar login con NextAuth
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Si el usuario tiene 2FA, requerir verificación
        if (userHas2FA && result.error === 'CredentialsSignin') {
          setRequires2FA(true);
          setPending2FAEmail(email);
          return { 
            success: false, 
            requires2FA: true,
            error: 'Se requiere verificación 2FA'
          };
        }

        return { 
          success: false, 
          error: result.error === 'CredentialsSignin' 
            ? 'Credenciales inválidas' 
            : result.error 
        };
      }

      // Si tiene 2FA pero el login fue exitoso, algo está mal
      if (userHas2FA) {
        setRequires2FA(true);
        setPending2FAEmail(email);
        return {
          success: false,
          requires2FA: true,
          error: 'Se requiere verificación 2FA'
        };
      }

      return { success: true };
    } catch (_error) {
      return { 
        success: false, 
        error: 'Error al iniciar sesión' 
      };
    }
  };

  // Verificar código 2FA
  const verify2FA = async (email: string, token: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.message || 'Código 2FA inválido' 
        };
      }

      // Si la verificación 2FA es exitosa, hacer login con NextAuth
      const result = await signIn('credentials', {
        email,
        token, // Incluir token 2FA
        redirect: false,
      });

      if (result?.error) {
        return { 
          success: false, 
          error: 'Error completando autenticación' 
        };
      }

      // Limpiar estado 2FA
      setRequires2FA(false);
      setPending2FAEmail(null);

      return { success: true };
    } catch (_error) {
      return { 
        success: false, 
        error: 'Error verificando 2FA' 
      };
    }
  };

  // Registro de nuevos usuarios
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Crear usuario en la base de datos
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || 'Error al crear la cuenta' };
      }

      // Después del registro exitoso, hacer login automático
      return await login(email, password);
    } catch (_error) {
      return { 
        success: false, 
        error: 'Error al crear la cuenta' 
      };
    }
  };

  // Login social (Google, LinkedIn, etc.)
  const socialLogin = async (provider: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await signIn(provider, { redirect: false });
      
      if (result?.error) {
        return { 
          success: false, 
          error: `Error al iniciar sesión con ${provider}` 
        };
      }

      return { success: true };
    } catch (_error) {
      return { 
        success: false, 
        error: `Error al iniciar sesión con ${provider}` 
      };
    }
  };

  // Logout
  const logout = async () => {
    // Limpiar estado 2FA
    setRequires2FA(false);
    setPending2FAEmail(null);
    await signOut({ redirect: false });
  };

  // Reset password 
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        return { success: false, error: 'Error al enviar email de recuperación' };
      }

      return { success: true };
    } catch (_error) {
      return { 
        success: false, 
        error: 'Error al procesar solicitud de recuperación' 
      };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isLoading: loading,
    requires2FA,
    pending2FAEmail,
    login,
    verify2FA,
    register,
    logout,
    socialLogin,
    resetPassword,
    session,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Provider principal que envuelve con SessionProvider
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook para proteger rutas
export function useRequireAuth() {
  const { user, loading } = useAuth();
  
  return { user, loading, isAuthenticated: !!user };
}
