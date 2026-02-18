'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import { FullWidthFilmCard, WideFilmCard } from './FilmListItem';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface FilmListProps {
  posts: Post[];
}

export function FilmList({ posts }: FilmListProps) {
  const { category, mode } = useTheme();
  const theme = getTheme(category || 'film', mode);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: theme.colors.textSecondary }}>
          目前還沒有電影評論
        </p>
      </div>
    );
  }

  // Pair posts for the layout
  const rows = [];
  for (let i = 0; i < posts.length; i += 2) {
    rows.push(posts.slice(i, i + 2));
  }

  return (
    <div
      className="w-full py-4 max-w-[1200px] mx-auto"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="flex flex-col gap-8">
        {rows.map((pair, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 items-stretch md:flex-col md:gap-8">
            {pair[0] && (
              <FullWidthFilmCard
                post={pair[0]}
                category={category || 'film'}
                theme={theme}
              />
            )}
            {pair[1] && (
              <>
                <div className="w-full mt-0 mb-0">
                  <img src="/film-divider-bottom.svg" alt="" className="w-full h-auto" />
                </div>
                <WideFilmCard
                  post={pair[1]}
                  category={category || 'film'}
                  theme={theme}
                />
              </>
            )}
          </div>
        ))}
      </div>

      <div className="w-full mt-8 mb-0">
        <img src="/film-divider-bottom.svg" alt="" className="w-full h-auto" />
      </div>
    </div>
  );
}
