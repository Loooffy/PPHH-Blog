'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Category, categoryNames, categoryRoutes } from '@/lib/theme';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export function TopNavbar() {
  const { mode, category, setCategory } = useTheme();
  const pathname = usePathname();
  const logoSrc = mode === 'dark' ? '/blog-logo-white.png' : '/blog-logo-black.png';

  const categories: Category[] = ['tech', 'game', 'movie', 'book'];

  // 根據路徑自動設定類別
  React.useEffect(() => {
    if (pathname === '/' || pathname.startsWith('/tech')) {
      setCategory('tech');
    } else if (pathname.startsWith('/game')) {
      setCategory('game');
    } else if (pathname.startsWith('/movies')) {
      setCategory('movie');
    } else if (pathname.startsWith('/books')) {
      setCategory('book');
    }
  }, [pathname, setCategory]);

  // 根據路徑決定 active 的 tab，優先使用 pathname 而不是 category state
  // 這樣可以避免 localStorage 造成的視覺不一致
  const getActiveCategory = (): Category => {
    if (pathname === '/' || pathname.startsWith('/tech')) {
      return 'tech';
    } else if (pathname.startsWith('/game')) {
      return 'game';
    } else if (pathname.startsWith('/movies')) {
      return 'movie';
    } else if (pathname.startsWith('/books')) {
      return 'book';
    }
    return category; // fallback to state
  };

  const activeCategory = getActiveCategory();

  // 根據當前頁面決定 navbar 的背景色
  const getNavbarBgColor = () => {
    if (pathname.startsWith('/game')) {
      return 'bg-[#3bcbe5]';
    }
    return 'bg-surface';
  };

  // 根據當前頁面決定遮罩的背景色
  const getMaskBgColor = () => {
    if (pathname.startsWith('/game')) {
      return '#3bcbe5';
    }
    return 'var(--color-background)';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 ${getNavbarBgColor()} border-b border-border flex items-center justify-between px-6 py-4 z-1100 shadow-[0_2px_8px_rgba(0,0,0,0.1)] min-h-[120px] md:min-h-[120px] md:px-4`}>
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

      {/* 類別導航標籤 */}
      <div className="flex items-center gap-2 md:gap-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <Link
              key={cat}
              href={categoryRoutes[cat]}
              className={`group px-4 py-2 cursor-pointer transition-all duration-300 text-text-secondary font-bold text-sm md:text-xs md:px-2 md:py-1 hover:text-text ${isActive ? 'text-text' : ''
                }`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'tech' ? (
                <span className="absolute bottom-[-35px] left-[120px] z-999 navbar-float">
                  <Image
                    src="/blog-image/logging.png"
                    alt={categoryNames[cat]}
                    width={160}
                    height={160}
                    className="block"
                  />
                </span>
              ) : cat === 'game' ? (
                <span className="absolute bottom-[-35px] left-[320px] z-999 navbar-float">
                  <Image
                    src="/blog-image/game.png"
                    alt={categoryNames[cat]}
                    width={140}
                    height={130}
                    className="block"
                  />
                </span>
              ) : cat === 'movie' ? (
                <span className="absolute bottom-[-40px] left-[480px] z-999 navbar-float">
                  <Image
                    src="/blog-image/pinkman.png"
                    alt={categoryNames[cat]}
                    width={150}
                    height={150}
                    className="block"
                  />
                </span>
              ) : cat === 'book' ? (
                <span className="absolute bottom-[-32px] left-[640px] z-999 navbar-float">
                  <Image
                    src="/blog-image/book.png"
                    alt={categoryNames[cat]}
                    width={120}
                    height={120}
                    className="block"
                  />
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>

      {/* Mask the navbar images overlap area */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 bottom-[-40px] h-[40px] z-1002 border-t-2 border-var(--color-text)"
        style={{ backgroundColor: getMaskBgColor() }}
      />
    </nav>
  );
}
