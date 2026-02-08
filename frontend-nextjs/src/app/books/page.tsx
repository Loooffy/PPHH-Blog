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
    const res = await fetch(API_ENDPOINTS.postsByCategory('書評'), {
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
      <main className="fixed top-[160px] left-0 right-0 bottom-0 overflow-y-auto z-[1001] bg-background">
        <div className="max-w-[1200px] mx-auto">
          <BookList posts={posts} />
        </div>
      </main>
    </>
  );
}
