/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Exclude Camunda SDK from bundling (server-only)
  serverExternalPackages: ['@camunda8/sdk', 'win-ca'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      // Canonicalize domain: redirect www to non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.megicode.com' }],
        destination: 'https://megicode.com/:path*',
        permanent: true,
      },
      {
        source: '/project',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/megicode',
        destination: '/',
        permanent: true,
      },
      {
        source: '/megicode/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.devtool = 'source-map';
    }
    
    // Exclude problematic modules from being processed by webpack
    config.externals = config.externals || [];
    
    if (isServer) {
      // Push externals as functions to properly handle them
      const oldExternals = config.externals;
      config.externals = [
        ...( Array.isArray(oldExternals) ? oldExternals : [oldExternals]),
        ({ request }, callback) => {
          if (request === '@camunda8/sdk' || request?.startsWith('@camunda8/sdk/')) {
            return callback(null, `commonjs ${request}`);
          }
          if (request === 'win-ca' || request?.startsWith('win-ca/')) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];
    }
    
    return config;
  },
};

module.exports = nextConfig;
