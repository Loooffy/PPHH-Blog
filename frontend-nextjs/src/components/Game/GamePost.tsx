'use client';

import Link from 'next/link';
import { PostNav, type PostNavItem } from '@/components/layout/PostNav';
import type { PostDetail } from '@/types/api';
import { MarkdownContent } from '../layout/MarkdownContent';

interface GamePostProps {
    post: PostDetail;
    prevPost?: PostNavItem | null;
    nextPost?: PostNavItem | null;
    seriesId?: number | null;
}

export function GamePost({ post, prevPost, nextPost, seriesId }: GamePostProps) {
    return (
        <div className="min-h-screen w-full relative bg-slate-1000 text-white font-sans overflow-x-hidden selection:bg-yellow-500 selection:text-black">
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url("/sea-blur.png")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
            </div>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-4 md:py-4 flex flex-col gap-10">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-10 md:flex-row md:items-end">
                        <div className="space-y-2 flex-1">
                            <h1
                                className="text-5xl pb-10 md:text-6xl font-bold tracking-tight text-white drop-shadow-lg"
                            >
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                                <div>
                                    {post.series && seriesId != null ? (
                                        <Link
                                            href={`/game?series_id=${seriesId}`}
                                            className="text-amber-400 hover:text-amber-300 font-medium tracking-wide transition-colors"
                                        >
                                            {post.series} 系列文
                                        </Link>
                                    ) : post.series ? (
                                        <span className="text-amber-400/80 tracking-wide">
                                            {post.series} 系列文
                                        </span>
                                    ) : null}
                                </div>
                                <p className="text-gray-400 tracking-wide shrink-0">
                                    最後更新：{new Date(post.updated_at).toLocaleDateString('zh-TW')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <article className="prose prose-invert prose-lg md:prose-xl max-w-none space-y-8 text-white leading-loose rounded-xl bg-black/10 px-8 pb-8 md:px-16 md:pb-8">
                    <MarkdownContent
                        content={post.content ?? ''}
                        className="[&>p]:mb-3 [&>p]:leading-[1.9] [&>p]:break-inside-avoid-column [&>u]:underline [&>u]:underline-offset-4"
                    />
                    <PostNav
                        prev={prevPost ?? undefined}
                        next={nextPost ?? undefined}
                        basePath="/game"
                    />
                </article>


            </main>
        </div>
    );
}