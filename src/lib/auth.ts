import NextAuth from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const { handlers, auth } = NextAuth(authOptions);

// Función de compatibilidad para getServerSession
export const getServerSession = auth;

export { authOptions }; 