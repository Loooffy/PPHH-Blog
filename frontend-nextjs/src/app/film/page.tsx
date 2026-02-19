import { FilmHighlight } from '@/components/Film/FilmHighlight';
import { FilmList } from '@/components/Film/FilmList';
import { ThemedMain } from '@/components/layout/ThemedMain';
import { getPostsByCategory } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default async function FilmsPage() {
  const posts = await getPostsByCategory<Post>('film');

  return (
    <>
      <ThemedMain category="film">
        <div className="px-6 md:px-8 py-6">
          <FilmList posts={posts} />
          {posts.length > 0 && (
            <div className="mt-8 max-w-[1200px] mx-auto">
              <FilmHighlight post={posts[0]} />
            </div>
          )}
        </div>
      </ThemedMain>
    </>
  );
}
