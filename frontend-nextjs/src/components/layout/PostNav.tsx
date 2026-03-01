import Link from 'next/link';

export interface PostNavItem {
    id: number;
    slug?: string | null;
    title: string;
}

interface PostNavProps {
    prev?: PostNavItem | null;
    next?: PostNavItem | null;
    basePath: string;
}

export function PostNav({ prev, next, basePath }: PostNavProps) {
    if (!prev && !next) return null;

    /** 依 API spec /posts/{slug} 與前端路由 [category]/[slug] 格式 */
    const href = (item: PostNavItem) => {
        const path = basePath.replace(/\/$/, '');
        const itemSlug = item.slug ?? String(item.id);
        return `${path}/${itemSlug}`;
    };

    return (
        <nav className="flex justify-between items-stretch gap-6 mt-16 mb-8 border-t border-gray-200/50 pt-4 px-2">
            {prev ? (
                <Link
                    href={href(prev)}
                    className="flex-1 flex flex-col items-start text-left no-underline group"
                >
                    <span className="text-m text-gray-400 group-hover:text-white transition-colors">
                        &lt; 上一篇
                    </span>
                    <span className="text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                        {prev.title}
                    </span>
                </Link>
            ) : (
                <div className="flex-1" />
            )}
            {next ? (
                <Link
                    href={href(next)}
                    className="flex-1 flex flex-col items-end text-right no-underline group"
                >
                    <span className="text-m text-gray-400 group-hover:text-white transition-colors">
                        下一篇 &gt;
                    </span>
                    <span className="text-gray-200 group-hover:text-white transition-colors line-clamp-2">
                        {next.title}
                    </span>
                </Link>
            ) : (
                <div className="flex-1" />
            )}
        </nav>
    );
}
