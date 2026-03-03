'use client';

import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GameNavBar } from '../Game/GameNavBar';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';

export function TopNavbar() {
  const { mode, category } = useTheme();
  const pathname = usePathname();
  const effectiveMode =
    category === 'film' ? 'dark' : category === 'book' ? 'light' : mode;
  const logoSrc = effectiveMode === 'dark' ? '/blog-logo-white.png' : '/blog-logo-black.png';

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
      className={`flex h-16 z-1100 overflow-visible border-b border-gray-300 px-12 justify-between items-center ${getNavbarBgClassName()}`}
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
        <NavLinks />
        <div className="flex items-center w-10 flex-shrink-0 md:w-9">
          {pathname.startsWith('/film') || pathname.startsWith('/book') ? (
            <span aria-hidden="true" />
          ) : (
            <ThemeToggle disabled={pathname !== '/' && !pathname.startsWith('/dev')} />
          )}
        </div>
      </div>
    </nav>
  );
}
