/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Cho phép load ảnh từ Cloudinary, Unsplash và các domain khác
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false, // để true chỉ khi export static
  },

  // Không cần experimental.serverActions (Next 14 đã bật sẵn)
}

module.exports = nextConfig
