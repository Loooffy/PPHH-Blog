import { PostList } from '@/components/PostList';
import { API_ENDPOINTS } from '@/lib/api';
import { Category, categoryNames } from '@/lib/theme';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

async function getPosts(category: string): Promise<Post[]> {
  try {
    const res = await fetch(
      API_ENDPOINTS.postsByCategory(category),
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryParam } = await params;
  const category = categoryParam as Category;
  const posts = await getPosts(category);
  const categoryName = categoryNames[category] || category;

  return (
    <>
      <main className="main-content">
        <h1>{categoryName}</h1>
        <PostList posts={posts} />
      </main>
    </>
  );
}
