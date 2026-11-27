/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  // các trang đọc file lúc chạy (bài blog mới từ /admin): đóng gói kèm giao diện + nội dung
  outputFileTracingIncludes: {
    '/*': ['./src/framer/**', './content/**'],
  },
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/index', destination: '/', permanent: true },
      { source: '/giai-phap', destination: '/du-an', permanent: true },
    ];
  },
  async headers() {
    return [
      { source: '/framer/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/images/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800' }] },
    ];
  },
};

export default nextConfig;
