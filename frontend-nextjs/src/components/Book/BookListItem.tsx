'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { PostListItem } from '@/types/api';

interface BookListItemProps {
  post: PostListItem;
  category: string;
}

const defaultCoverImage =
  'https://www.bookrep.com.tw/sites/default/files/products/img/%EF%BC%88%E5%B7%A6%E5%B2%B8%EF%BC%890GGK0261%E4%BE%9D%E6%B5%B7%E4%B9%8B%E4%BA%BA_%E6%9B%B8%E5%B0%81_%E5%B9%B3%E9%9D%A2.jpg';

// 格式化日期為年份
function formatYear(dateString: string): string {
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

// Book List Item 組件 - PostListItem 無 content，封面使用預設圖
export function BookListItem({ post, category }: BookListItemProps) {
  const [imageError, setImageError] = useState(false);
  const bookTitle = post.title;
  const bookAuthor = post.author ?? '';
  const bookYear = post.year != null ? String(post.year) : formatYear(post.created_at);
  const coverImageUrl = defaultCoverImage;
  const showImage = !imageError;

  return (
    <Link
      href={`/${category}/${post.slug || post.id}`}
      className="no-underline ml-4 px-0 w-full text-inherit block group relative"
    >
      {/* 左側垂直線 - 深灰色 */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-400" />

      {/* 內容區域 */}
      <div className="flex flex-col w-full pt-4 pb-10 pl-4 pr-4 bg-gray-100 ml-6" style={{
        boxShadow: 'inset 3px 4px 4px rgba(0, 0, 0, 0.3)',
      }}>
        {/* 書籍封面 */}
        <div className="relative mb-6">
          <div className="relative w-3/4 aspect-3/4" style={{
            boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.3)',
          }}>
            {showImage ? (
              <Image
                src={coverImageUrl}
                alt={bookTitle}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200" />
            )}
          </div>
        </div>
      </div>
      <div className='w-full ml-5'>
        {/* 標題 */}
        <h3 className="text-[24px] mt-2 font-normal text-black mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
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
