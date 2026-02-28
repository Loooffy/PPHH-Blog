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
        <div className="flex items-start justify-between gap-4 w-full">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h2 className="text-[2rem] font-bold leading-[1.2] text-text">
              {post.title}
            </h2>
            {post.description && (
              <p className="text-[1.1rem] font-normal text-text-secondary line-clamp-2">
                {post.description}
              </p>
            )}
          </div>
          <span className="text-sm font-normal text-text-secondary whitespace-nowrap shrink-0 pt-1">
            {formatDate(post.created_at)}
          </span>
        </div>
      </Link >
    </div >
  );
}
