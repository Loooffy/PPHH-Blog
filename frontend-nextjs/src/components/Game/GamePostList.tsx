'use client';

import type { PostListItem } from '@/types/api';
import { Potta_One } from 'next/font/google';
import { useState } from 'react';
import { GameListItem } from './GameListItem';

const pottaOne = Potta_One({
  subsets: ['latin'],
  weight: '400',
});

interface GamePostListProps {
  posts: PostListItem[];
}

export function GamePostList({ posts }: GamePostListProps) {
  const isEmpty = posts.length === 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 pointer-events-none -translate-y-[6px]">
      <img src="/island.gif" alt="Island" className="absolute w-full h-full object-cover object-top-left left-0" />
      <div className="absolute top-[16%] left-[12%] sm:left-[12%] max-w-[480px] pointer-events-auto text-left">
        <h1 className={`text-white text-4xl text-center leading-[0.9] font-bold tracking-[3px] ${pottaOne.className}`}>
          GAME <br></br> MAKING
        </h1>
        <div className="mt-4 rounded-l p-5 overflow-y-scroll max-h-[30vh] game-post-list-scrollbar">
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
        </div>
      </div>
    </div>
  );
}
