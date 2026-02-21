'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Category, categoryNames, categoryRoutes } from '@/lib/theme';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { GameNavBar } from './Game/GameNavBar';
import { ThemeToggle } from './ThemeToggle';

export function TopNavbar() {
  const { mode, category, setCategory } = useTheme();
  const pathname = usePathname();
  const logoSrc = mode === 'dark' ? '/blog-logo-white.png' : '/blog-logo-black.png';

  const categories: Category[] = ['dev', 'game', 'film', 'book'];

  const categoryImages: Record<Category, string> = {
    dev: '/logging.png',
    game: '/game.png',
    film: '/pinkman.png',
    book: '/book.png',
  };

  // 根據路徑自動設定類別
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

  // 根據路徑決定 active 的 tab，優先使用 pathname 而不是 category state
  // 這樣可以避免 localStorage 造成的視覺不一致
  const getActiveCategory = (): Category => {
    if (pathname === '/' || pathname.startsWith('/dev')) {
      return 'dev';
    } else if (pathname.startsWith('/game')) {
      return 'game';
    } else if (pathname.startsWith('/film')) {
      return 'film';
    } else if (pathname.startsWith('/book')) {
      return 'book';
    }
    return category; // fallback to state
  };

  const activeCategory = getActiveCategory();

  if (pathname.startsWith('/game')) {
    return <GameNavBar />;
  }

  const getNavbarBgClassName = () => {
    if (pathname.startsWith('/game')) {
      return 'bg-[#3bcbe5]';
    }
    return 'bg-surface';
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-1100 min-h-[110px] overflow-visible border-b border-border md:min-h-[110px] ${getNavbarBgClassName()}`}
    >
      {/* 底層 (z-0)：Logo + ThemeToggle，高度與 nav 一致 */}
      <div className="fixed top-0 left-0 right-0 z-0 flex min-h-[110px] items-center justify-between px-2 py-4 md:min-h-[110px] md:px-8">
        <Link href="/" className="flex items-center transition-opacity duration-300 hover:opacity-80">
          <Image
            src={logoSrc}
            alt="Blog Logo"
            width={40}
            height={40}
            priority
            className="w-[84px] object-contain md:w-16"
          />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

      {/* 上層 (z-10)：類別導航標籤，z 方向疊在 logo/toggle 之上，pointer-events-none 讓空白處可穿透點擊 */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 z-10 flex min-h-[110px] items-center justify-end px-6 py-4 md:min-h-[110px] md:px-4">
        <div className="pointer-events-auto mr-14 flex min-w-0 shrink items-center justify-end gap-1 md:mr-12 md:gap-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={categoryRoutes[cat]}
                className={`group flex min-w-0 shrink flex-col items-center cursor-pointer transition-all duration-300 text-text-secondary font-bold text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1.5 md:px-1 md:py-2 hover:text-text ${isActive ? 'text-text' : ''
                  }`}
                onClick={() => setCategory(cat)}
              >
                <span>{categoryNames[cat]}</span>
                <span className="navbar-float mt-1 hidden sm:block">
                  <Image
                    src={categoryImages[cat]}
                    alt={categoryNames[cat]}
                    width={120}
                    height={120}
                    className="aspect-square w-20 shrink-0 object-contain md:w-30"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
