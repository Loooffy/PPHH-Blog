'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import type { PostListItem } from '@/types/api';
import { FullWidthFilmCard, NarrowFilmCard, WideFilmCard } from './FilmListItem';

interface FilmListProps {
  posts: PostListItem[];
}

function sortByNewest(posts: PostListItem[]): PostListItem[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.published_at ?? a.created_at).getTime();
    const dateB = new Date(b.published_at ?? b.created_at).getTime();
    return dateB - dateA;
  });
}

export function FilmList({ posts }: FilmListProps) {
  const { category, mode } = useTheme();
  const theme = getTheme(category, mode);

  const sortedPosts = sortByNewest(posts);
  const firstPost = sortedPosts[0];
  const restPosts = sortedPosts
    .slice(1)
    .filter((p) => !firstPost || p.id !== firstPost.id);

  console.log(firstPost);
  console.log(restPosts);

  const rowsOf3: PostListItem[][] = [];
  for (let i = 0; i < restPosts.length; i += 3) {
    rowsOf3.push(restPosts.slice(i, i + 3));
  }

  const cardProps = { category: category || 'film', theme };

  return (
    <div
      className="w-full max-w-[1200px] mx-auto"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="flex flex-col gap-8">
        {/* Row 1: FullWidthFilmCard for the newest article */}
        {firstPost && (
          <div className="flex gap-4 items-stretch">
            <FullWidthFilmCard post={firstPost} {...cardProps} />
          </div>
        )}

        {rowsOf3.map((triple, rowIndex) => (
          <div key={rowIndex} className="flex flex-col gap-8">
            <div className="w-full mt-0 mb-0">
              <img src="/film-divider-bottom.svg" alt="" className="w-full h-auto" />
            </div>
            <div className="flex flex-col gap-6 items-stretch md:flex-row md:gap-6">
              {rowIndex % 2 === 0 ? (
                <>
                  {triple[0] && <WideFilmCard post={triple[0]} {...cardProps} />}
                  {triple[1] && <NarrowFilmCard post={triple[1]} {...cardProps} />}
                  {triple[2] && <NarrowFilmCard post={triple[2]} {...cardProps} />}
                </>
              ) : (
                <>
                  {triple[0] && <NarrowFilmCard post={triple[0]} {...cardProps} />}
                  {triple[1] && <NarrowFilmCard post={triple[1]} {...cardProps} />}
                  {triple[2] && <WideFilmCard post={triple[2]} {...cardProps} />}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full mt-8 mb-0">
        <img src="/film-divider-bottom.svg" alt="" className="w-full h-auto" />
      </div>
    </div>
  );
}
