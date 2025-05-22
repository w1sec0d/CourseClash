import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    // URL del API Gateway
    NEXT_PUBLIC_API_GATEWAY_URL:
      process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
  },
  // Configuración para solicitudes externas a dominios específicos
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: `${
          process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080'
        }/graphql`,
      },
    ];
  },
  // Configuración de imágenes externas
  images: {
    domains: ['placehold.co', 'randomuser.me'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
