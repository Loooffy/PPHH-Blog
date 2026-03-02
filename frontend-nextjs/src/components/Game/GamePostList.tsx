'use client';

import type { PostListItem } from '@/types/api';
import { useState } from 'react';
import { GameListItem } from './GameListItem';

interface GamePostListProps {
  posts: PostListItem[];
}

export function GamePostList({ posts }: GamePostListProps) {
  const isEmpty = posts.length === 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex">
      <div className="min-w-[20vw] max-h-[40vh]">
        {isEmpty ? (
          <GameListItem isEmpty />
        ) : (
          <div
            className="flex flex-col gap-2.5 bg-white/20 p-6 overflow-y-scroll max-h-[30vh] game-post-list-scrollbar"
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
      </div>
    </div>
  );
}
