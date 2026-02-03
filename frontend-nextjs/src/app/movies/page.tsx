import { MovieList } from '@/components/MovieList';
import { API_ENDPOINTS } from '@/lib/api';

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

export default async function MoviesPage() {
  const posts = await getPosts();

  return (
    <>
      <main className="fixed top-[160px] left-0 right-0 bottom-0 overflow-y-auto z-[1001] bg-background">
        <div className="px-6 md:px-8 py-6">
          <MovieList posts={posts} />
        </div>
      </main>
    </>
  );
}
