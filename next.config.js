const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = withNextIntl({
  reactStrictMode: false, // Disable React Strict Modecd
  images: {
    domains: [
      'ol5febquycnr2hzu.public.blob.vercel-storage.com',
      'kdbxq6eseiqtwhzx.public.blob.vercel-storage.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/chat',
        destination: 'https://clerk-convex-chat.vercel.app/',
        permanent: true,
      },
    ];
  },
});

module.exports = nextConfig;
