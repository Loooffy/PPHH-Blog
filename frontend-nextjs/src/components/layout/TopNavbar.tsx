'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Category, categoryNames, categoryRoutes } from '@/lib/theme';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { GameNavBar } from '../Game/GameNavBar';
import { ThemeToggle } from './ThemeToggle';

export function TopNavbar() {
  const { mode, category } = useTheme();
  const pathname = usePathname();
  // 使用 context 的 category 決定 logo，確保載入中時 logo 與當前 theme 一致
  const effectiveMode =
    category === 'film' ? 'dark' : category === 'book' ? 'light' : mode;
  const logoSrc = effectiveMode === 'dark' ? '/blog-logo-white.png' : '/blog-logo-black.png';

  const categories: Category[] = ['dev', 'game', 'film', 'book'];

  // 不在 TopNavbar 更新 category，改由 ThemedMain 在內容載入後更新
  // 這樣 film↔book 切換時，會等 main 內容載完才一起更新 theme

  if (pathname.startsWith('/game')) {
    return <GameNavBar />;
  }

  if (pathname.startsWith('/book/')) {
    return null;
  }

  const getNavbarBgClassName = () => {
    if (pathname.startsWith('/game')) {
      return 'bg-[#3bcbe5]';
    }
    return 'bg-surface';
  };

  return (
    <nav
      className={`flex z-1100 overflow-visible border-b border-gray-300 px-12 justify-between items-center ${getNavbarBgClassName()}`}
    >
      <Link href="/" className="flex transition-opacity  hover:opacity-80">
        <Image
          src={logoSrc}
          alt="Blog Logo"
          width={40}
          height={40}
          priority
          className="w-[84px] object-contain md:w-16"
        />
      </Link>
      <div className="flex items-center justify-end">
        <div className="flex px-10 py-4 md:px-12">
          {categories.map((cat) => {
            const isActive = pathname.startsWith(categoryRoutes[cat]);
            return (
              <Link
                key={cat}
                href={categoryRoutes[cat]}
                className={`group flex min-w-0 shrink flex-col items-center cursor-pointer text-text-secondary text-xs mx-2 py-1 sm:text-sm sm:px-3 sm:py-1.5 md:px-1 md:py-2 hover:border-b-2 hover:border-primary ${isActive ? 'border-b-2 border-primary' : ''}`}
              >
                <span className="text-l">{categoryNames[cat]}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center">
          <ThemeToggle disabled={pathname !== '/' && !pathname.startsWith('/dev')} />
        </div>
      </div>
    </nav>
  );
}
