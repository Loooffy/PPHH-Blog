import { PostList } from '@/components/PostList';
import { getPostsByCategory } from '@/lib/api';
import { Category, categoryNames } from '@/lib/theme';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryParam } = await params;
  const category = categoryParam as Category;
  const posts = await getPostsByCategory(category);
  const categoryName = categoryNames[category] || category;

  return (
    <>
      <main className="main-content pt-[160px]">
        <h1>{categoryName}</h1>
        <PostList posts={posts} />
      </main>
    </>
  );
}
