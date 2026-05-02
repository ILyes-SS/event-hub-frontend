// Path: ./next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1339",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1339",
        pathname: "/**",
      },      
      {
        protocol: "https",
        hostname: "accessible-poem-1828f4c906.strapiapp.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;