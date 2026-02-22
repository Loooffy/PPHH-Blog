'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BookBottomBar } from './BookBottomBar';
import { BookNavBar } from './BookNavBar';

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
    backLinkHref?: string;
    backLinkLabel?: string;
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

const BookMetadata = ({
    title,
    author,
    year,
    coverImageUrl,
    updatedAt,
}: {
    title: string;
    author: string;
    year: string;
    coverImageUrl: string | null;
    updatedAt: string;
}) => (
    <div className="break-after-column break-inside-avoid h-full flex items-center justify-center min-h-[60vh]">
        <div className="bg-stone-100 p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center w-full h-full max-h-[80vh] shadow-sm relative">
            {coverImageUrl ? (
                <img
                    src={coverImageUrl}
                    className="w-[60%] md:w-[40%] max-w-[180px] md:max-w-[200px] h-auto object-cover shadow-lg rounded !m-0 mb-6 md:mb-0"
                    alt={`${title} 書封`}
                    referrerPolicy="no-referrer"
                />
            ) : null}
            <div className="flex-1 flex flex-col justify-center h-full relative w-full text-center md:text-left">
                <h1 className="text-4xl md:text-5xl !leading-[1.1] !mt-0 !mb-6 !border-b-0 !pb-0 font-bold text-stone-900">
                    {title}
                </h1>
                <div className="text-lg text-stone-600 space-y-2">
                    {author ? <p className="!mb-2">作者：{author}</p> : null}
                    {year ? <p className="!mb-2">初版：{year}</p> : null}
                </div>
                <p className="text-sm text-stone-400 !m-0 mt-8 md:mt-0 absolute bottom-0 right-0">
                    最後更新：{formatDate(updatedAt)}
                </p>
            </div>
        </div>
    </div>
);

export function BookPost({ post, backLinkHref, backLinkLabel }: BookPostProps) {
    const bookTitle = post.title;
    const bookAuthor = getAuthorName(post.author);
    const bookYear = post.year != null ? String(post.year) : '';
    const coverImageUrl = post.image_url ?? null;
    const updatedAt = post.updated_at || post.created_at;
    const content = post.content ?? '';

    const [fontSize, setFontSize] = useState(14);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const readerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (dimensions.width > 0) {
            document.documentElement.style.setProperty('--page-width', `${dimensions.width}px`);
            document.documentElement.style.setProperty('--page-height', `${dimensions.height}px`);
        }
    }, [dimensions]);

    const calculatePages = useCallback(() => {
        if (readerRef.current) {
            const scrollWidth = readerRef.current.scrollWidth;
            const clientWidth = readerRef.current.clientWidth;
            const clientHeight = readerRef.current.clientHeight;

            if (clientWidth > 0) {
                setDimensions({ width: clientWidth, height: clientHeight });
                const total = Math.max(1, Math.round(scrollWidth / clientWidth));
                setTotalPages(total);
                const currentScroll = readerRef.current.scrollLeft;
                const page = Math.round(currentScroll / clientWidth);
                setCurrentPage(page);
            }
        }
    }, []);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(() => {
                calculatePages();
            });
        });

        if (readerRef.current) {
            resizeObserver.observe(readerRef.current);
        }

        calculatePages();

        return () => resizeObserver.disconnect();
    }, [calculatePages, content]);

    useEffect(() => {
        const timer = setTimeout(calculatePages, 150);
        return () => clearTimeout(timer);
    }, [content, fontSize, calculatePages]);

    useEffect(() => {
        if (readerRef.current && dimensions.width > 0) {
            readerRef.current.scrollTo({
                left: currentPage * dimensions.width,
                behavior: 'auto',
            });
        }
    }, [dimensions.width]);

    const goToPage = (page: number) => {
        if (readerRef.current) {
            const clientWidth = readerRef.current.clientWidth;
            const targetPage = Math.max(0, Math.min(page, totalPages - 1));
            readerRef.current.scrollTo({
                left: targetPage * clientWidth,
                behavior: 'smooth',
            });
            setCurrentPage(targetPage);
        }
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextPage();
            if (e.key === 'ArrowLeft') prevPage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, totalPages]);

    const handleScroll = () => {
        if (readerRef.current) {
            const clientWidth = readerRef.current.clientWidth;
            const scrollLeft = readerRef.current.scrollLeft;
            const page = Math.round(scrollLeft / clientWidth);
            if (page !== currentPage) {
                setCurrentPage(page);
            }
        }
    };

    const handleViewportClick = (e: React.MouseEvent) => {
        const width = window.innerWidth;
        const x = e.clientX;
        if (x < width / 3) {
            prevPage();
        } else if (x > (width * 2) / 3) {
            nextPage();
        }
    };

    return (
        <div className="fixed inset-0 bg-[#fdfaf6] text-stone-800 flex flex-col overflow-hidden font-serif select-none">
            <BookNavBar
                fontSize={fontSize}
                setFontSize={setFontSize}
                backLinkHref={backLinkHref}
                backLinkLabel={backLinkLabel}
            />

            <div
                className="flex-1 relative cursor-pointer overflow-hidden"
                onClick={handleViewportClick}
            >
                <div
                    ref={readerRef}
                    onScroll={handleScroll}
                    className="absolute inset-0 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth hide-scrollbar"
                >
                    <div
                        ref={contentRef}
                        className="h-full w-fit min-w-full columns-1 md:columns-2 gap-0 column-fill-auto py-16 md:py-20 box-border block overflow-wrap-break-word hyphens-auto"
                        style={{ height: 'var(--page-height, 100vh)' }}
                    >
                        <div
                            className={`
                contents
                prose prose-stone max-w-none
                prose-p:text-justify prose-p:mb-6 prose-p:break-inside-avoid
                prose-headings:break-inside-avoid prose-headings:break-after-avoid prose-headings:mt-8 prose-headings:mb-4 prose-headings:text-stone-900
                prose-h1:border-b prose-h1:border-stone-200 prose-h1:pb-2
                prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto prose-img:max-h-[60vh] prose-img:object-contain prose-img:my-8 prose-img:break-inside-avoid
                [&>*]:px-8 md:[&>*]:px-16 [&>*]:box-border [&>*]:snap-start [&>*]:max-w-full
              `}
                            style={{ fontSize: `${fontSize}px` }}
                        >
                            <BookMetadata
                                title={bookTitle}
                                author={bookAuthor}
                                year={bookYear}
                                coverImageUrl={coverImageUrl}
                                updatedAt={updatedAt}
                            />
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-y-0 left-0 w-16 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none group">
                    <div className="bg-black/5 group-hover:bg-black/10 p-3 rounded-full backdrop-blur-sm transition-colors">
                        <ChevronLeft size={24} className="text-stone-600" />
                    </div>
                </div>
                <div className="absolute inset-y-0 right-0 w-16 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none group">
                    <div className="bg-black/5 group-hover:bg-black/10 p-3 rounded-full backdrop-blur-sm transition-colors">
                        <ChevronRight size={24} className="text-stone-600" />
                    </div>
                </div>
            </div>

            <BookBottomBar currentPage={currentPage} totalPages={totalPages} />
        </div>
    );
}
