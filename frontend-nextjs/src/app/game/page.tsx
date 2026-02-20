import { GamePostList } from '@/components/Game/GamePostList';
import { getPostsByCategory } from '@/lib/api';

export default async function GamePage() {
  const posts = await getPostsByCategory('game');

  return (
    <>
      <main className="pt-[160px]">
        <div>
          <GamePostList posts={posts} />
        </div>
      </main>
    </>
  );
}
