'use client';

import type { PostListItem } from '@/types/api';
import Link from 'next/link';

interface FilmCardProps {
  post: PostListItem;
  category: string;
  theme: { colors: { text: string; accent: string } };
}

export function WideFilmCard({ post, category, theme }: FilmCardProps) {
  const director = post.director ?? '';
  const year = post.year ?? new Date(post.created_at).getFullYear();
  const film_category = post.film_category ?? '';
  const film_country = post.film_country ?? '';
  const film_length = post.film_length ?? 0;
  return (
    <article className="transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/${category}/${post.slug || post.id}`} className="no-underline text-inherit block h-full">
        <div className="flex w-full h-[280px] gap-8 items-stretch flex-nowrap">
          {/* <div className="w-1/2 min-w-2/5 flex flex-col"> */}
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span
                className="font-['Inter',sans-serif] text-sm font-normal uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                {film_country} / {film_length} MIN / {film_category}
              </span>
              <div
                className="h-px w-[40px] shrink"
                style={{ backgroundColor: theme.colors.text }}
              />
            </div>

            <div className="flex-1">
              <h2
                className="font-['Inter',sans-serif] text-[56px] font-medium mt-4 mb-2 leading-[1.1] md:text-[40px]"
                style={{ color: theme.colors.accent }}
              >
                {post.title}
              </h2>
              <p
                className="font-['Inter',sans-serif] text-2xl font-light"
                style={{ color: theme.colors.text }}
              >
                {director}
              </p>
            </div>

            <div className="mt-auto text-right">
              <span
                className="font-['Glegoo',serif] text-[56px] leading-none opacity-90 md:text-[40px]"
                style={{ color: theme.colors.text }}
              >
                {year}
              </span>
            </div>
          </div>

          {post.image_url && (
            <div className="overflow-hidden h-full md:w-auto md:flex-none md:h-auto md:aspect-[1.1/1]">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-auto h-full object-cover"
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

export function NarrowFilmCard({ post, category, theme }: FilmCardProps) {
  const director = post.director ?? '';
  const year = post.year ?? new Date(post.created_at).getFullYear();
  const film_category = post.film_category ?? '';
  const film_country = post.film_country ?? '';
  const film_length = post.film_length ?? '';
  return (
    <article className="w-1/4 min-w-0 shrink-0 transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/${category}/${post.slug || post.id}`} className="no-underline text-inherit block h-full">
        <div className="h-[280px] flex flex-col gap-4">
          {post.image_url && (
            <div className="overflow-hidden rounded-sm">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-auto h-auto object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h2
              className="font-['Inter',sans-serif] text-xl text-right text-l font-medium leading-tight"
              style={{ color: theme.colors.accent }}
            >
              {post.title}
            </h2>
            <p
              className="font-['Inter',sans-serif] text-m text-right font-light"
              style={{ color: theme.colors.text }}
            >
              {director}
            </p>
            <span
              className="font-['Glegoo',serif] text-m leading-none"
              style={{ color: theme.colors.text }}
            >
              {year}
            </span>
            <span
              className="font-['Inter',sans-serif] text-[10px] leading-normal tracking-wider uppercase"
              style={{ color: theme.colors.text }}
            >
              {film_country} / {film_length} MIN / {film_category}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FullWidthFilmCard({ post, category, theme }: FilmCardProps) {
  const director = post.director ?? '';
  const year = post.year ?? new Date(post.created_at).getFullYear();
  const film_category = post.film_category ?? '';
  const film_country = post.film_country ?? '';
  const film_length = post.film_length ?? 0;
  return (
    <article className="flex-1 transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/${category}/${post.slug || post.id}`} className="no-underline text-inherit block h-full">
        <div className="flex flex-col gap-8">
          {post.image_url && (
            <div className="aspect-[1.5/1] overflow-hidden rounded-sm">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex gap-8 items-end pl-2">
            <div className="flex flex-col gap-3 min-w-[120px]">
              <span
                className="font-['Glegoo',serif] text-3xl leading-none"
                style={{ color: theme.colors.text }}
              >
                {year}
              </span>
              <span
                className="font-['Inter',sans-serif] text-xs leading-normal tracking-wider uppercase"
                style={{ color: theme.colors.text }}
              >
                {film_country} / {film_length} MIN / {film_category}
              </span>
            </div>

            <div
              className="w-px self-stretch opacity-60"
              style={{ backgroundColor: theme.colors.text }}
            />

            <div className="flex-1 flex flex-col gap-2">
              <h2
                className="font-['Inter',sans-serif] text-[40px] font-medium -mt-1 leading-[1.1]"
                style={{ color: theme.colors.accent }}
              >
                {post.title}
              </h2>
              <p
                className="font-['Inter',sans-serif] text-xl font-light"
                style={{ color: theme.colors.text }}
              >
                {director}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
