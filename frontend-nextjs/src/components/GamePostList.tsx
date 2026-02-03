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
      <div className="flex flex-row gap-0 min-h-screen relative bg-[#c4d4a0] p-5 box-border shadow-[inset_0_0_0_4px_#6a6a6a,inset_0_0_0_8px_#4a4a4a]">
        <div className="w-[200px] min-w-[200px] max-w-[200px] shrink-0 bg-[#4a4a4a] p-4 flex flex-col gap-3 shadow-[inset_0_0_0_2px_#6a6a6a] order-1">
          <div className="bg-[#c4d4a0] border-[3px] border-[#2a2a2a] p-2 shadow-[inset_0_0_0_1px_#6a6a6a,2px_2px_0_0_#2a2a2a]">
            <div className={`text-[10px] text-[#2a2a2a] text-center mb-1 tracking-[0.5px] ${pressStart2P.className}`}>POSTS</div>
            <div className={`text-base text-[#2a2a2a] text-center py-1 px-2 bg-[#e8f0d8] border-2 border-[#2a2a2a] shadow-[inset_0_0_0_1px_#6a6a6a] ${pressStart2P.className}`}>0</div>
          </div>
        </div>
        <div className="flex-1 min-w-0 bg-[#c4d4a0] p-4 overflow-y-auto border-l-4 border-[#2a2a2a] shadow-[inset_0_0_0_2px_#6a6a6a] order-2">
          <div className="text-center py-10 px-5 text-[#2a2a2a]">
            <p className={`text-sm ${pressStart2P.className}`}>目前還沒有文章</p>
          </div>
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
    <div className="flex flex-col md:flex-row gap-0 min-h-[60vh] relative bg-[#c4d4a0] p-3 md:p-5 box-border mt-8">
      {/* 左側 Sidebar */}
      <div className="w-full md:w-[200px] md:min-w-[200px] md:max-w-[200px] md:shrink-0 bg-[#4a4a4a] p-4 flex flex-row md:flex-col flex-wrap md:flex-nowrap gap-3 border-b-4 md:border-b-0 border-r-0 border-[#2a2a2a] shadow-[inset_0_0_0_2px_#6a6a6a] order-1">
        <div className="bg-[#c4d4a0] p-2 shadow-[inset_0_0_0_1px_#6a6a6a,2px_2px_0_0_#2a2a2a] flex-1 md:flex-none min-w-[120px] rounded-lg">
          <div className={`text-[10px] text-[#2a2a2a] text-center mb-1 tracking-[0.5px] ${pressStart2P.className}`}>POSTS</div>
          <div className={`text-base text-[#2a2a2a] text-center py-1 px-2 bg-[#e8f0d8] border-2 border-[#888888] shadow-[inset_0_0_0_1px_#6a6a6a] ${pressStart2P.className}`}>{totalPosts}</div>
        </div>

        <div className="bg-[#c4d4a0] p-2 shadow-[inset_0_0_0_1px_#6a6a6a,2px_2px_0_0_#2a2a2a] flex-1 md:flex-none min-w-[120px] rounded-lg">
          <div className={`text-[10px] text-[#2a2a2a] text-center mb-1 tracking-[0.5px] ${pressStart2P.className}`}>RECENT</div>
          <div className={`text-base text-[#2a2a2a] text-center py-1 px-2 bg-[#e8f0d8] border-2 border-[#888888] shadow-[inset_0_0_0_1px_#6a6a6a] ${pressStart2P.className}`}>{recentPosts}</div>
        </div>

        <div className="bg-[#c4d4a0] p-2 shadow-[inset_0_0_0_1px_#6a6a6a,2px_2px_0_0_#2a2a2a] flex-1 md:flex-none min-w-[120px] rounded-lg">
          <div className={`text-[10px] text-[#2a2a2a] text-center mb-1 tracking-[0.5px] ${pressStart2P.className}`}>CATEGORY</div>
          <div className={`text-base text-[#2a2a2a] text-center py-1 px-2 bg-[#e8f0d8] border-2 border-[#888888] shadow-[inset_0_0_0_1px_#6a6a6a] ${pressStart2P.className}`}>GAME</div>
        </div>
      </div>

      {/* 右側主區域 - 文章列表 */}
      <div className="flex-1 min-w-0 bg-[#c4d4a0] p-4 overflow-y-auto border-t-4 md:border-t-0 md:border-l-4 border-l-0 border-[#2a2a2a] shadow-[inset_0_0_0_2px_#6a6a6a] order-2">
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/game/${post.slug || post.id}`}
              className="block bg-[#e8f0d8] border-[3px] border-[#2a2a2a] py-3 px-4 no-underline text-[#2a2a2a] transition-all duration-150 shadow-[inset_0_0_0_1px_#6a6a6a,2px_2px_0_0_#2a2a2a] hover:bg-[#e8f0d8] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[inset_0_0_0_1px_#6a6a6a,4px_4px_0_0_#2a2a2a] active:translate-x-0 active:translate-y-0 active:shadow-[inset_0_0_0_1px_#6a6a6a,2px_2px_0_0_#2a2a2a] relative"
            >
              <div className={`text-[11px] md:text-xs text-[#2a2a2a] mb-1 leading-snug break-words ${pressStart2P.className}`}>{post.title}</div>
              <div className={`text-[8px] text-[#4a4a4a] opacity-80 ${pressStart2P.className}`}>
                {new Date(post.created_at).toLocaleDateString('zh-TW')}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
