'use client';

import { Potta_One } from 'next/font/google';

const pottaOne = Potta_One({
  subsets: ['latin'],
  weight: '400',
});

interface GamePostListLayoutProps {
  children: React.ReactNode;
  contentClassName?: string;
}

export function GamePostListLayout({ children, contentClassName }: GamePostListLayoutProps) {
  return (
    <div className="fixed inset-0 pointer-events-none -translate-y-[6px]">
      <img src="/island.gif" alt="Island" className="absolute w-full h-full object-cover object-top-left left-0" />
      <div className="absolute top-[16%] left-[12%] sm:left-[12%] max-w-[480px] pointer-events-auto text-left">
        <h1 className={`text-white text-[clamp(20px,4vw,48px)] text-center leading-[0.9] font-bold tracking-[3px] ${pottaOne.className}`}>
          GAME <br></br> MAKING
        </h1>
        <div className={contentClassName}>
          {children}
        </div>
      </div>
    </div>
  );
}
