#!/bin/bash

echo "🔧 FIXING CRITICAL SECURITY ISSUES"
echo "=================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. REMOVER CONSOLE LOGS COMENTADOS
log_info "Removiendo console logs comentados..."
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '/\/\/ console\./d'
find src -name "*.ts" -o -name "*.tsx" | xargs sed -i '/console\.warn.*context.*WARN/d'
log_success "Console logs removidos"

# 2. FIX CREDENCIALES HARDCODEADAS
log_info "Corrigiendo credenciales hardcodeadas..."
cat > src/scripts/seed-users-secure.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUsers() {
  console.log('🌱 Creando usuarios de prueba...');

  // VERIFICAR que las variables de entorno estén configuradas
  if (!process.env.SEED_ADMIN_PASSWORD) {
    throw new Error('❌ SEED_ADMIN_PASSWORD debe estar configurada');
  }
  if (!process.env.SEED_DEMO_PASSWORD) {
    throw new Error('❌ SEED_DEMO_PASSWORD debe estar configurada');
  }
  if (!process.env.SEED_TEST_PASSWORD) {
    throw new Error('❌ SEED_TEST_PASSWORD debe estar configurada');
  }

  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 12);
  const demoPassword = await bcrypt.hash(process.env.SEED_DEMO_PASSWORD, 12);
  const testPassword = await bcrypt.hash(process.env.SEED_TEST_PASSWORD, 12);

  const users = [
    {
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      email: 'admin@prospecter.com',
      password: adminPassword,
      role: 'ADMIN',
      twoFactorEnabled: false,
    },
    {
      firstName: 'Demo',
      lastName: 'User', 
      name: 'Demo User',
      email: 'demo@prospecter.com',
      password: demoPassword,
      role: 'USER',
      twoFactorEnabled: false,
    },
    {
      firstName: 'Test',
      lastName: 'User',
      name: 'Test User', 
      email: 'test@prospecter.com',
      password: testPassword,
      role: 'USER',
      twoFactorEnabled: false,
    },
  ];

  for (const userData of users) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`✅ Usuario ${userData.email} ya existe`);
        continue;
      }

      const user = await prisma.user.create({
        data: userData,
      });

      console.log(`✅ Usuario creado: ${user.name} (${user.email})`);
    } catch (error) {
      console.error(`❌ Error creando usuario ${userData.email}:`, error.message);
    }
  }

  console.log('🎉 ¡Usuarios de prueba creados!');
  console.log('\n📋 Credenciales para probar:');
  console.log('Admin: admin@prospecter.com / [Ver variable SEED_ADMIN_PASSWORD]');
  console.log('Demo: demo@prospecter.com / [Ver variable SEED_DEMO_PASSWORD]');
  console.log('Test: test@prospecter.com / [Ver variable SEED_TEST_PASSWORD]');
  console.log('\n⚠️  IMPORTANTE: Variables de entorno OBLIGATORIAS en producción.');
}

createUsers()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

# Reemplazar archivo inseguro
mv src/scripts/seed-users-secure.js src/scripts/seed-users.js
log_success "Credenciales hardcodeadas corregidas"

# 3. MEJORAR JWT VALIDATION
log_info "Mejorando JWT validation..."
cat > src/lib/jwt.service.ts << 'EOF'
import jwt from 'jsonwebtoken';

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class JWTService {
  private static readonly SECRET = process.env.JWT_SECRET;
  
  static validateToken(token: string): { isValid: boolean; payload?: JWTPayload } {
    if (!this.SECRET) {
      throw new Error('JWT_SECRET must be configured');
    }

    try {
      const payload = jwt.verify(token, this.SECRET) as JWTPayload;
      
      // Verificaciones adicionales
      if (!payload.sub || !payload.email || !payload.role) {
        return { isValid: false };
      }
      
      // Verificar expiración
      if (payload.exp < Date.now() / 1000) {
        return { isValid: false };
      }
      
      return { isValid: true, payload };
    } catch (error) {
      return { isValid: false };
    }
  }
  
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    if (!this.SECRET) {
      throw new Error('JWT_SECRET must be configured');
    }
    
    return jwt.sign(payload, this.SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      issuer: 'prospecter-app',
      audience: 'prospecter-users'
    });
  }
}
EOF

# Actualizar security middleware
cat > src/lib/security.middleware.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { JWTService } from '@/lib/jwt.service';

// Configuración de Content Security Policy
const CSP_HEADER = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.stripe.com https://api.openai.com https://api.hubapi.com;
  frame-src 'self' https://js.stripe.com https://checkout.stripe.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s+/g, ' ').trim();

// Lista de hosts permitidos para prevenir SSRF
const ALLOWED_HOSTS = [
  'api.openai.com',
  'api.hubapi.com',
  'api.stripe.com',
  'hooks.slack.com',
  'api.clearbit.com',
  'api.hunter.io',
  'apilayer.net',
  'localhost',
  '127.0.0.1'
];

