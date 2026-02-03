'use client';

import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
  layout_type?: string;
  book_title?: string;
  book_author?: string;
}

interface BookListProps {
  posts: Post[];
}

const defaultCoverImage =
  'https://www.bookrep.com.tw/sites/default/files/products/img/%EF%BC%88%E5%B7%A6%E5%B2%B8%EF%BC%890GGK0261%E4%BE%9D%E6%B5%B7%E4%B9%8B%E4%BA%BA_%E6%9B%B8%E5%B0%81_%E5%B9%B3%E9%9D%A2.jpg';

// 從 HTML content 中提取第一張圖片 URL
function extractFirstImageUrl(content: string): string | null {
  if (!content) return null;

  // 使用正則表達式尋找 img 標籤
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  // 也檢查是否有完整的 img 標籤
  const imgTagMatch = content.match(/<img[^>]+>/i);
  if (imgTagMatch) {
    const srcMatch = imgTagMatch[0].match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  return null;
}

// 從 content 中提取純文字（移除 HTML 標籤）
function extractText(content: string, maxLength?: number): string {
  if (!content) return '';
  let text = content.replace(/<[^>]*>/g, '').trim();
  if (maxLength && text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  return text;
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
}

// Featured Book 組件
function FeaturedBook({ post, category }: { post: Post; category: string }) {
  const [imageError, setImageError] = useState(false);
  const coverImageUrl = extractFirstImageUrl(post.content) || defaultCoverImage;
  const contentText = extractText(post.content, 150);
  const displayImage = imageError ? defaultCoverImage : coverImageUrl;
  const bookTitle = post.book_title || post.title;

  return (
    <Link
      href={`/${category}/${post.slug || post.id}`}
      className="no-underline text-inherit block mb-12"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* 左側：書籍封面 */}
        <div className="w-full md:w-auto shrink-0">
          <div className="relative w-full md:w-[300px] aspect-3/4 bg-surface shadow-sm flex flex-col p-5">
            <div className="flex-1 flex items-center justify-center">
              <Image
                src={displayImage}
                alt={bookTitle}
                width={300}
                height={450}
                className="max-w-full max-h-full w-auto h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 300px"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="mt-4 border border-border bg-background px-4 py-3 text-center">
              <h3 className="text-base md:text-lg font-semibold text-text leading-snug font-heading">
                {bookTitle}
              </h3>
              {post.book_author && (
                <p className="text-sm text-text-secondary font-body mt-1">
                  {post.book_author}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 右側：標題和摘要 */}
        <div className="flex-1 flex flex-col justify-start pt-2">
          {contentText && (
            <p className="text-base md:text-lg text-text-secondary leading-relaxed font-body">
              {contentText}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Book List Item 組件
function BookListItem({ post, category }: { post: Post; category: string }) {
  const [imageError, setImageError] = useState(false);
  const bookTitle = post.book_title || post.title;
  const coverImageUrl = extractFirstImageUrl(post.content) || defaultCoverImage;
  const displayImage = imageError ? defaultCoverImage : coverImageUrl;
  const fallbackMeta = formatDate(post.created_at);

  return (
    <Link
      href={`/${category}/${post.slug || post.id}`}
      className="no-underline text-inherit block hover:-translate-y-0.5 transition-transform"
    >
      <div className="relative w-full aspect-3/4 bg-surface shadow-sm flex flex-col p-5">
        <div className="flex-1 flex items-center justify-center">
          <Image
            src={displayImage}
            alt={bookTitle}
            width={240}
            height={360}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            sizes="(max-width: 768px) 100vw, 240px"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="mt-4 border border-border bg-background px-4 py-3 text-center">
          <h3 className="text-base md:text-lg font-semibold text-text leading-snug font-heading">
            {bookTitle}
          </h3>
          <p className="text-sm text-text-secondary font-body mt-1">
            {post.book_author || fallbackMeta}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function BookList({ posts }: BookListProps) {
  const { category } = useTheme();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">
          目前還沒有書評
        </p>
      </div>
    );
  }

  // 第一個 post 作為 Featured，其餘作為列表
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="pt-2 pb-4">
      {/* Featured Book Section */}
      {featuredPost && (
        <FeaturedBook post={featuredPost} category={category || 'books'} />
      )}

      {/* Book List Section */}
      {remainingPosts.length > 0 && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {remainingPosts.map((post) => (
            <BookListItem key={post.id} post={post} category={category || 'books'} />
          ))}
        </div>
      )}
    </div>
  );
}
