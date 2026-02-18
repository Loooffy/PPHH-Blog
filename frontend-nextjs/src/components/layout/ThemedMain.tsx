'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import type { Category } from '@/lib/theme';

interface ThemedMainProps {
  children: React.ReactNode;
  category?: Category;
}

export function ThemedMain({ children, category }: ThemedMainProps) {
  const { category: contextCategory, mode } = useTheme();
  const theme = getTheme(category ?? contextCategory ?? 'film', mode);

  return (
    <main
      className="fixed z-1100 top-[120px] inset-x-0 bottom-0 overflow-y-auto transition-colors duration-300"
      style={{ backgroundColor: theme.colors.background }}
    >
      {children}
    </main>
  );
}
