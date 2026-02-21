import { FilmList } from '@/components/Film/FilmList';
import { ThemedMain } from '@/components/layout/ThemedMain';
import { getPostsByCategory } from '@/lib/api';

export default async function FilmsPage() {
  const posts = await getPostsByCategory('film');

  return (
    <>
      <ThemedMain category="film">
        <div className="px-6 md:px-8 py-6">
          <FilmList posts={posts} />
        </div>
      </ThemedMain>
    </>
  );
}
