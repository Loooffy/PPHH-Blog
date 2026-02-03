'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import Link from 'next/link';
import { MovieTicketSVG } from './MovieTicketSVG';

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

// 從 HTML content 中提取第一張圖片 URL
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

// 從 content 中提取純文字（移除 HTML 標籤）
function extractText(content: string, maxLength: number = 100): string {
  if (!content) return '';
  const text = content.replace(/<[^>]*>/g, '').trim();
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function MovieCard({ post, category }: { post: Post; category: string }) {
  const defaultImage = 'https://m.media-amazon.com/images/M/MV5BMjM2NDQ1NTk1M15BMl5BanBnXkFtZTgwOTA0MTQzODE@._V1_QL75_UX517.5_.jpg';

  const imageUrl = extractFirstImageUrl(post.content) || defaultImage;
  const contentText = extractText(post.content, 80);
  const postDate = new Date(post.created_at);

  return (
    <article className="movie-ticket-card" style={{ paddingLeft: 16 }}>
      <Link
        href={`/${category}/${post.slug || post.id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          position: 'relative',
          display: 'block',
          width: 325,
          height: 160
        }}
      >
        {/* SVG 門票底圖 */}
        <MovieTicketSVG
          width={325}
          height={160}
          imageUrl={imageUrl}
          idPrefix={`post-${post.id}`}
          contentText={contentText}
          publishDateText={`發佈於：${postDate.toLocaleDateString('zh-TW')}`}
        />

        {/* 內容層 */}
        <div className="movie-ticket-content" style={{ position: 'relative', zIndex: 1 }}>
          {/* 左側圖片區域（空白佔位，圖片已移至 SVG） */}
          <div className="movie-ticket-image-area" aria-hidden="true" />

          {/* 存根區域 */}
          <div className="movie-ticket-stub">
            {/* 存根區域的內容可以留空或添加裝飾性元素 */}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function MovieList({ posts }: MovieListProps) {
  const { category, mode } = useTheme();
  const theme = getTheme(category, mode);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">
          目前還沒有電影評論
        </p>
      </div>
    );
  }

  return (
    <div className="layout-movie-ticket">
      {posts.map((post) => (
        <MovieCard key={post.id} post={post} category={category || 'movies'} />
      ))}
    </div>
  );
}
