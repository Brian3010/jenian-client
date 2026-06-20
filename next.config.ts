import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: process.env.NODE_ENV === 'development' ? ['*.trycloudflare.com'] : [],
};

export default nextConfig;
