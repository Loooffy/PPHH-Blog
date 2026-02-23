'use client';

import type { PostDetail } from '@/types/api';
import { MarkdownContent } from '../layout/MarkdownContent';

interface GamaPostProps {
    post: PostDetail;
}

export function GamePost({ post }: GamaPostProps) {
    return (
        <div className="min-h-screen w-full relative bg-slate-1000 text-white font-sans overflow-x-hidden selection:bg-yellow-500 selection:text-black">
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `url("/island.png")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            </div>

            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-24 flex flex-col gap-10">
                <div className="flex flex-col">
                    <div className="flex flex-col gap-10 md:flex-row md:items-end">
                        <div className="space-y-2">
                            <h1
                                className="text-5xl pb-10 md:text-6xl font-bold tracking-tight text-white drop-shadow-lg"
                            >
                                {post.title}
                            </h1>
                            <p
                                className="text-sm text-gray-300 font-mono tracking-wide"
                            >
                                最後更新： {new Date(post.updated_at).toLocaleDateString('zh-TW')}
                            </p>
                        </div>

                        {/* Tags */}
                        <div
                            className="flex items-start text-yellow-500 md:items-end gap-2"
                        >
                            {post.tags?.map((tag) => (
                                <span key={tag.id} className="px-3 py-0.5 border rounded-sm bg-surface text-yellow-500 text-sm transition-all duration-200 hover:bg-yellow-500/20 hover:scale-105 hover:border-yellow-500/50 cursor-pointer">{tag.name}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <article className="prose prose-invert prose-lg md:prose-xl max-w-none space-y-8 text-gray-100/90 leading-loose">
                    <MarkdownContent
                        content={post.content ?? ''}
                        className="[&>p]:mb-3 [&>p]:leading-[1.5] [&>p]:break-inside-avoid-column [&>u]:underline [&>u]:underline-offset-4"
                    />
                </article>
            </main>
        </div>
    );
}