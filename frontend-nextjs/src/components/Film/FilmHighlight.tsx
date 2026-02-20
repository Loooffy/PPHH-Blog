'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import type { PostListItem } from '@/types/api';
import { WideFilmCard } from './FilmListItem';

interface FilmHighlightProps {
  post: PostListItem;
}

export function FilmHighlight({ post }: FilmHighlightProps) {
  const { category, mode } = useTheme();
  const theme = getTheme(category, mode);

  return (
    <WideFilmCard
      post={post}
      category={category || 'film'}
      theme={theme}
    />
  );
}
