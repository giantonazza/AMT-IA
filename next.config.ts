import type { Configuration as WebpackConfiguration } from 'webpack';
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  webpack: (config: WebpackConfiguration, { isServer, dev }: { isServer: boolean; dev: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          punycode: require.resolve('punycode/'),
          net: false,
          tls: false,
          fs: false,
        },
      };
    }

    // Suppress the warning in development mode
    if (dev) {
      config.infrastructureLogging = {
        level: 'error',
      };
    }

    // Remove the IgnorePlugin for punycode
    if (config.plugins) {
      config.plugins = config.plugins.filter((plugin) => {
        if (plugin && typeof plugin === 'object' && 'constructor' in plugin) {
          if (plugin.constructor.name === 'IgnorePlugin') {
            const opts = (plugin as any).options;
            if (opts && opts.resourceRegExp && opts.resourceRegExp.test('punycode')) {
              return false;
            }
          }
        }
        return true;
      });

      // Add IgnorePlugin for other modules
      config.plugins.push(
        new (require('webpack').IgnorePlugin)({
          resourceRegExp: /^(net|tls|fs)$/,
        })
      );
    }

    return config;
  },
};

const withPWAConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true
});

// Use type assertion to tell TypeScript that withPWAConfig is a function that takes NextConfig
const finalConfig = (withPWAConfig as (config: NextConfig) => NextConfig)(nextConfig);

export default finalConfig;

