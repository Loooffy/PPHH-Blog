'use client';

import { MarkdownContent } from '@/components/MarkdownContent';
interface BookPostProps {
    post: {
        id: number;
        title: string;
        content: string | null;
        image_url: string | null;
        created_at: string;
        updated_at?: string;
        author?: string | null;
        year?: number | null;
    };
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
}

function getAuthorName(author: BookPostProps['post']['author']): string {
    return author ? String(author) : '';
}

export function BookPost({ post }: BookPostProps) {
    const bookTitle = post.title;
    const bookAuthor = getAuthorName(post.author);
    const bookYear = post.year != null ? String(post.year) : '';
    const coverImageUrl = post.image_url ?? null;
    const updatedAt = post.updated_at || post.created_at;

    return (
        <div className="flex justify-center bg-[#f2f2f2] p-12 font-['PingFang_TC','Microsoft_JhengHei',sans-serif]">
            {/* article-wrapper: 多欄佈局、自動平衡 */}
            <div className="max-w-[1000px] columns-1 md:columns-2 md:gap-x-[60px] text-justify [column-fill:balance]">
                {/* 書封：適應欄寬、避免被截斷 */}
                <div className="break-inside-avoid mb-[25px]">
                    <div className="relative block w-full max-w-[260px]">
                        <img
                            src={coverImageUrl ?? ''}
                            alt={`${bookTitle} 書封`}
                            className="object-cover drop-shadow-[10px_10px_20px_rgba(0,0,0,0.15)]"
                        />
                    </div>
                </div>

                <h1 className="break-inside-avoid text-[3.5rem] my-2.5 font-semibold">
                    {bookTitle}
                </h1>

                <div className="break-inside-avoid flex justify-between border-b border-[#ddd] pb-2.5 mb-8 text-sm text-[#777]">
                    <span>
                        作者：{bookAuthor}
                        {bookYear && (
                            <>
                                <br />
                                年份：{bookYear}
                            </>
                        )}
                    </span>
                    <span className="self-end">最後更新：{formatDate(updatedAt)}</span>
                </div>

                <MarkdownContent
                    content={post.content ?? ''}
                    className="[&>p]:mb-6 [&>p]:leading-[1.9] [&>p]:text-[#333] [&>p]:break-inside-avoid-column [&>u]:underline [&>u]:underline-offset-4"
                />
            </div>
        </div>
    );
}
