'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface MovieListProps {
  posts: Post[];
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

function WideMovieCard({ post, category, theme }: { post: Post; category: string; theme: any }) {
  const defaultImage = '/movie-poster-1.png';
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
                className="font-['Inter',sans-serif] text-sm font-semibold uppercase tracking-wider"
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

function FullWidthMovieCard({ post, category, theme }: { post: Post; category: string; theme: any }) {
  const defaultImage = '/movie-poster-2.png';
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

export function MovieList({ posts }: MovieListProps) {
  const { category, mode } = useTheme();
  const theme = getTheme(category || 'movie', mode);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: theme.colors.textSecondary }}>
          目前還沒有電影評論
        </p>
      </div>
    );
  }

  // Pair posts for the layout
  const rows = [];
  for (let i = 0; i < posts.length; i += 2) {
    rows.push(posts.slice(i, i + 2));
  }

  return (
    <div
      className="w-full py-4 max-w-[1200px] mx-auto"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="flex flex-col gap-8">
        {rows.map((pair, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 items-stretch md:flex-col md:gap-8">
            {pair[0] && (
              <FullWidthMovieCard
                post={pair[0]}
                category={category || 'movies'}
                theme={theme}
              />
            )}
            <div className="w-full mt-0 mb-0">
              <img src="/movie-divider-bottom.svg" alt="" className="w-full h-auto" />
            </div>
            {pair[0] && (
              <WideMovieCard
                post={pair[0]}
                category={category || 'movies'}
                theme={theme}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full mt-8 mb-0">
        <img src="/movie-divider-bottom.svg" alt="" className="w-full h-auto" />
      </div>
    </div>
  );
}
