'use client';

import { TrixContent } from '@/components/TrixContent';
import Image from 'next/image';
import { useState } from 'react';

interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    created_at: string;
    updated_at?: string;
    category?: string;
    book_title?: string;
    book_author?: string;
    book_year?: string;
}

interface BookPostProps {
    post: Post;
}

const defaultCoverImage =
    'https://www.bookrep.com.tw/sites/default/files/products/img/%EF%BC%88%E5%B7%A6%E5%B2%B8%EF%BC%890GGK0261%E4%BE%9D%E6%B5%B7%E4%B9%8B%E4%BA%BA_%E6%9B%B8%E5%B0%81_%E5%B9%B3%E9%9D%A2.jpg';

// 從 HTML content 中提取第一張圖片 URL
function extractFirstImageUrl(content: string): string | null {
    if (!content) return null;

    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
        return imgMatch[1];
    }

    const imgTagMatch = content.match(/<img[^>]+>/i);
    if (imgTagMatch) {
        const srcMatch = imgTagMatch[0].match(/src=["']([^"']+)["']/i);
        if (srcMatch && srcMatch[1]) {
            return srcMatch[1];
        }
    }

    return null;
}

// 格式化日期
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}/${month}/${day}`;
}

// 從內容中移除圖片標籤（因為我們會單獨顯示書封）
function removeImagesFromContent(content: string): string {
    if (!content) return '';
    return content.replace(/<img[^>]*>/gi, '');
}

export function BookPost({ post }: BookPostProps) {
    const [imageError, setImageError] = useState(false);
    const bookTitle = post.book_title || post.title;
    const bookAuthor = post.book_author || '';
    const bookYear = post.book_year || '';
    const coverImageUrl = extractFirstImageUrl(post.content) || defaultCoverImage;
    const displayImage = imageError ? defaultCoverImage : coverImageUrl;
    const contentWithoutImages = removeImagesFromContent(post.content);
    const updatedAt = post.updated_at || post.created_at;

    return (
        <div className="flex justify-center bg-[#f2f2f2] p-12 font-['PingFang_TC','Microsoft_JhengHei',sans-serif]">
            {/* article-wrapper: 多欄佈局、自動平衡 */}
            <div className="max-w-[1000px] columns-1 md:columns-2 md:gap-x-[60px] text-justify [column-fill:balance]">
                {/* 書封：適應欄寬、避免被截斷 */}
                <div className="break-inside-avoid mb-[25px]">
                    <div className="relative block w-full max-w-[260px] aspect-3/4">
                        <Image
                            src={displayImage}
                            alt={`${bookTitle} 書封`}
                            fill
                            className="object-cover drop-shadow-[10px_10px_20px_rgba(0,0,0,0.15)]"
                            onError={() => setImageError(true)}
                        />
                    </div>
                </div>

                {/* 標題 */}
                <h1 className="break-inside-avoid text-[3.5rem] my-2.5 font-semibold">
                    {bookTitle}
                </h1>

                {/* 元資訊 */}
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

                {/* 內容：段落儘量完整、避免被切到對面欄 */}
                <TrixContent
                    content={contentWithoutImages}
                    className="[&>p]:mb-6 [&>p]:leading-[1.9] [&>p]:text-[#333] [&>p]:break-inside-avoid-column [&>u]:underline [&>u]:underline-offset-4"
                />
            </div>
        </div>
    );
}
