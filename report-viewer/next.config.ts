import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configured to work with main site at /silent-aws-audit/*
  basePath: '/silent-aws-audit',
  output: 'standalone',
};

export default nextConfig;
