import NextAuth from 'next-auth';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import AzureADProvider from 'next-auth/providers/azure-ad';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // 🔵 Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        },
      },
    }),

    // 🔵 LinkedIn Provider
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),

    // 🔵 Microsoft Azure AD Provider
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_TENANT_ID || 'common',
    }),

    // 🔵 Facebook Provider
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),

    // 🔵 Credentials Provider (Email/Password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: process.env.NEXT_PUBLIC_DEMO_DEMO_PASSWORD || 'SECURE_DEMO' },
      },
      async authorize(credentials) {
// Debug: console.log('Credenciales recibidas:', credentials);
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales inválidas');
        }

        try {
          // Buscar usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
// Debug: console.log('Usuario encontrado:', user);

          if (!user || !user.password) {
            throw new Error('Usuario no encontrado');
          }

          // Verificar contraseña
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
// Debug: console.log('¿Password válido?', isPasswordValid);

          if (!isPasswordValid) {
            throw new Error('Contraseña incorrecta');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
// console.error('Error en autorización:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Guardar información adicional en el token
      if (user) {
        token.role = user.role;
      }
      
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }

      return token;
    },

    async session({ session, token }) {
      // Enviar propiedades al cliente
      if (token && session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
        session.provider = token.provider as string;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      // Permitir signin para todos los providers configurados
      if (account?.provider === 'credentials') {
        return true;
      }

      // Para providers OAuth, verificar que el email esté disponible
      if (user.email) {
        return true;
      }

      return false;
    },

    async redirect({ url, baseUrl }) {
      // Permitir redirecciones relativas y al dominio base
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }: { user: any; account: any; profile?: any; isNewUser?: boolean }) {
// Debug: console.log(`✅ Usuario autenticado: ${user.email} via ${account?.provider}`);
      
      // Actualizar información del usuario en SSO
      if (account?.provider !== 'credentials' && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            role: 'USER',
          },
        });
      }
    },

    async signOut({ token }: { token?: any }) {
// Debug: console.log(`👋 Usuario desconectado: ${token?.email}`);
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

const { handlers } = NextAuth(authOptions);
const { GET, POST } = handlers;

export { GET, POST }; 