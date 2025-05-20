import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    // URL del API Gateway
    NEXT_PUBLIC_API_GATEWAY_URL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
  },
  // Configuración para solicitudes externas a dominios específicos
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: `${process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080'}/graphql`,
      },
    ];
  },
};

export default nextConfig;
