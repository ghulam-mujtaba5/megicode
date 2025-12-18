/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
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
    return config;
  },
};

module.exports = nextConfig;
