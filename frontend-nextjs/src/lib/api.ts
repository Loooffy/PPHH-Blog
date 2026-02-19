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

export async function getPostsByCategory<T = Record<string, unknown>>(category: string): Promise<T[]> {
  try {
    const res = await fetch(API_ENDPOINTS.postsByCategory(category), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default API_BASE_URL;
