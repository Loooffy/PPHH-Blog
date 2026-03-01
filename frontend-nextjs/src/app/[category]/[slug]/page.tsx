import { BookPost } from '@/components/Book/BookPost';
import { DevPost } from '@/components/Dev/DevPost';
import { FilmPost } from '@/components/Film/FilmPost';
import { GamePost } from '@/components/Game/GamePost';
import { MarkdownContent } from '@/components/layout/MarkdownContent';
import type { PostNavItem } from '@/components/layout/PostNav';
import { ThemedMain } from '@/components/layout/ThemedMain';
import { getPost, getPostsByCategory, getSeriesPosts } from '@/lib/api';
import { categoryNames } from '@/lib/theme';
import type { PostDetail, PostListItem, SeriesPostItem } from '@/types/api';
import Link from 'next/link';

/** 根據系列或分類列表計算上一篇／下一篇（回傳 PostNav 所需的最小欄位） */
function getPrevNextPosts(
  post: PostDetail,
  seriesPosts: SeriesPostItem[],
  categoryPosts: PostListItem[]
): { prevPost: PostNavItem | null; nextPost: PostNavItem | null } {
  const findIndex = (list: { slug?: string; id?: number }[]) =>
    list.findIndex((p) => p.slug === post.slug || p.id === post.id);

  // 有系列文章且當前文章在系列中：依系列順序決定 prev/next，不 fallback
  if (seriesPosts.length > 0) {
    const currentIndex = findIndex(seriesPosts);
    if (currentIndex >= 0) {
      return {
        prevPost: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
        nextPost: currentIndex < seriesPosts.length - 1 ? seriesPosts[currentIndex + 1] : null,
      };
    }
  }

  // Fallback：依分類列表決定 prev/next
  const currentIndex = findIndex(categoryPosts);
  return {
    prevPost:
      currentIndex >= 0 && currentIndex < categoryPosts.length - 1
        ? categoryPosts[currentIndex + 1]
        : null,
    nextPost: currentIndex > 0 ? categoryPosts[currentIndex - 1] : null,
  };
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
        <main className="main-content pt-[160px]">
          <h1>文章不存在</h1>
          <Link href={`/${categoryPath}`}>返回 {categoryName}</Link>
        </main>
      </>
    );
  }

  if (category === 'dev') {
    const { posts: seriesPosts } = await getSeriesPosts(slug);
    const devPosts = await getPostsByCategory('dev');
    const { prevPost, nextPost } = getPrevNextPosts(post, seriesPosts, devPosts);

    return (
      <>
        <DevPost post={post} prevPost={prevPost} nextPost={nextPost} />
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
    const { prevPost, nextPost } = getPrevNextPosts(post, seriesPosts, gamePosts);

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
