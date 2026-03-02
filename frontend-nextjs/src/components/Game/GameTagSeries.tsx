import type { Series } from '@/types/api';
import Link from 'next/link';

interface GameSeriesProps {
    series: Series[];
    activeSeriesId?: number | null;
}

export function GameTagSeries({
    series,
    activeSeriesId = null,
}: GameSeriesProps) {
    return (
        <div className="flex flex-col gap-1 text-white text-m text-center">
            <div className="flex gap-1">
                <Link
                    href="/game"
                    className={`flex-1 hover:font-bold py-1 ${activeSeriesId == null
                        ? 'bg-white/20 text-[#faf785]'
                        : 'opacity-50'
                        }`}
                >
                    所有文章
                </Link>
            </div>
            <div className="flex flex-col gap-1">
                {series.length === 0 ? (
                    <span></span>
                ) : (
                    series.map((s) => (
                        <Link
                            key={s.id}
                            href={`/game?type=GamePost&series_id=${s.id}`}
                            className={`flex-1 hover:font-bold py-1 ${activeSeriesId === s.id
                                ? 'bg-white/20 text-[#faf785]'
                                : 'opacity-50'
                                }`}
                        >
                            {s.series_name}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}