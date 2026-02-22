'use client';

import { MarkdownContent } from '@/components/layout/MarkdownContent';
import type { PostDetail } from '@/types/api';
import { useEffect, useRef, useState } from 'react';

interface DevPostProps {
    post: PostDetail & { series?: string; series_number?: number };
}

// 從 Markdown 或 HTML content 中提取第一張圖片 URL
function extractFirstImageUrl(content: string): string | null {
    if (!content) return null;
    const mdImgMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdImgMatch?.[1]) return mdImgMatch[1].trim();
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1]) return imgMatch[1];
    const imgTagMatch = content.match(/<img[^>]+>/i);
    if (imgTagMatch) {
        const srcMatch = imgTagMatch[0].match(/src=["']([^"']+)["']/i);
        if (srcMatch?.[1]) return srcMatch[1];
    }
    return null;
}

// 從內容中移除第一張圖片（若與特色圖重複則不重複顯示）
function removeFirstImageFromContent(content: string): string {
    if (!content) return '';
    const mdReplaced = content.replace(/!\[[^\]]*\]\([^)]+\)\n?/, '');
    if (mdReplaced !== content) return mdReplaced.trim();
    return content.replace(/<img[^>]*>/i, '');
}

interface TocItem {
    id: string;
    text: string;
    level: number;
    element: HTMLElement;
}

