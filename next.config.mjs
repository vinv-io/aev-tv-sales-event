import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable features that might cause manifest issues in Docker
  swcMinify: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['placehold.co', 'aquavietnam.com.vn', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aquavietnam.com.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
    // Add additional configuration for production
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self' data: https:; img-src 'self' data: https: http:; script-src 'none'; sandbox;",
    // Temporarily disable image optimization to test
    unoptimized: true,
  },
  env: {
    DATA_SOURCE: process.env.DATA_SOURCE,
  },
  // Enable standalone output for Docker production deployment
  output: 'standalone',
};

export default withNextIntl(nextConfig);
