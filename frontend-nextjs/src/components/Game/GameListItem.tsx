'use client';

import Link from 'next/link';
import type { PostListItem } from '@/types/api';

interface GameListItemProps {
  post?: PostListItem;
  isHighlighted?: boolean;
  isEmpty?: boolean;
  onMouseEnter?: () => void;
}

export function GameListItem({ post, isHighlighted = false, isEmpty = false, onMouseEnter }: GameListItemProps) {
  if (isEmpty) {
    return (
      <p className="text-white text-sm">目前還沒有文章</p>
    );
  }

  if (!post) return null;

  return (
    <Link
      href={`/game/${post.slug || post.id}`}
      className={`block text-center text-m no-underline transition-colors hover:opacity-90 ${isHighlighted ? 'text-yellow-200' : 'text-white'}`}
      onMouseEnter={onMouseEnter}
    >
      {post.title}
    </Link>
  );
}
