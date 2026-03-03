'use client';

import { Category, categoryNames, categoryRoutes } from '@/lib/theme';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories: Category[] = ['dev', 'game', 'film', 'book'];

export function NavLinks({
  linkClassName = 'text-text-secondary',
  activeClassName = 'border-b-2 border-primary',
  hoverBorderClassName = 'hover:border-primary',
}: {
  linkClassName?: string;
  activeClassName?: string;
  hoverBorderClassName?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex px-10 py-4 md:px-12">
      {categories.map((cat) => {
        const isActive = pathname.startsWith(categoryRoutes[cat]);
        return (
          <Link
            key={cat}
            href={categoryRoutes[cat]}
            className={`group flex min-w-0 shrink flex-col items-center cursor-pointer text-xs mx-2 py-1 sm:text-sm sm:px-3 sm:py-1.5 md:px-1 md:py-2 hover:border-b-2 ${hoverBorderClassName} no-underline ${linkClassName} ${isActive ? activeClassName : ''}`}
          >
            <span className="text-l">{categoryNames[cat]}</span>
          </Link>
        );
      })}
    </div>
  );
}
