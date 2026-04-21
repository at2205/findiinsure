import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "portal.bankit.in",
        port: "9090",
      },
    ],
  },
};

export default nextConfig;
