'use client';

import { NavLinks } from '@/components/layout/NavLinks';

export function GameNavBar() {
    return (
        <div className="fixed right-0 top-0 z-1111 h-16 flex items-center pr-12">
            <NavLinks
                linkClassName="text-white"
                activeClassName="border-b-2 border-current"
                hoverBorderClassName="hover:border-current"
            />
            <div className="w-9 shrink-0" aria-hidden />
        </div>
    );
}
