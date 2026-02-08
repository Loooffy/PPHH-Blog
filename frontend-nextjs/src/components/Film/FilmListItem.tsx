'use client';

import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface FilmCardProps {
  post: Post;
  category: string;
  theme: any;
}

// Extract first image URL from HTML content
function extractFirstImageUrl(content: string): string | null {
  if (!content) return null;

  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }

  const imgTagMatch = content.match(/<img[^>]+>/i);
  if (imgTagMatch) {
    const srcMatch = imgTagMatch[0].match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  return null;
}

// Extract text from HTML content
function extractText(content: string, maxLength: number = 100): string {
  if (!content) return '';
  const text = content.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Extract metadata from content
function extractMetadata(post: Post): { country?: string; duration?: string; genre?: string; director?: string } {
  return {
    country: 'TAIWAN',
    duration: '80 MIN',
    genre: 'DRAMA',
    director: extractText(post.content, 30).split(' ')[0] || '導演姓名',
  };
}

export function WideFilmCard({ post, category, theme }: FilmCardProps) {
  const defaultImage = '/film-poster-1.png';
  const imageUrl = extractFirstImageUrl(post.content) || defaultImage;
  const metadata = extractMetadata(post);
  const postDate = new Date(post.created_at);
  const year = postDate.getFullYear();

  return (
    <article className="flex-[1.8] transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/${category}/${post.slug || post.id}`} className="no-underline text-inherit block h-full w-1/2">
        <div className="flex w-full h-[240px] gap-3 items-stretch flex-nowrap">
          <div className="w-3/5 min-w-2/5 flex flex-col">
            <div className="flex items-center gap-4">
              <span
                className="font-['Inter',sans-serif] text-sm font-normal uppercase tracking-wider"
                style={{ color: theme.colors.text }}
              >
                {metadata.country} / {metadata.duration} / {metadata.genre}
              </span>
              <div
                className="h-px w-[40px] shrink"
                style={{ backgroundColor: theme.colors.text }}
              />
            </div>

            <div className="flex-1">
              <h2
                className="font-['Inter',sans-serif] text-[56px] font-medium mb-2 leading-[1.1] md:text-[40px]"
                style={{ color: theme.colors.accent }}
              >
                {post.title}
              </h2>
              <p
                className="font-['Inter',sans-serif] text-2xl font-light"
                style={{ color: theme.colors.text }}
              >
                {metadata.director}
              </p>
            </div>

            <div className="mt-auto">
              <span
                className="font-['Glegoo',serif] text-[56px] leading-none opacity-90 md:text-[40px]"
                style={{ color: theme.colors.text }}
              >
                {year}
              </span>
            </div>
          </div>

          <div className="overflow-hidden h-full md:w-auto md:flex-none md:h-auto md:aspect-[1.1/1]">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-auto h-full object-cover"
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

export function FullWidthFilmCard({ post, category, theme }: FilmCardProps) {
  const defaultImage = '/film-poster-2.png';
  const imageUrl = extractFirstImageUrl(post.content) || defaultImage;
  const metadata = extractMetadata(post);
  const postDate = new Date(post.created_at);
  const year = postDate.getFullYear();

  return (
    <article className="flex-1 transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/${category}/${post.slug || post.id}`} className="no-underline text-inherit block h-full">
        <div className="flex flex-col gap-8">
          <div className="aspect-[1.5/1] overflow-hidden rounded-sm">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-8 items-start pl-2">
            <div className="flex flex-col gap-4 min-w-[120px]">
              <span
                className="font-['Glegoo',serif] text-[48px] leading-none"
                style={{ color: theme.colors.text }}
              >
                {year}
              </span>
              <span
                className="font-['Inter',sans-serif] text-xs leading-normal tracking-wider uppercase"
                style={{ color: theme.colors.text }}
              >
                {metadata.country} / {metadata.duration} / {metadata.genre}
              </span>
            </div>

            <div
              className="w-px h-[120px] opacity-60"
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
                {metadata.director}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
