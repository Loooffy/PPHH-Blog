import { TrixContent } from '@/components/TrixContent';
import { API_ENDPOINTS } from '@/lib/api';
import { categoryNames } from '@/lib/theme';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(API_ENDPOINTS.post(slug), {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const post = await getPost(slug);
  const categoryName = categoryNames[category as keyof typeof categoryNames] || category;
  const categoryPath = category || '/';

  if (!post) {
    return (
      <>
        <main className="main-content">
          <h1>文章不存在</h1>
          <Link href={`/${categoryPath}`}>返回 {categoryName}</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="main-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link
          href={`/${categoryPath}`}
          className="inline-block mb-8 text-primary no-underline"
        >
          ← 返回 {categoryName}
        </Link>
        <article>
          <h1>{post.title}</h1>
          <div className="mb-8 text-sm text-text-secondary">
            發佈於：{new Date(post.created_at).toLocaleDateString('zh-TW')}
          </div>
          <TrixContent content={post.content || ''} />
        </article>
      </main>
    </>
  );
}
