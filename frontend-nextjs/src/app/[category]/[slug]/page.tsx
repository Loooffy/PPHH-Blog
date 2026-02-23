import { BookPost } from '@/components/Book/BookPost';
import { DevPost } from '@/components/Dev/DevPost';
import { FilmPost } from '@/components/Film/FilmPost';
import { GamePost } from '@/components/Game/GamePost';
import { MarkdownContent } from '@/components/layout/MarkdownContent';
import { getPost } from '@/lib/api';
import { categoryNames } from '@/lib/theme';
import Link from 'next/link';

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
        <main className="main-content pt-[160px]">
          <h1>文章不存在</h1>
          <Link href={`/${categoryPath}`}>返回 {categoryName}</Link>
        </main>
      </>
    );
  }

  if (category === 'dev') {
    return (
      <>
        <DevPost post={post} />
      </>
    );
  }

  if (category === 'book') {
    return (
      <main className="main-content pt-[160px]">
        <BookPost
          post={post}
          backLinkHref={`/${categoryPath}`}
          backLinkLabel={categoryName}
        />
      </main>
    );
  }

  if (category === 'film') {
    return (
      <>
        <FilmPost post={post} />
      </>
    );
  }

  if (category === 'game') {
    return (
      <>
        <GamePost post={post} />
      </>
    );
  }

  return (
    <>
      <main className="main-content pt-[160px]" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
          <MarkdownContent content={post.content ?? ''} />
        </article>
      </main>
    </>
  );
}
