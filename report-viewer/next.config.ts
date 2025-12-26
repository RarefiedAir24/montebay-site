import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deploying as separate project, so no basePath needed
  // If you want to deploy to same domain as subdirectory, uncomment:
  // basePath: '/silent-aws-audit',
  output: 'standalone',
};

export default nextConfig;
