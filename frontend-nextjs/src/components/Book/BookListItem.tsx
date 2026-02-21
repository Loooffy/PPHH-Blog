'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PostListItem } from '@/types/api';

interface BookListItemProps {
  post: PostListItem;
  category: string;
}

// 格式化日期為年份
function formatYear(dateString: string): string {
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

// Book List Item 組件 - 封面使用 post.image_url，若無 image_url 則不顯示圖片
export function BookListItem({ post, category }: BookListItemProps) {
  const [imageError, setImageError] = useState(false);
  const bookTitle = post.title;
  const bookAuthor = post.author ?? '';
  const bookYear = post.year != null ? String(post.year) : formatYear(post.created_at);

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
        {/* 書籍封面 - 僅在有 image_url 時顯示，載入失敗則隱藏 */}
        {post.image_url && !imageError && (
          <div className="relative mb-6">
            <div className="relative w-3/4 aspect-3/4 overflow-hidden" style={{
              boxShadow: '3px 4px 4px rgba(0, 0, 0, 0.3)',
            }}>
              <img
                src={post.image_url}
                alt={bookTitle}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        )}
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
