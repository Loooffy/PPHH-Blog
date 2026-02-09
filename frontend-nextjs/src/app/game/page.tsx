import { GamePostList } from '@/components/Game/GamePostList';
import { API_ENDPOINTS } from '@/lib/api';
import { Press_Start_2P } from 'next/font/google';

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
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(API_ENDPOINTS.postsByCategory('遊戲開發'), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function GamePage() {
  const posts = await getPosts();

  return (
    <>
      <main className="pt-[160px] bg-[#c4d4a0]">
        <div>
          <GamePostList posts={posts} />
        </div>
      </main>
    </>
  );
}
