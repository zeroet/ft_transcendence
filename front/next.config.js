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
  //       source: "/Login",
  //       destination: "http://localhost:8080/auth/login",
  //       permanent: true,
  //     },
  //   ];
  // },
};
