'use client';

import { useTheme } from '@/contexts/ThemeContext';
import type { PostListItem } from '@/types/api';
import { BookListItem } from './BookListItem';

interface BookListProps {
  posts: PostListItem[];
}

export function BookList({ posts }: BookListProps) {
  const { category } = useTheme();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">
          目前還沒有書評
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Book Grid Layout - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {posts.map((post) => (
          <BookListItem key={post.id} post={post} category={category || 'book'} />
        ))}
      </div>
    </div>
  );
}