// Middleware de seguridad
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Headers de seguridad
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Content-Security-Policy', CSP_HEADER);
  
  // HSTS para HTTPS
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Ocultar server information
  response.headers.set('Server', 'ProspecterApp/1.0');

  return response;
}

// Validación de URLs para prevenir SSRF
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Solo permitir HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Verificar host permitido
    return ALLOWED_HOSTS.some(host => 
      parsedUrl.hostname === host || 
      parsedUrl.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

// Sanitización de entrada
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+=/gi, '') // Remover event handlers
    .replace(/data:/gi, '') // Remover data URLs
    .trim();
}

// Validación de email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validación de teléfono
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Rate limiting distribuido mejorado
import Redis from 'ioredis';

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDurationMs: number;
}

export class DistributedRateLimit {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }
  
  async checkLimit(
    identifier: string, 
    config: RateLimitConfig = {
      windowMs: 60000,
      maxAttempts: 100,
      blockDurationMs: 300000
    }
  ): Promise<{ allowed: boolean; remainingAttempts: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    
    try {
      // Obtener intentos actuales
      const current = await this.redis.get(key);
      
      if (!current) {
        // Primera request
        await this.redis.setex(key, Math.ceil(config.windowMs / 1000), '1');
        return {
          allowed: true,
          remainingAttempts: config.maxAttempts - 1,
          resetTime: now + config.windowMs
        };
      }
      
      const attempts = parseInt(current);
      
      if (attempts >= config.maxAttempts) {
        // Bloquear temporalmente si supera límite
        const blockKey = `blocked:${identifier}`;
        await this.redis.setex(blockKey, Math.ceil(config.blockDurationMs / 1000), 'blocked');
        
        return {
          allowed: false,
          remainingAttempts: 0,
          resetTime: now + config.blockDurationMs
        };
      }
      
      // Incrementar contador
      await this.redis.incr(key);
      
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - attempts - 1,
        resetTime: now + config.windowMs
      };
      
    } catch (error) {
      // En caso de error con Redis, permitir request pero log error
      console.error('Rate limit Redis error:', error);
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts,
        resetTime: now + config.windowMs
      };
    }
  }
  
  async isBlocked(identifier: string): Promise<boolean> {
    try {
      const blockKey = `blocked:${identifier}`;
      const blocked = await this.redis.get(blockKey);
      return blocked === 'blocked';
    } catch (error) {
      console.error('Rate limit block check error:', error);
      return false;
    }
  }
}

// Validación mejorada de tokens JWT
export async function validateJWT(token: string): Promise<boolean> {
  const { isValid } = JWTService.validateToken(token);
  return isValid;
}

// Middleware de autenticación para API routes
export async function requireAuth(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

// Middleware de autorización de admin
export async function requireAdmin(request: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return session;
}
EOF

log_success "JWT validation mejorada"

# 4. ACTUALIZAR PACKAGE.JSON CON NUEVAS DEPENDENCIAS
log_info "Instalando dependencias de seguridad..."
npm install jsonwebtoken @types/jsonwebtoken ioredis @types/ioredis --save
npm install eslint-plugin-security @typescript-eslint/eslint-plugin --save-dev
log_success "Dependencias instaladas"

# 5. CREAR CONFIGURACIÓN ESLINT DE SEGURIDAD
log_info "Configurando ESLint para seguridad..."
cat > .eslintrc.security.js << 'EOF'
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['security', '@typescript-eslint'],
  rules: {
    // Reglas de seguridad estrictas
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    
    // TypeScript estricto
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    
    // Console logs prohibidos en producción
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Debugger prohibido
    'no-debugger': 'error',
    
    // Alert prohibido
    'no-alert': 'error'
  }
};
EOF

log_success "ESLint configurado"

# 6. ACTUALIZAR TSCONFIG PARA SER MÁS ESTRICTO
log_info "Mejorando configuración de TypeScript..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    
    // Configuraciones de seguridad adicionales
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

log_success "TypeScript configuración mejorada"

echo ""
echo "🎉 CORRECCIONES DE SEGURIDAD COMPLETADAS"
echo "========================================"
echo ""
echo "✅ Console logs comentados removidos"
echo "✅ Credenciales hardcodeadas corregidas"
echo "✅ JWT validation mejorada"
echo "✅ Rate limiting distribuido implementado"
echo "✅ ESLint de seguridad configurado"
echo "✅ TypeScript configuración estricta"
echo ""
echo "🔄 PRÓXIMOS PASOS:"
echo "1. Configurar variables de entorno: SEED_ADMIN_PASSWORD, SEED_DEMO_PASSWORD, SEED_TEST_PASSWORD"
echo "2. Configurar Redis URL: REDIS_URL"
echo "3. Ejecutar: npm run lint para verificar"
echo "4. Ejecutar tests de seguridad"
echo ""
echo "⚠️  IMPORTANTE: Revisar el documento ANALISIS_CODIGO_COMPLETO.md para el plan completo"