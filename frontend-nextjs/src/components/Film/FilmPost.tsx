'use client';

import { MarkdownContent } from '@/components/layout/MarkdownContent';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import type { PostDetail } from '@/types/api';
import { useState } from 'react';

interface FilmPostProps {
  post: PostDetail;
}

// 從 Markdown 或 HTML content 中提取第一張圖片 URL
function extractFirstImageUrl(content: string): string | null {
  if (!content) return null;

  // Markdown 格式: ![alt](url) 或 ![](url)
  const mdImgMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  if (mdImgMatch?.[1]) return mdImgMatch[1].trim();

  // HTML 格式
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  const imgTagMatch = content.match(/<img[^>]+>/i);
  if (imgTagMatch) {
    const srcMatch = imgTagMatch[0].match(/src=["']([^"']+)["']/i);
    if (srcMatch?.[1]) return srcMatch[1];
  }

  return null;
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}/${month}/${day}`;
}

// 從內容中移除第一張圖片（若與特色圖重複則不重複顯示）
function removeFirstImageFromContent(content: string): string {
  if (!content) return '';
  // Markdown 格式: ![alt](url)
  const mdReplaced = content.replace(/!\[[^\]]*\]\([^)]+\)\n?/, '');
  if (mdReplaced !== content) return mdReplaced.trim();
  // HTML 格式
  return content.replace(/<img[^>]*>/i, '');
}

export function FilmPost({ post }: FilmPostProps) {
  const { category } = useTheme();
  const theme = getTheme(category ?? 'film', 'dark');

  const [imageError, setImageError] = useState(false);
  const coverImageUrl =
    post.image_url ?? extractFirstImageUrl(post.content ?? '') ?? null;
  const displayImage = imageError ? null : coverImageUrl;

  const director = post.director ?? '';
  const year =
    post.year != null ? String(post.year) : new Date(post.created_at).getFullYear();
  const updatedAt = post.updated_at ?? post.created_at;

  // 若使用 image_url 作為特色圖，則內容保留內嵌圖片；若從 content 提取，則移除避免重複
  const contentToRender =
    post.image_url && coverImageUrl === post.image_url
      ? post.content ?? ''
      : removeFirstImageFromContent(post.content ?? '');

  return (
    <div
      className="flex flex-col items-center w-full font-['Inter',sans-serif]"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* 寬版特色圖：佔滿寬度 */}
      {displayImage && (
        <div className="w-full overflow-hidden">
          <img
            src={displayImage}
            alt={post.title}
            className="w-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      )}

      {/* 文章內容區：置中、限寬 */}
      <article className="w-full max-w-[600px] mx-auto flex flex-col gap-8 px-8 py-8 md:px-12 md:py-12">
        {/* 標題：置中、較大字體 */}
        <h1
          className="text-3xl md:text-4xl text-center font-medium leading-tight"
          style={{ color: theme.colors.accent }}
        >
          {post.title}
        </h1>

        {/* 元資訊：導演/年份靠左，最後更新靠右 */}
        <div
          className="flex justify-between items-baseline gap-4 border-b pb-4 text-sm"
          style={{ borderColor: theme.colors.border, color: theme.colors.textSecondary }}
        >
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {director && (
              <span>
                導演：<span style={{ color: theme.colors.text }}>{director}</span>
              </span>
            )}
            {year && (
              <span>
                年份：<span style={{ color: theme.colors.text }}>{year}</span>
              </span>
            )}
          </div>
          <span className="shrink-0">最後更新：{formatDate(updatedAt)}</span>
        </div>

        {/* Markdown 內容：標準段落排版 */}
        <div className="w-full" style={{ color: theme.colors.text }}>
          <MarkdownContent
            content={contentToRender}
            className="[&>p]:mb-6 [&>p]:leading-[1.9] [&>p]:break-inside-avoid-column [&>u]:underline [&>u]:underline-offset-4"
          />
        </div>
      </article>
    </div>
  );
}
