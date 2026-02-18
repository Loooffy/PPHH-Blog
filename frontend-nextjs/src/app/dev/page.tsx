import { DevPostList } from '@/components/Dev/DevPostList';
import { API_ENDPOINTS } from '@/lib/api';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(API_ENDPOINTS.postsByCategory('dev'), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function DevPage() {
  const posts = await getPosts();

  return (
    <>
      <main className="pt-[160px] bg-background">
        <div className="flex flex-col md:flex-row gap-6 items-start px-6 md:px-8">
          <div className="w-full md:w-[20%] md:shrink-0 md:max-w-[20%] mr-6 mt-3">
            <div className="w-full sticky top-30">
              <div className="flex flex-row gap-1">
                <div className="flex-1"></div>
                <div className="flex-2 text-l text-black text-center font-bold py-1 mb-3 border-b-2 border-gray-400">系列文章</div>
                <div className="flex-1"></div>
              </div>
              <div className="flex flex-col gap-1">
                <Link href="#" className="flex-1 text-xs text-center hover:font-bold py-1">我是長標籤很長的標籤</Link>
                <Link href="#" className="flex-1 text-xs text-center hover:font-bold py-1">如何在速度與理解之間取得平衡</Link>
                <Link href="#" className="flex-1 text-xs text-center hover:font-bold py-1">這是中標籤不短不長</Link>
                <Link href="#" className="flex-1 text-xs text-center hover:font-bold py-1">這個標籤比較短</Link>
                <Link href="#" className="flex-1 text-xs text-center hover:font-bold py-1">有點長又不會太長的標籤</Link>
              </div>
              <div className="flex flex-row gap-1">
                <div className="flex-1"></div>
                <div className="flex-2 text-l text-center font-bold my-6 border-b-2 border-gray-400">標籤</div>
                <div className="flex-1"></div>
              </div>
              <div className="grid grid-col gap-2 justify-items-center">
                <div className="flex flex-row gap-2">
                  <Link href="#" className="text-xs text-center hover:bg-black hover:text-white px-1 py-1 border border-gray-400 rounded w-fit">web</Link>
                  <Link href="#" className="text-xs text-center hover:bg-black hover:text-white px-1 py-1 border border-gray-400 rounded w-fit">react</Link>
                  <Link href="#" className="text-xs text-center hover:bg-black hover:text-white px-1 py-1 border border-gray-400 rounded w-fit">typescript</Link>
                </div>
                <div className="flex flex-row gap-2">
                  <Link href="#" className="text-xs text-center hover:bg-black hover:text-white px-1 py-1 border border-gray-400 rounded w-fit">前端開發</Link>
                  <Link href="#" className="text-xs text-center hover:bg-black hover:text-white px-1 py-1 border border-gray-400 rounded w-fit">nextjs</Link>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：文章列表 */}
          <div className="flex-1 w-full md:max-w-[75%] md:pr-[60px]">
            <DevPostList posts={posts} />
          </div>
        </div>
      </main >
    </>
  );
}
