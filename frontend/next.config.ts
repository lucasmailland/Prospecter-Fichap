import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // API routes no son necesarias en el frontend separado
  output: 'standalone',
  // Configuración para trabajar con backend separado
  async rewrites() {
    return [
      // No reescribir /api/auth/*, que lo maneje Next.js
      {
        source: '/api/:path((?!auth).*)',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig; 