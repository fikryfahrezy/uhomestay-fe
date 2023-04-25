/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  transpilePackages: ["cmnjg-sb"],
};

module.exports = nextConfig;
