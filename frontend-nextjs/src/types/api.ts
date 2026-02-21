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

/** Map frontend category to API post type */
export const categoryToPostType: Record<Category, PostType> = {
  dev: 'DevPost',
  game: 'GamePost',
  film: 'FilmPost',
  book: 'BookPost',
};
