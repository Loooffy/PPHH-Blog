'use client';

import { FilmList } from '@/components/Film/FilmList';
import { WideFilmCard } from '@/components/Film/FilmListItem';
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
    const res = await fetch(API_ENDPOINTS.postsByCategory('film'), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default function FilmsPage() {
  const { category, mode } = useTheme();
  const theme = getTheme(category || 'film', mode);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <>
      <main
        className="fixed z-1100 top-[120px] inset-x-0 bottom-0 overflow-y-auto transition-colors duration-300"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div className="px-6 md:px-8 py-6">
          <FilmList posts={posts} />
          {posts.length > 0 && (
            <div className="mt-8 max-w-[1200px] mx-auto">
              <WideFilmCard
                post={posts[0]}
                category={category || 'film'}
                theme={theme}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
