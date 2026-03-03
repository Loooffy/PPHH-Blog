import { Tag as TagComponent } from '@/components/atomic/Tag';
import type { Series, Tag } from '@/types/api';
import Link from 'next/link';

interface DevTagSeriesProps {
  series: Series[];
  tags: Tag[];
  activeSeriesId?: number | null;
  activeTagId?: number | null;
}

/** 開發文章側邊欄：系列與標籤列表 */
export function DevTagSeries({
  series,
  tags,
  activeSeriesId = null,
  activeTagId = null,
}: DevTagSeriesProps) {
  const isAllActive = !activeSeriesId && !activeTagId;

  return (
    <div>
      <div className="flex flex-row gap-1">
        <div className="flex-1"></div>
        <div className="flex-2 text-l text-center font-bold py-1 mb-3 border-b-2 border-gray-400">
          全部
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex flex-col gap-1 mb-2">
        <Link
          href="/dev"
          className={`flex-1 text-s text-center py-1 rounded transition-colors ${isAllActive
            ? 'font-bold text-primary bg-primary/10 underline'
            : 'hover:font-bold'
            }`}
        >
          所有文章
        </Link>
      </div>
      <div className="flex flex-row gap-1 mt-8">
        <div className="flex-1"></div>
        <div className="flex-2 text-l text-center font-bold py-1 mb-3 border-b-2 border-gray-400">
          系列
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex flex-col gap-1">
        {series.length === 0 ? (
          <span className="text-s text-center text-gray-500 py-1">
            尚無系列
          </span>
        ) : (
          series.map((s) => {
            const isActive = activeSeriesId === s.id;
            return (
              <Link
                key={s.id}
                href={`/dev?type=DevPost&series_id=${s.id}`}
                className={`flex-1 text-s text-center py-1 rounded transition-colors ${isActive
                  ? 'font-bold text-primary bg-primary/10 underline'
                  : 'hover:font-bold'
                  }`}
              >
                {s.series_name}
              </Link>
            );
          })
        )}
      </div>
      <div className="flex flex-row gap-1 mt-8">
        <div className="flex-1"></div>
        <div className="flex-2 text-l text-center font-bold py-1 border-b-2 border-gray-400">
          標籤
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="grid grid-col gap-2 justify-items-center">
        {tags.length === 0 ? (
          <span className="text-s text-center text-gray-500 py-1">
            尚無標籤
          </span>
        ) : (
          <div className="flex flex-wrap mt-4 gap-2 justify-center">
            {tags.map((t) => (
              <TagComponent
                key={t.id}
                href={`/dev?type=DevPost&tag_id=${t.id}`}
                active={activeTagId === t.id}
              >
                {t.name}
              </TagComponent>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
