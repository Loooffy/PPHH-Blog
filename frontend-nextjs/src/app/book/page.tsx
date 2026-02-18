import { ThemedMain } from '@/components/layout/ThemedMain';
import { BookList } from '@/components/Book/BookList';
import { API_ENDPOINTS } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  layout_type?: string;
  book_title?: string;
  book_author?: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(API_ENDPOINTS.postsByCategory('book'), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BooksPage() {
  const posts = await getPosts();

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
