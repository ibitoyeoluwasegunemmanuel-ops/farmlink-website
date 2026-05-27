/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com'],
  },
};

module.exports = nextConfig;
