/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/megicode',
        permanent: false,
      },
      {
        source: '/project',
        destination: '/projects',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Define other configurations as needed
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Add support for source maps
    if (!isServer) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
