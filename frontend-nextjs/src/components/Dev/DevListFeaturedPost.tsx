'use client';

import type { PostListItem } from '@/types/api';
import Link from 'next/link';

interface DevFeaturedPostProps {
  post: PostListItem;
  category: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
}

export function DevListFeaturedPost({ post, category }: DevFeaturedPostProps) {
  return (
    <div className="mb-12">
      <Link
        href={`/${category}/${post.slug || post.id}`}
        className="block no-underline text-inherit"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-1 w-full">
            <div className="flex flex-row w-4/5">
              <h2 className="text-[2rem] font-bold leading-[1.2] text-text mb-1 flex-1 min-w-0">
                {post.title}
              </h2>
              {post.description && (
                <div className="w-4/5 mt-4">
                  <span className="w-full text-[1.1rem] font-normal text-text-secondary shrink-0">
                    {post.description}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm font-normal text-text-secondary whitespace-nowrap shrink-0">
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </Link >
    </div >
  );
}
