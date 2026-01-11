/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Experimental optimizations
  experimental: {
    // optimizeCss: true, // Disabled due to Vercel build error (requires 'critters')
  },
};

module.exports = nextConfig;
