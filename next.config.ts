import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    // Ignorar errores de ESLint durante el build para Docker
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TypeScript durante el build para Docker
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
