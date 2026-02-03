'use client';

import { TrixContent } from '@/components/TrixContent';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const { category, mode } = useTheme();
  const theme = getTheme(category, mode);

  const getLayoutClass = () => {
    switch (theme.layout) {
      case 'grid':
        return 'layout-grid';
      case 'masonry':
        return 'layout-masonry';
      case 'single':
        return 'layout-single';
      case 'card':
        return 'layout-card';
      default:
        return 'layout-grid';
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">
          目前還沒有文章
        </p>
      </div>
    );
  }

  const getLayoutClasses = () => {
    switch (theme.layout) {
      case 'grid':
        return 'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6';
      case 'masonry':
        return 'columns-3 gap-6 md:columns-2 max-md:columns-1 [&>article]:break-inside-avoid [&>article]:mb-6';
      case 'single':
        return 'max-w-[680px] mx-auto';
      case 'card':
        return 'grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6';
      default:
        return 'grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6';
    }
  };

  return (
    <div className={getLayoutClasses()}>
      {posts.map((post) => (
        <article key={post.id} className="bg-surface border-0 rounded-none p-6 transition-all duration-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:-translate-y-0.5">
          <Link
            href={`/${category}/${post.slug || post.id}`}
            className="no-underline text-inherit"
          >
            <h3 className="font-heading text-text text-[1.4rem] font-semibold mb-3">{post.title}</h3>
            <TrixContent content={post.content || ''} className="mt-4" />
            <div className="mt-4 text-sm text-text-secondary">
              發佈於：{new Date(post.created_at).toLocaleDateString('zh-TW')}
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
