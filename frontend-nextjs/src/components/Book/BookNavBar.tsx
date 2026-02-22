'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Category, categoryNames, categoryRoutes } from '@/lib/theme';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const categories: Category[] = ['dev', 'game', 'film', 'book'];

export const BookNavBar = ({
    fontSize,
    setFontSize,
    backLinkHref,
    backLinkLabel,
}: {
    fontSize: number;
    setFontSize: React.Dispatch<React.SetStateAction<number>>;
    backLinkHref?: string;
    backLinkLabel?: string;
}) => {
    const { setCategory } = useTheme();

    return (
        <div className="h-14 border-b border-stone-200/50 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10 sticky top-0">
            <div className="flex items-center gap-4">
                {backLinkHref && backLinkLabel ? (
                    <Link
                        href={backLinkHref}
                        className="text-primary no-underline hover:text-secondary text-sm font-medium flex items-center gap-1"
                    >
                        <ChevronLeft size={18} />
                        返回 {backLinkLabel}
                    </Link>
                ) : null}
            </div>

            <div className="flex items-center justify-end">
                <div className="flex px-10 py-4 md:px-12">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            href={categoryRoutes[cat]}
                            className="group flex min-w-0 shrink flex-col items-center cursor-pointer text-text-secondary text-xs mx-2 py-1 sm:text-sm sm:px-3 sm:py-1.5 md:px-1 md:py-2 hover:border-b-2 hover:border-primary"
                            onClick={() => setCategory(cat)}
                        >
                            <span>{categoryNames[cat]}</span>
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-stone-100 rounded-full p-1 shadow-inner">
                        <button
                            onClick={() => setFontSize((prev) => Math.max(12, prev - 2))}
                            className="p-1.5 hover:bg-white rounded-full transition-colors text-stone-600 hover:shadow-sm"
                            title="Decrease font size"
                            type="button"
                        >
                            <Minus size={16} />
                        </button>
                        <span className="px-3 text-sm font-mono w-12 text-center text-stone-700">
                            {fontSize}px
                        </span>
                        <button
                            onClick={() => setFontSize((prev) => Math.min(48, prev + 2))}
                            className="p-1.5 hover:bg-white rounded-full transition-colors text-stone-600 hover:shadow-sm"
                            title="Increase font size"
                            type="button"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
