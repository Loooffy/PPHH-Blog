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
  return (
    <div className="w-full sticky top-30">
      <div className="flex flex-row gap-1">
        <div className="flex-1"></div>
        <div className="flex-2 text-l text-center font-bold py-1 mb-3 border-b-2 border-gray-400">
          所有文章
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex flex-col gap-1 mb-3">
        <Link
          href="/dev"
          className="flex-1 text-xs text-center hover:font-bold py-1"
        >
          全部
        </Link>
      </div>
      <div className="flex flex-row gap-1">
        <div className="flex-1"></div>
        <div className="flex-2 text-l text-center font-bold py-1 mb-3 border-b-2 border-gray-400">
          系列文章
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="flex flex-col gap-1">
        {series.length === 0 ? (
          <span className="text-xs text-center text-gray-500 py-1">
            尚無系列
          </span>
        ) : (
          series.map((s) => (
            <Link
              key={s.id}
              href={`/dev?type=DevPost&series_id=${s.id}`}
              className="flex-1 text-xs text-center hover:font-bold py-1"
            >
              {s.series_name}
            </Link>
          ))
        )}
      </div>
      <div className="flex flex-row gap-1">
        <div className="flex-1"></div>
        <div className="flex-2 text-l text-center font-bold my-6 py-1 border-b-2 border-gray-400">
          標籤
        </div>
        <div className="flex-1"></div>
      </div>
      <div className="grid grid-col gap-2 justify-items-center">
        {tags.length === 0 ? (
          <span className="text-xs text-center text-gray-500 py-1">
            尚無標籤
          </span>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center">
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
