'use client';

import { useTheme } from '@/contexts/ThemeContext';
import type { Category } from '@/lib/theme';
import { getTheme } from '@/lib/theme';
import { useEffect } from 'react';

interface ThemedMainProps {
  children: React.ReactNode;
  category?: Category;
}

export function ThemedMain({ children, category }: ThemedMainProps) {
  const { category: contextCategory, mode, setCategory } = useTheme();
  const resolvedCategory = category ?? contextCategory ?? 'film';

  // 同步頁面 category 到 context（確保 book 列表等頁面正確套用主題）
  useEffect(() => {
    if (category) setCategory(category);
  }, [category, setCategory]);

  // film 固定 dark、book 固定 light、其他使用 mode
  const effectiveMode =
    resolvedCategory === 'film'
      ? 'dark'
      : resolvedCategory === 'book'
        ? 'light'
        : mode;
  const theme = getTheme(resolvedCategory, effectiveMode);

  return (
    <main
      className="fixed z-1100 top-[84px] inset-x-0 bottom-0 overflow-y-auto transition-colors"
      style={{ backgroundColor: theme.colors.background }}
    >
      {children}
    </main>
  );
}
