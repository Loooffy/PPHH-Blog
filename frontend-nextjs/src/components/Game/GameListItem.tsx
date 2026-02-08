'use client';

import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';

const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
});

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface GameListItemProps {
  post: Post;
}

export function GameListItem({ post }: GameListItemProps) {
  const postDate = new Date(post.created_at);
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[postDate.getMonth()];
  const day = postDate.getDate();

  return (
    <div
      className="mt-4 first:mt-0 bg-[#f4e3b2] p-3.5 text-left border-4 border-black rounded-[14px] shadow-[0_6px_0_#000]"
    >
      <h3 className={`m-0 mb-1.5 text-black text-sm ${pressStart2P.className}`}>
        DEV LOG · {month} {day}
      </h3>
      <p className="m-0 leading-normal text-black font-mono text-xs">
        {post.title}
      </p>
      <Link
        href={`/game/${post.slug || post.id}`}
        className="block w-full max-w-[320px] mx-auto mt-3 py-1.5 px-2.5 text-[clamp(10px,1.8vw,14px)] font-bold tracking-[1px] text-white bg-[#c84a42] cursor-pointer select-none border-[3px] border-black rounded-[12px] shadow-[0_6px_0_#000,inset_-2px_-2px_0_rgba(0,0,0,0.25),inset_2px_2px_0_rgba(255,255,255,0.18)] transition-all duration-150 ease-out hover:scale-[1.02] active:translate-y-[4px] active:shadow-[0_2px_0_#000,inset_-2px_-2px_0_rgba(0,0,0,0.25),inset_2px_2px_0_rgba(255,255,255,0.18)] focus-visible:outline-[3px] focus-visible:outline-[#ffd54a] focus-visible:outline-offset-3 text-center no-underline"
        onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
        onMouseLeave={(e) => e.currentTarget.style.filter = ''}
      >
        <span className={pressStart2P.className}>READ MORE</span>
      </Link>
    </div>
  );
}
