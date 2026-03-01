import { BookPost } from '@/components/Book/BookPost';
import { DevPost } from '@/components/Dev/DevPost';
import { FilmPost } from '@/components/Film/FilmPost';
import { GamePost } from '@/components/Game/GamePost';
import { MarkdownContent } from '@/components/layout/MarkdownContent';
import { ThemedMain } from '@/components/layout/ThemedMain';
import { getPost, getPostsByCategory, getSeriesPosts } from '@/lib/api';
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
      <ThemedMain category="film">
        <FilmPost post={post} />
      </ThemedMain>
    );
  }

  if (category === 'game') {
    const { posts: seriesPosts } = await getSeriesPosts(slug);
    const gamePosts = await getPostsByCategory('game');

    let prevPost = null;
    let nextPost = null;

    if (seriesPosts.length > 0) {
      const currentIndex = seriesPosts.findIndex((p) => p.slug === post.slug || p.id === post.id);
      if (currentIndex >= 0) {
        prevPost = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
        nextPost = currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null;
      }
    }

    if (prevPost === null && nextPost === null) {
      const currentIndex = gamePosts.findIndex((p) => p.slug === post.slug || p.id === post.id);
      prevPost = currentIndex >= 0 && currentIndex < gamePosts.length - 1
        ? gamePosts[currentIndex + 1]
        : null;
      nextPost = currentIndex > 0 ? gamePosts[currentIndex - 1] : null;
    }

    return (
      <ThemedMain category="game">
        <GamePost post={post} prevPost={prevPost} nextPost={nextPost} />
      </ThemedMain>
    );
  }

  return (
    <>
      <main className="main-content pt-[160px]" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
