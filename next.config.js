/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    WEB_URL: process.env.WEB_URL,
  },
  images: {
   domains: ["cdn.pixabay.com", "tutoringsg-profile-pictures.s3.ap-southeast-1.amazonaws.com"]
  }
}

module.exports = nextConfig
