/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['cmnjg-sb'],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
