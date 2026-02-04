'use client';

import { MovieList } from '@/components/MovieList';
import { useTheme } from '@/contexts/ThemeContext';
import { API_ENDPOINTS } from '@/lib/api';
import { getTheme } from '@/lib/theme';
import { useEffect, useState } from 'react';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(API_ENDPOINTS.postsByCategory('影評'), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default function MoviesPage() {
  const { category, mode } = useTheme();
  const theme = getTheme(category || 'movie', mode);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <>
      <main
        className="fixed top-[160px] left-0 right-0 bottom-0 overflow-y-auto z-[1001] transition-colors duration-300"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="px-6 md:px-8 py-6">
          <MovieList posts={posts} />
        </div>
      </main>
    </>
  );
}
