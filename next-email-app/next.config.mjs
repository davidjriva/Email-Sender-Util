/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Enables static export
  webpack: (config, { isServer }) => {
    // Set the public path
    config.output.publicPath = "./_next/";
    return config;
  },
};

export default nextConfig;
