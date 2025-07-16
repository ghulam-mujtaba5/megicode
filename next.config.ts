/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      {
        source: '/project',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/',
        destination: '/megicode',
        permanent: false,
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (!isServer) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
