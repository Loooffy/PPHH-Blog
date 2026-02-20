'use client';

import { useState } from 'react';
import type { PostListItem } from '@/types/api';
import { GameListItem } from './GameListItem';
import { GamePostListLayout } from './GamePostListLayout';

interface GamePostListProps {
  posts: PostListItem[];
}

export function GamePostList({ posts }: GamePostListProps) {
  const isEmpty = posts.length === 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <GamePostListLayout
      contentClassName={
        'mt-2 rounded-l p-5 overflow-y-auto max-h-[70vh]'
      }
    >
      {isEmpty ? (
        <GameListItem isEmpty />
      ) : (
        <div
          className="flex flex-col gap-2.5"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {posts.map((post, index) => (
            <GameListItem
              key={post.id}
              post={post}
              isHighlighted={hoveredIndex !== null ? index === hoveredIndex : index === 0}
              onMouseEnter={() => setHoveredIndex(index)}
            />
          ))}
        </div>
      )}
    </GamePostListLayout>
  );
}
