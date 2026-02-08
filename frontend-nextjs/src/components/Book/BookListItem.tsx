'use client';

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

interface BookListItemProps {
  post: Post;
  category: string;
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
export function BookListItem({ post, category }: BookListItemProps) {
  const [imageError, setImageError] = useState(false);
  const bookTitle = post.book_title || post.title;
  const bookAuthor = post.book_author || '';
  const bookYear = post.book_year || formatYear(post.created_at);
  const coverImageUrl = extractFirstImageUrl(post.content) || defaultCoverImage;
  const displayImage = imageError ? defaultCoverImage : coverImageUrl;

  return (
    <Link
      href={`/${category}/${post.slug || post.id}`}
      className="no-underline ml-4 px-0 w-full text-inherit block group relative"
    >
      {/* 左側垂直線 - 深灰色，在卡片外面 */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-600" />

      {/* 內容區域 */}
      <div className="flex flex-col w-full pt-4 pb-10 pl-4 pr-4 bg-gray-100 ml-6" style={{
        boxShadow: 'inset 3px 4px 4px rgba(0, 0, 0, 0.3)',
      }}>
        {/* 書籍封面 - 帶白色邊框和陰影 */}
        <div className="relative mb-6">
          <div className="relative w-3/4 aspect-3/4" style={{
            border: '2px solid white',
            boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.3)',
          }}>
            <Image
              src={displayImage}
              alt={bookTitle}
              fill
              className="object-cover"
              // sizes="(max-width: 640px) (max-width: 1024px)"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      </div>
      <div className='w-full ml-5'>
        {/* 標題 */}
        <h3 className="text-[32px] mt-2 font-normal text-black mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {bookTitle}
        </h3>

        {/* 作者和年份 */}
        <div className="flex ml-1 justify-between items-start">
          <p className="text-base font-light text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
            {bookAuthor}
          </p>
          <p className="text-base font-bold text-black pr-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {bookYear}
          </p>
        </div>
      </div>
    </Link>
  );
}
