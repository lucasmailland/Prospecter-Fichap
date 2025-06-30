import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware() {
    // Aquí puedes agregar lógica adicional si necesitas
    // Por ejemplo, redirigir basado en roles
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Las rutas públicas que no requieren autenticación
        const publicPaths = ['/auth/signin', '/auth/error', '/auth/signup']
        const isPublicPath = publicPaths.some(path => req.nextUrl.pathname.startsWith(path))
        
        if (isPublicPath) {
          return true
        }
        
        // Para todas las demás rutas, requiere token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
} 