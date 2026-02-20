'use client';

import Link from 'next/link';
import type { PostListItem } from '@/types/api';

interface DevListItemProps {
  post: PostListItem;
  category: string;
  isLast: boolean;
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
}

export function DevListItem({ post, category, isLast }: DevListItemProps) {
  return (
    <div className="pb-4">
      <Link
        href={`/${category}/${post.slug || post.id}`}
        className="flex items-baseline justify-between gap-6 no-underline text-inherit pb-4"
      >
        <h3 className="text-xl font-bold leading-[1.4] text-text m-0 flex-1 pb-5 border-b">
          {post.title}
        </h3>
        <span className="text-sm font-normal text-text-secondary whitespace-nowrap shrink-0">
          {formatDate(post.created_at)}
        </span>
      </Link>
      {!isLast && (
        <div className="h-px bg-border m-0" />
      )}
    </div>
  );
}
