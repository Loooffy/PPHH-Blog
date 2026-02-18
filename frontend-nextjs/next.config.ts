import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bookrep.com.tw',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.mm.bing.net',
        pathname: '/**',
      },
    ],
  },
  // 在 Docker/WSL2 環境中啟用 polling 模式以確保檔案變更能被正確偵測
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000, // 每秒檢查一次檔案變更（1000 毫秒）
        aggregateTimeout: 300, // 延遲重新編譯的時間（毫秒）
      };
    }
    return config;
  },
};

export default nextConfig;
