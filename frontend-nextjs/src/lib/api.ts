// API 基礎 URL 配置
// 在 Docker 環境中，Server-Side 使用環境變數 API_INTERNAL_URL (使用 IP 地址，因為 Next.js fetch 無法解析 Docker 服務名稱)
// Client-Side 使用 localhost:3001 (因為瀏覽器無法解析 Docker 服務名稱)
// 本地開發時，預設為 http://localhost:3001

export const getApiBaseUrl = () => {
  // 在服務器端（Server Component），使用環境變數 API_INTERNAL_URL（IP 地址）
  // 這是因為 Next.js 的 fetch API 無法解析 Docker 服務名稱 'backend'
  if (typeof window === 'undefined') {
    // 優先使用 API_INTERNAL_URL（IP 地址），如果沒有則嘗試 NEXT_PUBLIC_API_URL
    return process.env.API_INTERNAL_URL || 
           process.env.NEXT_PUBLIC_API_URL || 
           'http://172.27.0.3:3001'; // fallback 到已知的 backend IP
  }
  // 在客戶端（Client Component），使用 localhost
  return 'http://localhost:3001';
};

// 為了向後兼容，保留 API_BASE_URL（但建議使用 getApiBaseUrl()）
const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  posts: () => `${getApiBaseUrl()}/api/v1/posts`,
  post: (slug: string) => `${getApiBaseUrl()}/api/v1/posts/${slug}`,
  postsByCategory: (category: string) => `${getApiBaseUrl()}/api/v1/posts?category=${category}`,
  postsByLayoutType: (layoutType: string) => `${getApiBaseUrl()}/api/v1/posts?layout_type=${layoutType}`,
};

export default API_BASE_URL;
