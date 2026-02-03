'use client';

import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface TechPostListProps {
  posts: Post[];
}

export function TechPostList({ posts }: TechPostListProps) {
  const { category } = useTheme();
  if (posts.length === 0) {
    return (
      <div className="tech-empty-state">
        <p>目前還沒有文章</p>
      </div>
    );
  }

  // 第一篇文章作為精選文章
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  // 提取文章摘要（從 HTML 內容中提取純文字）
  const extractExcerpt = (content: string, maxLength: number = 150): string => {
    const text = content
      .replace(/<[^>]*>/g, '') // 移除 HTML 標籤
      .replace(/\s+/g, ' ') // 將多個空白字元合併為一個
      .trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // 格式化日期
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
  };

  return (
    <div className="flex flex-col w-full pt-6">
      {/* 精選文章 */}
      {featuredPost && (
        <div className="mb-12">
          <Link
            href={`/${category}/${featuredPost.slug || featuredPost.id}`}
            className="block no-underline text-inherit"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-6 w-full">
                <h2 className="text-[2rem] font-bold leading-[1.2] text-text m-0 flex-1 min-w-0">
                  {featuredPost.title}
                </h2>
                <span className="text-sm font-normal text-text-secondary whitespace-nowrap shrink-0">
                  {formatDate(featuredPost.created_at)}
                </span>
              </div>
              <p className="text-base font-normal leading-normal text-text m-0">
                {extractExcerpt(featuredPost.content, 200)}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* 其他文章列表 */}
      <div className="flex flex-col">
        {otherPosts.map((post, index) => (
          <div key={post.id} className="pb-4">
            <Link
              href={`/${category}/${post.slug || post.id}`}
              className="flex items-baseline justify-between gap-6 no-underline text-inherit pb-4"
            >
              <h3 className="text-lg font-bold leading-[1.4] text-text m-0 flex-1">
                {post.title}
              </h3>
              <span className="text-sm font-normal text-text-secondary whitespace-nowrap shrink-0">
                {formatDate(post.created_at)}
              </span>
            </Link>
            {index < otherPosts.length - 1 && (
              <div className="h-px bg-border m-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
