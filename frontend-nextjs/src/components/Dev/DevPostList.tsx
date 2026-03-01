'use client';

import { useTheme } from '@/contexts/ThemeContext';
import type { PostListItem } from '@/types/api';
import { DevListItem } from './DevListItem';

interface DevPostListProps {
  posts: PostListItem[];
}

export function DevPostList({ posts }: DevPostListProps) {
  const { category } = useTheme();
  if (posts.length === 0) {
    return (
      <div className="dev-empty-state">
        <p>目前還沒有文章</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {posts.map((post, index) => (
        <DevListItem key={post.id} post={post} category={category} isLast={index === posts.length - 1} />
      ))}
    </div>
  );
}
