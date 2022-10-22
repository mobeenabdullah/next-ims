/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_URL: "http://localhost:3139/",
  },
};

module.exports = nextConfig;
