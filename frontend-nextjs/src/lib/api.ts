import type { Category } from '@/lib/theme';
import {
  categoryToPostType,
  type PaginationMeta,
  type PostDetail,
  type PostsListResponse,
  type TagsListResponse,
} from '@/types/api';

export const getApiBaseUrl = () => {
  // 在服務器端（Server Component），使用環境變數 API_INTERNAL_URL（IP 地址）
  // 這是因為 Next.js 的 fetch API 無法解析 Docker 服務名稱 'backend'
  if (typeof window === 'undefined') {
    // 優先使用 API_INTERNAL_URL（IP 地址），如果沒有則嘗試 NEXT_PUBLIC_API_URL
    return (
      process.env.API_INTERNAL_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://172.27.0.3:3001' // fallback 到已知的 backend IP
    );
  }
  // 在客戶端（Client Component），使用 localhost
  return 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  posts: () => `${getApiBaseUrl()}/api/v1/posts`,
  post: (slug: string) => `${getApiBaseUrl()}/api/v1/posts/${slug}`,
  tags: () => `${getApiBaseUrl()}/api/v1/tags`,
};

export interface ListPostsParams {
  type?: 'DevPost' | 'GamePost' | 'BookPost' | 'FilmPost';
  tag_id?: number;
  page?: number;
  per_page?: number;
}

export async function listPosts(
  params?: ListPostsParams
): Promise<PostsListResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.tag_id != null) searchParams.set('tag_id', String(params.tag_id));
    if (params?.page != null) searchParams.set('page', String(params.page));
    if (params?.per_page != null)
      searchParams.set('per_page', String(params.per_page));

    const query = searchParams.toString();
    const url = query
      ? `${API_ENDPOINTS.posts()}?${query}`
      : API_ENDPOINTS.posts();

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return { posts: [], meta: defaultPaginationMeta() };
    }
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { posts: [], meta: defaultPaginationMeta() };
  }
}

function defaultPaginationMeta(): PaginationMeta {
  return {
    current_page: 1,
    total_pages: 0,
    total_count: 0,
    per_page: 20,
  };
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  try {
    const res = await fetch(API_ENDPOINTS.post(slug), { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export async function listTags(): Promise<TagsListResponse> {
  try {
    const res = await fetch(API_ENDPOINTS.tags(), { cache: 'no-store' });
    if (!res.ok) return { tags: [] };
    return res.json();
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    return { tags: [] };
  }
}

/** 依 category 取得文章列表，對既有呼叫端保持相容 */
export async function getPostsByCategory(category: Category) {
  const { posts } = await listPosts({
    type: categoryToPostType[category],
  });
  return posts;
}

export default API_BASE_URL;
