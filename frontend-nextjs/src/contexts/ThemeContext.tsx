'use client';

import { Category, ThemeMode, getTheme } from '@/lib/theme';
import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface ThemeContextType {
  category: Category;
  mode: ThemeMode;
  setCategory: (category: Category) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 應用主題到 DOM
function applyTheme(theme: ReturnType<typeof getTheme>) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;

  // 使用 setProperty 設置每個 CSS 變數，避免覆蓋其他樣式
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);
}

// 初始化函數：在組件渲染前設置 CSS 變數
function initializeTheme() {
  if (typeof window === 'undefined') return { category: 'tech' as Category, mode: 'light' as ThemeMode };

  const savedCategory = localStorage.getItem('blog-category') as Category;
  const savedMode = localStorage.getItem('blog-theme-mode') as ThemeMode;

  let category: Category = 'tech';
  let mode: ThemeMode = 'light';

  if (savedCategory && ['tech', 'game', 'movie', 'book'].includes(savedCategory)) {
    category = savedCategory;
  }

  if (savedMode && ['light', 'dark'].includes(savedMode)) {
    mode = savedMode;
  } else {
    // 檢查系統偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mode = prefersDark ? 'dark' : 'light';
  }

  // 立即設置 CSS 變數，避免閃爍
  const theme = getTheme(category, mode);
  applyTheme(theme);
  document.documentElement.setAttribute('data-theme', `${category}-${mode}`);

  return { category, mode };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [category, setCategory] = useState<Category>('tech');
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);
  // 使用 ref 保存最新的值，以便在 toggleMode 中訪問
  const categoryRef = useRef<Category>(category);
  const mountedRef = useRef<boolean>(mounted);

  // 在組件掛載前初始化主題（使用 useLayoutEffect 確保同步執行）
  useLayoutEffect(() => {
    const { category: initCategory, mode: initMode } = initializeTheme();
    setCategory(initCategory);
    categoryRef.current = initCategory;
    setMode(initMode);
    setMounted(true);
    mountedRef.current = true;
  }, []);

  // 更新 ref 值
  useEffect(() => {
    categoryRef.current = category;
  }, [category]);

  useEffect(() => {
    mountedRef.current = mounted;
  }, [mounted]);

  // 儲存偏好設定
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('blog-category', category);
  }, [category, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('blog-theme-mode', mode);
  }, [mode, mounted]);

  // 更新 CSS 變數
  useEffect(() => {
    if (!mounted) return;
    const theme = getTheme(category, mode);
    applyTheme(theme);
    document.documentElement.setAttribute('data-theme', `${category}-${mode}`);
  }, [category, mode, mounted]);

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // 立即應用新主題，不等待 useEffect
      // 使用 ref 確保訪問最新的 category 和 mounted 值
      if (mountedRef.current) {
        const currentCategory = categoryRef.current;
        const theme = getTheme(currentCategory, newMode);
        applyTheme(theme);
        document.documentElement.setAttribute('data-theme', `${currentCategory}-${newMode}`);
      }
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        category,
        mode,
        setCategory,
        setMode,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
