import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from LAN devices
  allowedDevOrigins: [
    '192.168.3.86:3000',
  ],
};

export default nextConfig;
