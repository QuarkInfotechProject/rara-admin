/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [{ hostname: "api.raratreks.com" }],
    // remotePatterns: [{ hostname: "localhost" }],
  },
};

export default nextConfig;
