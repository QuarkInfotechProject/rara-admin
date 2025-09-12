/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    // remotePatterns: [{ hostname: "rara.api.quarkinfotech.com" }],
    remotePatterns: [{ hostname: "localhost" }],
  },
};

export default nextConfig;
