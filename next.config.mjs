/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: true },
      { source: "/skills", destination: "/", permanent: true },
      { source: "/downloads", destination: "/resume", permanent: true },
    ];
  },
};

export default nextConfig;
