import { BookList } from '@/components/Book/BookList';
import { ThemedMain } from '@/components/layout/ThemedMain';
import { getPostsByCategory } from '@/lib/api';

export default async function BooksPage() {
  const posts = await getPostsByCategory('book');

  return (
    <>
      <ThemedMain category="book">
        <div className="px-6 md:px-8 py-6">
          <div className="max-w-[1200px] mx-auto">
            <BookList posts={posts} />
          </div>
        </div>
      </ThemedMain>
    </>
  );
}
