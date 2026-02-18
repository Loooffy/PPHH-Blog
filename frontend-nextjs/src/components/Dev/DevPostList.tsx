'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { DevFeaturedPost } from './DevFeaturedPost';
import { DevListItem } from './DevListItem';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  category?: string;
}

interface DevPostListProps {
  posts: Post[];
}

export function DevPostList({ posts }: DevPostListProps) {
  const { category } = useTheme();
  if (posts.length === 0) {
    return (
      <div className="dev-empty-state">
        <p>目前還沒有文章</p>
      </div>
    );
  }

  // 第一篇文章作為精選文章
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="flex flex-col w-full">
      {/* 精選文章 */}
      {featuredPost && (
        <DevFeaturedPost post={featuredPost} category={category} />
      )}

      {/* 其他文章列表 */}
      <div className="flex flex-col">
        {otherPosts.map((post, index) => (
          <DevListItem
            key={post.id}
            post={post}
            category={category}
            isLast={index === otherPosts.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
