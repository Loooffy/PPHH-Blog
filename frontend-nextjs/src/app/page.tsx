'use client';

import Link from 'next/link';
import { useState } from 'react';

function HoverImageLink({
  href,
  defaultSrc,
  hoverSrc,
  alt,
  className,
}: {
  href: string;
  defaultSrc: string;
  hoverSrc: string;
  alt: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      className="block relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={defaultSrc}
        alt={alt}
        className={`${className ?? ''} object-cover transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100'}`}
      />
      <img
        src={hoverSrc}
        alt={alt}
        className={`${className ?? ''} object-cover absolute top-0 left-0 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      />
    </Link>
  );
}

export default function Home() {
  return (
    <div className="absolute top-0 left-0 w-full h-full transform -translate-2 scale-100 md:scale-[1.4] origin-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-9/20 -translate-y-1/2">
        <img src="/pphh.png" alt="pphh" className="w-[150px] object-cover" />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-30 -translate-y-34">
        <HoverImageLink
          href="/dev"
          defaultSrc="/dev_default.png"
          hoverSrc="/dev_hover.png"
          alt="dev"
          className="w-[80px]"
        />
      </div>

      <div className="absolute top-1/2 left-1/2 transform translate-x-10 -translate-y-38">
        <HoverImageLink
          href="/book"
          defaultSrc="/book_default.png"
          hoverSrc="/book_hover.png"
          alt="book"
          className="w-[60px]"
        />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-40 translate-y-2">
        <HoverImageLink
          href="/game"
          defaultSrc="/game_default.png"
          hoverSrc="/game_hover.png"
          alt="game"
          className="w-[100px]"
        />
      </div>
      <div className="absolute top-1/2 left-1/2 transform translate-x-14 translate-y-4">
        <HoverImageLink
          href="/film"
          defaultSrc="/film_default.png"
          hoverSrc="/film_hover.png"
          alt="film"
          className="w-[80px]"
        />
      </div>
    </div>
  );
}
