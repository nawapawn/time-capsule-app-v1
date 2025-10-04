/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'img.icons8.com', port: '', pathname: '/**' }, // ✅ เพิ่มตรงนี้
    ],
  },
};

module.exports = nextConfig;
