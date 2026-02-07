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

interface GamePostListProps {
  posts: Post[];
}

export function GamePostList({ posts }: GamePostListProps) {
  if (posts.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-5 bg-fixed bg-cover bg-center pointer-events-none -translate-y-[6px]" style={{ backgroundImage: 'url(/island.jpg)' }}>
        <div className="w-full max-w-[500px] p-5 bg-[#2e6f8e]/50 border-[6px] border-[#0e2a38]/50 rounded-[18px] shadow-[0_0_0_6px_#5fa8c6/50,0_12px_0_#0e2a38/50] text-center pointer-events-auto">
          <div className={`text-[#ffd54a] text-[clamp(18px,4vw,32px)] tracking-[2px] mb-4 drop-shadow-[3px_3px_0_#7a5a00] ${pressStart2P.className}`}>
            GAME DEV LOG
          </div>
          <div className={`text-white text-sm ${pressStart2P.className}`}>目前還沒有文章</div>
        </div>
      </div>
    );
  }

  // 計算統計信息
  const totalPosts = posts.length;
  const recentPosts = posts.filter(post => {
    const postDate = new Date(post.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return postDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-5 bg-fixed bg-cover bg-center pointer-events-none -translate-y-[6px]" style={{ backgroundImage: 'url(/island.jpg)' }}>
      <div className="w-full max-w-[500px] p-5 bg-[#2e6f8e]/50 border-[6px] border-[#0e2a38]/50 rounded-[18px] shadow-[0_0_0_6px_#5fa8c6/50,0_12px_0_#0e2a38/50] text-center flex flex-col max-h-[90vh] pointer-events-auto">
        {/* 標題 */}
        <div className={`text-[#ffd54a] text-[clamp(18px,4vw,32px)] tracking-[2px] mb-4 drop-shadow-[3px_3px_0_#7a5a00] shrink-0 ${pressStart2P.className}`}>
          PIXEL DEV LOG
        </div>

        {/* 可滾動內容區域 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* 按鈕區域 */}
          <div className="flex flex-col gap-4 mb-6">
            <button
              className="block w-full max-w-[320px] mx-auto py-1.5 px-2.5 text-[clamp(10px,1.8vw,14px)] font-bold tracking-[1px] text-white bg-[#c84a42] cursor-pointer select-none border-[3px] border-black rounded-[12px] shadow-[0_6px_0_#000,inset_-2px_-2px_0_rgba(0,0,0,0.25),inset_2px_2px_0_rgba(255,255,255,0.18)] transition-all duration-150 ease-out hover:scale-[1.02] active:translate-y-[4px] active:shadow-[0_2px_0_#000,inset_-2px_-2px_0_rgba(0,0,0,0.25),inset_2px_2px_0_rgba(255,255,255,0.18)] focus-visible:outline-[3px] focus-visible:outline-[#ffd54a] focus-visible:outline-offset-3"
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = ''}
            >
              <span className={pressStart2P.className}>FIRST QUEST</span>
            </button>
            <button
              className="block w-full max-w-[320px] mx-auto py-1.5 px-2.5 text-[clamp(10px,1.8vw,14px)] font-bold tracking-[1px] text-white bg-[#c84a42] cursor-pointer select-none border-[3px] border-black rounded-[12px] shadow-[0_6px_0_#000,inset_-2px_-2px_0_rgba(0,0,0,0.25),inset_2px_2px_0_rgba(255,255,255,0.18)] transition-all duration-150 ease-out hover:scale-[1.02] active:translate-y-[4px] active:shadow-[0_2px_0_#000,inset_-2px_-2px_0_rgba(0,0,0,0.25),inset_2px_2px_0_rgba(255,255,255,0.18)] focus-visible:outline-[3px] focus-visible:outline-[#ffd54a] focus-visible:outline-offset-3"
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.15)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = ''}
            >
              <span className={pressStart2P.className}>NEW POST</span>
            </button>
          </div>

          {/* 文章列表 */}
          <div className="flex flex-col gap-3">
            {posts.map((post) => {
              const postDate = new Date(post.created_at);
              const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
              const month = monthNames[postDate.getMonth()];
              const day = postDate.getDate();

              return (
                <div
                  key={post.id}
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
