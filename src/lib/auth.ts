import { getServerSession as originalGetServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import NextAuth from 'next-auth';

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Función de compatibilidad para getServerSession
export const getServerSession = () => originalGetServerSession(authOptions);

export { authOptions }; 