export function DevPost({ post }: DevPostProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [tocItems, setTocItems] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [highlightedCategory, setHighlightedCategory] = useState<string>('');
    const [imageError, setImageError] = useState(false);

    const coverImageUrl = post.image_url ?? extractFirstImageUrl(post.content ?? '') ?? null;
    const displayImage = imageError ? null : coverImageUrl;
    const contentToRender =
        post.image_url && coverImageUrl === post.image_url
            ? post.content ?? ''
            : removeFirstImageFromContent(post.content ?? '');

    const author = post.author ?? '';
    const director = post.director ?? '';
    const year =
        post.year != null ? String(post.year) : new Date(post.created_at).getFullYear();

    // 格式化日期
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    };

    // 從內容中提取標題並生成目錄
    useEffect(() => {
        if (!contentRef.current) return;

        // 使用 setTimeout 確保 DOM 完全渲染後再執行
        const timer = setTimeout(() => {
            if (!contentRef.current) return;

            const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const items: TocItem[] = [];

            headings.forEach((heading) => {
                const level = parseInt(heading.tagName.charAt(1));
                const text = heading.textContent || '';

                // 生成 ID（如果沒有）
                let id = heading.id?.trim();
                if (!id || id === '') {
                    // 使用文字內容生成 slug
                    const baseSlug = text
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .trim();

                    // 確保 ID 唯一性
                    let uniqueId = baseSlug || `heading-${items.length}`;
                    let counter = 0;
                    while (items.some(item => item.id === uniqueId) || document.getElementById(uniqueId)) {
                        counter++;
                        uniqueId = `${baseSlug}-${counter}`;
                    }

                    id = uniqueId;
                    heading.id = id;
                    heading.setAttribute('id', id);
                } else {
                    // 確保元素有 id 屬性
                    if (!heading.hasAttribute('id')) {
                        heading.setAttribute('id', id);
                    }
                }

                items.push({
                    id,
                    text,
                    level,
                    element: heading as HTMLElement,
                });
            });

            setTocItems(items);

            // 設置第一個類別（如果有）
            if (items.length > 0) {
                // 嘗試從第一個 h2 或 h3 的父級或上下文推斷類別
                // 這裡簡化處理，可以根據實際需求調整
                setHighlightedCategory('基礎概念');
            }
        }, 100); // 給 DOM 一些時間來完全渲染

        return () => clearTimeout(timer);
    }, [contentToRender]);

    // 使用 Intersection Observer 追蹤當前閱讀的章節
    useEffect(() => {
        if (tocItems.length === 0) return;
        if (!contentRef.current) return;

        // 找到滾動容器（main 元素）
        const scrollContainer = contentRef.current.closest('main');

        const observerOptions = {
            root: scrollContainer,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            // 找到最接近頂部的可見標題
            const visibleEntries = entries.filter((entry) => entry.isIntersecting);
            if (visibleEntries.length > 0) {
                // 選擇最接近頂部的
                const sorted = visibleEntries.sort(
                    (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
                );
                setActiveId(sorted[0].target.id);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        tocItems.forEach((item) => {
            if (item.element) {
                observer.observe(item.element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [tocItems]);

    // 處理目錄點擊
    const handleTocClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // 更新 URL hash
            window.history.pushState(null, '', `#${id}`);

            // 找到滾動容器（main 元素）
            const scrollContainer = contentRef.current?.closest('main');

            if (scrollContainer) {
                // 計算目標位置，考慮固定導航欄的高度（160px）
                const containerRect = scrollContainer.getBoundingClientRect();
                const elementRect = element.getBoundingClientRect();
                const offsetPosition = elementRect.top - containerRect.top + scrollContainer.scrollTop - 20; // 20px 額外間距

                // 平滑滾動到目標位置
                scrollContainer.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            } else {
                // 如果找不到滾動容器，使用 window 作為後備
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - 160;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }

            setActiveId(id);
        }
    };

    // 處理 URL hash 變化，支援直接透過 URL 跳轉
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1); // 移除 # 符號
            if (hash) {
                // 等待 DOM 完全渲染後再滾動
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element && contentRef.current) {
                        // 找到滾動容器（main 元素）
                        const scrollContainer = contentRef.current.closest('main');

                        if (scrollContainer) {
                            // 計算目標位置，考慮固定導航欄的高度（160px）
                            const containerRect = scrollContainer.getBoundingClientRect();
                            const elementRect = element.getBoundingClientRect();
                            const offsetPosition = elementRect.top - containerRect.top + scrollContainer.scrollTop - 20; // 20px 額外間距

                            scrollContainer.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth',
                            });
                        } else {
                            // 如果找不到滾動容器，使用 window 作為後備
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - 160;

                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth',
                            });
                        }
                        setActiveId(hash);
                    }
                }, 200); // 增加延遲時間確保 DOM 完全渲染
            }
        };

        // 初始載入時檢查 hash
        handleHashChange();

        // 監聽 hash 變化
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [tocItems]);

    return (
        <div className="flex flex-col md:flex-row gap-16 w-full px-10 md:px-40">
            {/* 左側內容區域 */}
            <div className="flex-1 min-w-0">
                {/* 封面圖 */}
                {displayImage && (
                    <div className="w-full overflow-hidden rounded-lg mb-8">
                        <img
                            src={displayImage}
                            alt={post.title}
                            className="w-full object-cover"
                            onError={() => setImageError(true)}
                        />
                    </div>
                )}

                {/* 系列信息 */}
                {post.series && post.series_number && (
                    <div className="mb-4">
                        <span className="text-sm text-text">
                            本文為「
                            <span className="underline">{post.series}</span>
                            」系列{' '}
                            <span
                                className="inline-block px-2 py-0.5 rounded-full text-xs"
                                style={{ backgroundColor: 'var(--color-border)' }}
                            >
                                第{post.series_number}篇
                            </span>
                        </span>
                    </div>
                )}

                {/* 標題 */}
                <h1 className="text-[2.5rem] font-bold leading-[1.2] text-text mb-4 mt-0">
                    {post.title}
                </h1>

                {/* 元資訊：作者、導演、年份靠左，最後更新靠右 */}
                <div className="flex justify-between items-baseline gap-4 border-b pb-4 text-sm text-text-secondary mb-8">
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                        {author && (
                            <span>
                                作者：<span className="text-text">{author}</span>
                            </span>
                        )}
                        {director && (
                            <span>
                                導演：<span className="text-text">{director}</span>
                            </span>
                        )}
                        {year && (
                            <span>
                                年份：<span className="text-text">{year}</span>
                            </span>
                        )}
                    </div>
                    {post.updated_at && (
                        <span className="shrink-0">最後更新：{formatDate(post.updated_at)}</span>
                    )}
                </div>

                {/* 文章內容 */}
                <div ref={contentRef} className="prose prose-lg max-w-none">
                    <MarkdownContent content={contentToRender} />
                </div>
            </div>

            {/* 右側目錄 */}
            {tocItems.length > 0 && (
                <aside
                    className="dev-post-toc w-full md:w-2/9 shrink-0 md:sticky md:top-0 self-start max-h-[calc(100vh-160px)] overflow-y-auto pr-2"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'var(--color-border) transparent',
                    }}
                >

                    {/* 高亮的類別 */}
                    {highlightedCategory && (
                        <div className="mb-4">
                            <span
                                className="inline-block px-2 py-1 rounded-full text-xs text-text"
                                style={{ backgroundColor: 'var(--color-border)' }}
                            >
                                {highlightedCategory}
                            </span>
                        </div>
                    )}

                    {/* 目錄標題 */}
                    <h2 className="text-lg font-semibold text-text mb-4 mt-0">目錄</h2>

                    {/* 目錄列表 */}
                    <nav className="flex flex-col gap-1">
                        {tocItems.map((item) => {
                            const isActive = activeId === item.id;
                            const indentLevel = Math.max(0, item.level - 2); // h2 開始縮進

                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => handleTocClick(item.id, e)}
                                    className={`text-left text-sm py-1.5 px-2 rounded transition-colors duration-200no-underline cursor-pointer block ${isActive ? 'font-semibold' : 'font-normal'}`}
                                    style={{
                                        paddingLeft: `${8 + indentLevel * 16}px`,
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = 'var(--color-text)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.color = 'var(--color-text-secondary)';
                                        }
                                    }}
                                >
                                    {item.text}
                                </a>
                            );
                        })}
                    </nav>
                </aside>
            )}
        </div>
    );
}
