const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true
  });
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    env: {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          net: false,
          tls: false,
          fs: false,
          punycode: require.resolve('./lib/punycode-shim.js'),
        };
      }
      return config;
    },
    images: {
      domains: ['localhost', 'amt-ia.vercel.app'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    i18n: {
      locales: ['es'],
      defaultLocale: 'es',
    },
  };
  
  module.exports = withPWA(nextConfig);
  
  