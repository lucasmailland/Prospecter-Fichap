import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

// Rate limiting básico
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

export function rateLimit(identifier: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);
  
  if (!userLimit) {
    rateLimitMap.set(identifier, { count: 1, lastRequest: now });
    return true;
  }
  
  if (now - userLimit.lastRequest > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastRequest: now });
    return true;
  }
  
  if (userLimit.count >= limit) {
    return false;
  }
  
  userLimit.count++;
  userLimit.lastRequest = now;
  return true;
}

// Limpiar rate limit map periódicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.lastRequest > 60000) { // 1 minuto
      rateLimitMap.delete(key);
    }
  }
}, 60000);

// Validación de tokens JWT
export async function validateJWT(token: string): Promise<boolean> {
  try {
    // Implementar validación JWT aquí
    // Por ahora, verificación básica
    return token && token.split('.').length === 3;
  } catch {
    return false;
  }
}

// Middleware de autenticación para API routes
export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return session;
}

// Middleware de autorización de admin
export async function requireAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return session;
} 