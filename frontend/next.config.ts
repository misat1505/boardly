import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://lh3.googleusercontent.com/**"),
      new URL(`${process.env.MINIO_ENDPOINT}/**`),
    ],
  },
};

export default nextConfig;
