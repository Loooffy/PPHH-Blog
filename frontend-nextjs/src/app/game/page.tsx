import { GamePostList } from '@/components/Game/GamePostList';
import { GameTagSeries } from '@/components/Game/GameTagSeries';
import { getPostsByCategory, listSeries } from '@/lib/api';
import { Potta_One } from 'next/font/google';

const pottaOne = Potta_One({
  subsets: ['latin'],
  weight: '400',
});

interface GamePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GamePage({ searchParams }: GamePageProps) {
  const params = await searchParams;
  const seriesId = params.series_id
    ? parseInt(String(params.series_id), 10)
    : undefined;

  const [posts, { series }] = await Promise.all([
    getPostsByCategory('game', { series_id: seriesId }),
    listSeries({ type: 'GamePost' }),
  ]);

  return (
    <div className="bg-[url(/island.gif)] min-h-screen bg-cover bg-center">
      <div className="flex flex-col">
        <div className="flex gap-4 ml-32 mt-20">
          <div className="flex flex-col gap-4">
            <h1 className={`text-4xl font-bold tracking-[3px] invisible ${pottaOne.className}`} aria-hidden>
              GAME <br />
              GAME
            </h1>
            <GameTagSeries series={series} activeSeriesId={seriesId} />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className={`text-white text-center text-4xl font-bold tracking-[3px] ${pottaOne.className}`}>
              GAME <br /> DEVLOG
            </h1>
            <GamePostList posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
}