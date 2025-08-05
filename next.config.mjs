/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    remotePatterns: [{ hostname: "api.communityhomestay.com" }],
  },
};

export default nextConfig;
