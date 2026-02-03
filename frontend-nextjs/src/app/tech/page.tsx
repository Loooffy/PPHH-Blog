import { TechPostList } from '@/components/TechPostList';
import { API_ENDPOINTS } from '@/lib/api';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
}

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(API_ENDPOINTS.postsByCategory('軟體開發'), {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function TechPage() {
  const posts = await getPosts();

  return (
    <>
      <main className="fixed top-[160px] left-0 right-0 bottom-0 overflow-y-auto z-900 bg-background">
        <div className="flex flex-col md:flex-row gap-6 items-start px-6 md:px-8">
          {/* 左側：SVG 圖片 */}
          <div className="w-full md:w-[25%] md:shrink-0 md:max-w-[25%]">
            <div className="w-full aspect-2/3 sticky top-6">
              <svg
                className="block w-full h-full"
                viewBox="0 0 400 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* 抽象的幾何圖案 */}
                <rect x="50" y="50" width="80" height="80" rx="8" fill="#000" opacity="0.8" />
                <circle cx="70" cy="70" r="6" fill="#fff" />
                <circle cx="110" cy="70" r="6" fill="#fff" />
                <circle cx="70" cy="110" r="6" fill="#fff" />
                <circle cx="110" cy="110" r="6" fill="#fff" />

                <path d="M180 80 L200 40 L220 80 L210 100 L190 100 Z" fill="#000" opacity="0.8" />

                <path d="M260 60 Q280 40 300 60 Q280 80 260 60" fill="#000" opacity="0.8" />
                <path d="M270 70 Q290 50 310 70 Q290 90 270 70" fill="#000" opacity="0.8" />

                <polygon points="350,50 370,50 360,70" fill="#000" opacity="0.8" />
                <polygon points="350,90 370,90 360,110" fill="#000" opacity="0.8" />

                <line x1="50" y1="200" x2="350" y2="200" stroke="#000" strokeWidth="2" opacity="0.3" />
                <circle cx="100" cy="250" r="4" fill="#000" opacity="0.6" />
                <circle cx="150" cy="250" r="4" fill="#000" opacity="0.6" />
                <circle cx="200" cy="250" r="4" fill="#000" opacity="0.6" />
                <line x1="100" y1="250" x2="150" y2="300" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                <line x1="150" y1="250" x2="200" y2="300" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                <line x1="200" y1="250" x2="250" y2="300" stroke="#000" strokeWidth="1.5" opacity="0.4" />
                <circle cx="150" cy="300" r="4" fill="#000" opacity="0.6" />
                <circle cx="200" cy="300" r="4" fill="#000" opacity="0.6" />
                <circle cx="250" cy="300" r="4" fill="#000" opacity="0.6" />

                {/* 波浪形淺色區塊 */}
                <path d="M0 400 Q50 380 100 400 T200 400 T300 400 T400 400 L400 600 L0 600 Z" fill="#f5f5f0" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* 右側：文章列表 */}
          <div className="flex-1 w-full md:max-w-[75%] md:pr-[60px]">
            <TechPostList posts={posts} />
          </div>
        </div>
      </main>
    </>
  );
}
