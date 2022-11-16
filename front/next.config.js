/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  nextConfig,
  // async redirects() {
  //   return [
  //     {
  //       source: "/Logout",
  //       destination: "http://localhost:8080/auth/logout",
  //       permanent: true,
  //     },
  //   ];
  // },
};
