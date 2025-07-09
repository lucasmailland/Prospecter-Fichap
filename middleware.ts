import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware, rateLimit } from '@/lib/security.middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener IP del cliente para rate limiting
  const clientIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';

  // Aplicar rate limiting a API routes
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(clientIP, 100, 60000)) {
      return NextResponse.json(
        { error: 'Too many requests' }, 
        { status: 429 }
      );
    }
  }

  // Aplicar middleware de seguridad
  const response = securityMiddleware(request);
  
  // Protección adicional para rutas sensibles
  if (pathname.startsWith('/api/admin/') || pathname.startsWith('/admin/')) {
    // Rate limiting más estricto para rutas admin
    if (!rateLimit(`admin-${clientIP}`, 20, 60000)) {
      return NextResponse.json(
        { error: 'Too many admin requests' }, 
        { status: 429 }
      );
    }
  }

  // Protección para rutas de autenticación
  if (pathname.startsWith('/api/auth/')) {
    // Rate limiting para autenticación
    if (!rateLimit(`auth-${clientIP}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Too many authentication attempts' }, 
        { status: 429 }
      );
    }
  }

  return response;
}

// Configurar las rutas donde aplicar el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 