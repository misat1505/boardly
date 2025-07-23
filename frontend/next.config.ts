import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: process.env.MINIO_ENDPOINT?.startsWith("https")
          ? "https"
          : "http",
        hostname: new URL(process.env.MINIO_ENDPOINT!).hostname,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
