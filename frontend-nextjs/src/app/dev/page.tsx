import { DevPostList } from '@/components/Dev/DevPostList';
import { DevTagSeries } from '@/components/Dev/DevTagSeries';
import { ThemedMain } from '@/components/layout/ThemedMain';
import { getPostsByCategory, listSeries, listTags } from '@/lib/api';

interface DevPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DevPage({ searchParams }: DevPageProps) {
  const params = await searchParams;
  const tagId = params.tag_id
    ? parseInt(String(params.tag_id), 10)
    : undefined;
  const seriesId = params.series_id
    ? parseInt(String(params.series_id), 10)
    : undefined;

  const [posts, { tags }, { series }] = await Promise.all([
    getPostsByCategory('dev', { tag_id: tagId, series_id: seriesId }),
    listTags({ type: 'DevPost' }),
    listSeries({ type: 'DevPost' }),
  ]);

  return (
    <>
      <ThemedMain category="dev">
        <div className="px-6 md:px-8 py-6 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-[20%] md:shrink-0 md:max-w-[20%] mr-6 mt-4">
            <DevTagSeries
              series={series}
              tags={tags}
              activeSeriesId={seriesId}
              activeTagId={tagId}
            />
          </div>

          {/* 右側：文章列表 */}
          <div className="flex-1 w-full md:max-w-[75%] md:pr-[60px]">
            <DevPostList posts={posts} />
          </div>
        </div>
      </ThemedMain>
    </>
  );
}
