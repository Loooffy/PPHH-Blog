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
  book_year?: string;
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

// 格式化日期為年份
function formatYear(dateString: string): string {
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

// Book List Item 組件
function BookListItem({ post, category }: { post: Post; category: string }) {
  const [imageError, setImageError] = useState(false);
  const bookTitle = post.book_title || post.title;
  const bookAuthor = post.book_author || '';
  const bookYear = post.book_year || formatYear(post.created_at);
  const coverImageUrl = extractFirstImageUrl(post.content) || defaultCoverImage;
  const displayImage = imageError ? defaultCoverImage : coverImageUrl;

  return (
    <Link
      href={`/${category}/${post.slug || post.id}`}
      className="no-underline text-inherit block group"
    >
      <div className="flex gap-4 items-start">
        {/* 左側垂直線 */}
        <div className="shrink-0 w-px bg-black self-stretch mt-2 mb-8" />
        
        {/* 內容區域 */}
        <div className="flex-1 flex flex-col">
          {/* 書籍封面 */}
          <div className="relative mb-6">
            <Image
              src={displayImage}
              alt={bookTitle}
              width={240}
              height={360}
              className="w-full h-auto object-cover"
              style={{
                boxShadow: '4px 11px 4px rgba(0, 0, 0, 0.25)',
              }}
              onError={() => setImageError(true)}
            />
          </div>

          {/* 標題 */}
          <h3 className="text-[32px] font-normal text-black mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            {bookTitle}
          </h3>

          {/* 作者和年份 */}
          <div className="flex justify-between items-center">
            <p className="text-base font-extralight text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
              {bookAuthor}
            </p>
            <p className="text-base font-extrabold text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
              {bookYear}
            </p>
          </div>
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

  return (
    <div className="pt-8 pb-8">
      {/* Book Grid Layout - 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {posts.map((post) => (
          <BookListItem key={post.id} post={post} category={category || 'books'} />
        ))}
      </div>
    </div>
  );
}
