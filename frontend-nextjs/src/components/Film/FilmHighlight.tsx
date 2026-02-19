'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import { WideFilmCard } from './FilmListItem';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface FilmHighlightProps {
  post: Post;
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
