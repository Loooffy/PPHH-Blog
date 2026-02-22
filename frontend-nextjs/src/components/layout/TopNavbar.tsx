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
  const { mode, setCategory } = useTheme();
  const pathname = usePathname();
  // film 頁面固定 dark，navbar 也使用 dark theme 的 logo
  const effectiveMode = pathname.startsWith('/film') ? 'dark' : mode;
  const logoSrc = effectiveMode === 'dark' ? '/blog-logo-white.png' : '/blog-logo-black.png';

  const categories: Category[] = ['dev', 'game', 'film', 'book'];

  React.useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/dev')) {
      setCategory('dev');
    } else if (pathname.startsWith('/game')) {
      setCategory('game');
    } else if (pathname.startsWith('/film')) {
      setCategory('film');
    } else if (pathname.startsWith('/book')) {
      setCategory('book');
    }
  }, [pathname, setCategory]);

  if (pathname.startsWith('/game')) {
    return <GameNavBar />;
  }
  // bookpost 頁面由 BookPost 組件自帶 epub 風格 navbar，這裡不渲染
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
      className={`flex z-1100 overflow-visible px-12 justify-between items-center ${getNavbarBgClassName()}`}
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
            return (
              <Link
                key={cat}
                href={categoryRoutes[cat]}
                className={`group flex min-w-0 shrink flex-col items-center cursor-pointer text-text-secondary text-xs mx-2 py-1 sm:text-sm sm:px-3 sm:py-1.5 md:px-1 md:py-2 hover:border-b-2 hover:border-primary}`}
                onClick={() => setCategory(cat)}
              >
                <span className="text-xl">{categoryNames[cat]}</span>
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
