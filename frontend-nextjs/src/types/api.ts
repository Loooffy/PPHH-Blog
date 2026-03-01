import type { Category } from '@/lib/theme';

/** Tag schema from API */
export interface Tag {
  id: number;
  name: string;
}

/** Post type enum from API */
export type PostType = 'DevPost' | 'GamePost' | 'BookPost' | 'FilmPost';

/** Post list item - list API response */
export interface PostListItem {
  id: number;
  type: PostType;
  title: string;
  description: string | null;
  slug: string;
  image_url: string | null;
  year: number | null;
  film_category: string | null;
  film_country: string | null;
  film_length: number | null;
  rating: number | null;
  published_at: string | null;
  created_at: string;
  author: string | null;
  director: string | null;
  tags: Tag[];
}

/** Post detail - single post API response, extends PostListItem */
export interface PostDetail extends PostListItem {
  content: string | null;
  updated_at: string;
  /** 系列名稱（後端 primary_series_info 回傳） */
  series?: string;
  /** 系列內第幾篇（後端 primary_series_info 回傳） */
  series_number?: number;
}

/** Pagination metadata */
export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

/** Posts list API response */
export interface PostsListResponse {
  posts: PostListItem[];
  meta: PaginationMeta;
}

/** Tags list API response */
export interface TagsListResponse {
  tags: Tag[];
}

/** Series schema from API */
export interface Series {
  id: number;
  series_name: string;
  type?: PostType;
}

/** Series list API response */
export interface SeriesListResponse {
  series: Series[];
}

/** Series post item from GET /posts/:slug/series_posts */
export interface SeriesPostItem {
  id: number;
  slug: string;
  title: string;
  type: PostType;
  series_id: number;
  series_number: number;
}

/** Series posts API response */
export interface SeriesPostsResponse {
  series_id: number | null;
  posts: SeriesPostItem[];
}

/** Map frontend category to API post type */
export const categoryToPostType: Record<Category, PostType> = {
  dev: 'DevPost',
  game: 'GamePost',
  film: 'FilmPost',
  book: 'BookPost',
};
