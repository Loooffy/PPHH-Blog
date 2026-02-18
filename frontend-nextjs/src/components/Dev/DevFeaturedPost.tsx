'use client';

import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface DevFeaturedPostProps {
  post: Post;
  category: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}, ${date.getFullYear()}`;
}

export function DevFeaturedPost({ post, category }: DevFeaturedPostProps) {
  return (
    <div className="mb-12">
      <Link
        href={`/${category}/${post.slug || post.id}`}
        className="block no-underline text-inherit"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-6 w-full">
            <div flex-row>
              <h2 className="text-[2rem] font-bold leading-[1.2] text-text mb-1 flex-1 min-w-0">
                {post.title}
              </h2>
              <div className="w-4/5 mt-4">
                <span className="w-1/2 text-[1.1rem] font-normal text-text-secondary shrink-0">
                  How do you balance development speed with maintaining code comprehension when using AI for coding?
                  How do you balance development speed with maintaining code comprehension
                  when using AI for coding?
                </span>
              </div>
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
