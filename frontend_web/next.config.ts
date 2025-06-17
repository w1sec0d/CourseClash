import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
