import { GamePostList } from '@/components/Game/GamePostList';
import { getPostsByCategory } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

export default async function GamePage() {
  const posts = await getPostsByCategory<Post>('game');

  return (
    <>
      <main className="pt-[160px]>
        <div>
          <GamePostList posts={posts} />
        </div>
      </main>
    </>
  );
}
