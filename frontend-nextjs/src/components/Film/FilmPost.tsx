'use client';

import { TrixContent } from '@/components/TrixContent';
import { useTheme } from '@/contexts/ThemeContext';
import { getTheme } from '@/lib/theme';
import type { PostDetail } from '@/types/api';
import { useState } from 'react';

interface FilmPostProps {
  post: PostDetail;
}

// 從 HTML content 中提取第一張圖片 URL
function extractFirstImageUrl(content: string): string | null {
  if (!content) return null;

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

// 從內容中移除第一張圖片（若與特色圖重複，可選擇保留或移除）
function removeFirstImageFromContent(content: string): string {
  if (!content) return '';
  return content.replace(/<img[^>]*>/i, '');
}

export function FilmPost({ post }: FilmPostProps) {
  const { category, mode } = useTheme();
  const theme = getTheme(category ?? 'film', mode);

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
      className="flex flex-col items-center w-full font-['Inter',sans-serif] p-8 md:p-12"
      style={{ backgroundColor: theme.colors.background }}
    >
      <article className="w-full max-w-[600px] items-center flex flex-col gap-8">
        {/* 特色圖 */}
        {displayImage && (
          <div className="w-full overflow-hidden rounded-sm">
            <img
              src={displayImage}
              alt={post.title}
              className="w-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* 標題 */}
        <div className="flex flex-col items-center w-2/3 gap-6">
          <h1
            className="text-4xl text-center md:text-3xl font-medium leading-tight"
            style={{ color: theme.colors.accent }}
          >
            {post.title}
          </h1>

          {/* 元資訊：導演、年份、最後更新 */}
          <div
            className="flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b pb-4 text-sm"
            style={{ borderColor: theme.colors.border, color: theme.colors.textSecondary }}
          >
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
            <span className="ml-auto">最後更新：{formatDate(updatedAt)}</span>
          </div>
        </div>

        {/* 內容 */}
        <div style={{ color: theme.colors.text }}>
          <TrixContent
            content={contentToRender}
            className="[&>p]:mb-6 [&>p]:leading-[1.9] [&>p]:break-inside-avoid-column [&>u]:underline [&>u]:underline-offset-4"
          />
        </div>
      </article>
    </div>
  );
}
