# Blog 專案開發指引 (Rails + Avo + Next.js)

## 專案概述

這是一個使用 Rails API + Avo + Next.js 建構的個人 Blog 系統。Blog 包含四種文章類型（軟體開發、遊戲開發、影評、書評），每種類型擁有完全不同的 layout 和 theme。

### 核心需求
- 四種文章類型，各自有獨特的 layout 和欄位
- 書評和影評可依照時間範圍（slider）和類型篩選
- 全文搜尋功能
- 動態載入（infinite scroll）
- 系列文章功能
- Google OAuth 認證（限定 2 個管理員）
- 完整的後台管理介面

---

## 技術架構

### 技術棧

**後端 (Rails API)**
- Ruby on Rails 8.1.2
- PostgreSQL 14+
- Avo (管理後台)
- Action Text (Trix 編輯器，用於富文本內容)
- Active Storage (檔案上傳與管理)
- rack-cors (CORS 處理)
- Kamal (部署工具)

**前端 (Next.js)**
- Next.js 16.1.6 (App Router)
- TypeScript
- Tailwind CSS 4.x
- html-react-parser (解析 HTML 內容)
- rc-slider (時間範圍篩選，規劃中)
- react-infinite-scroll-component (動態載入，規劃中)
- SWR 或 TanStack Query (資料快取與狀態管理，規劃中)

### 架構圖

```
┌─────────────────────────────────────────────────────────┐
│                       使用者                              │
└───────────────────┬─────────────────────────────────────┘
                    │
        ┌───────────┴──────────┐
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────────┐
│   Next.js    │      │      Avo         │
│   (前端)      │      │  (管理後台)       │
│              │      │                  │
│ - 4種Layout  │      │ - 文章管理        │
│ - 搜尋/篩選  │      │ - 系列管理        │
│ - 動態載入    │      │ - Trix 編輯器     │
└──────┬───────┘      └────────┬─────────┘
       │                       │
       │    REST API           │
       └───────────┬───────────┘
                   │
           ┌───────▼────────┐
           │  Rails API     │
           │                │
           │ - RESTful API  │
           │ - Action Text  │
           │ - Active Storage│
           │ - 搜尋邏輯      │
           │ - 資料驗證      │
           └───────┬────────┘
                   │
           ┌───────▼────────┐
           │  PostgreSQL    │
           │                │
           │ - 文章資料      │
           │ - Action Text  │
           │ - Active Storage│
           │ - 全文搜尋索引  │
           └────────────────┘
```

---

## 資料庫設計

### 核心資料表

#### 1. admin_users (管理員)
```
id: bigint (primary key)
email: string (唯一, 索引)
encrypted_password: string
provider: string (google_oauth2)
uid: string
created_at: datetime
updated_at: datetime

限制:
- 只允許特定的 2 個 email 註冊/登入
- ALLOWED_EMAILS = ['admin1@example.com', 'admin2@example.com']
```

#### 2. articles (文章)
```
id: bigint (primary key)
admin_user_id: bigint (外鍵)
title: string (必填, 索引)
slug: string (唯一, 索引)
content: text (必填)
excerpt: text (摘要, 可選)
category: string (軟體開發/遊戲開發/影評/書評)
layout_type: string (tech/game/movie/book)
published_at: datetime (索引)
status: string (draft/published/archived)

# 書評專用欄位
book_title: string
book_author: string
book_genre: string (小說/散文/商業/科技/心理/歷史)
book_published_year: integer (索引)
book_rating: decimal(3,1) (0.0-5.0)
book_isbn: string

# 影評專用欄位
movie_title: string
movie_director: string
movie_genre: string (動作/劇情/科幻/恐怖/喜劇/愛情/紀錄片)
movie_release_year: integer (索引)
movie_rating: decimal(3,1) (0.0-5.0)
movie_imdb_id: string

# SEO 欄位
meta_title: string
meta_description: text
og_image_url: string

created_at: datetime
updated_at: datetime

索引:
- title (全文搜尋)
- content (全文搜尋)
- book_title (全文搜尋)
- movie_title (全文搜尋)
- published_at (排序)
- category (篩選)
- book_published_year (範圍查詢)
- movie_release_year (範圍查詢)
```

#### 3. series (系列)
```
id: bigint (primary key)
name: string (必填)
slug: string (唯一, 索引)
description: text
created_at: datetime
updated_at: datetime
```

#### 4. article_series (文章-系列關聯表)
```
id: bigint (primary key)
article_id: bigint (外鍵)
series_id: bigint (外鍵)
position: integer (排序用)
created_at: datetime
updated_at: datetime

唯一索引: [article_id, series_id]
```

#### 5. tags (標籤)
```
id: bigint (primary key)
name: string (唯一, 索引)
slug: string (唯一)
created_at: datetime
updated_at: datetime
```

#### 6. article_tags (文章-標籤關聯表)
```
id: bigint (primary key)
article_id: bigint (外鍵)
tag_id: bigint (外鍵)
created_at: datetime
updated_at: datetime

唯一索引: [article_id, tag_id]
```

### 資料庫關聯

```
AdminUser
  - has_many :articles

Article
  - belongs_to :admin_user
  - has_many :article_series
  - has_many :series, through: :article_series
  - has_many :article_tags
  - has_many :tags, through: :article_tags

Series
  - has_many :article_series
  - has_many :articles, through: :article_series

Tag
  - has_many :article_tags
  - has_many :articles, through: :article_tags
```

---

## 目錄結構

### Monorepo 結構

```
blog-project/
├── backend-avo/                # Rails API
│   ├── app/
│   │   ├── avo/               # Avo 資源設定
│   │   │   └── resources/
│   │   │       ├── post.rb
│   │   │       ├── article.rb (規劃中)
│   │   │       ├── series.rb (規劃中)
│   │   │       └── tag.rb (規劃中)
│   │   ├── controllers/
│   │   │   ├── api/
│   │   │   │   └── v1/
│   │   │   │       ├── posts_controller.rb
│   │   │   │       ├── articles_controller.rb (規劃中)
│   │   │   │       ├── series_controller.rb (規劃中)
│   │   │   │       ├── tags_controller.rb (規劃中)
│   │   │   │       └── search_controller.rb (規劃中)
│   │   │   └── avo/           # Avo 自訂控制器
│   │   │       └── posts_controller.rb
│   │   ├── models/
│   │   │   ├── post.rb
│   │   │   ├── article.rb (規劃中)
│   │   │   ├── series.rb (規劃中)
│   │   │   ├── tag.rb (規劃中)
│   │   │   ├── article_series.rb (規劃中)
│   │   │   └── article_tag.rb (規劃中)
│   │   ├── serializers/       # JSON 序列化 (規劃中)
│   │   │   ├── article_serializer.rb
│   │   │   ├── series_serializer.rb
│   │   │   └── tag_serializer.rb
│   │   └── services/          # 業務邏輯 (規劃中)
│   │       ├── article_search_service.rb
│   │       └── article_filter_service.rb
│   ├── config/
│   │   ├── initializers/
│   │   │   ├── avo.rb
│   │   │   └── cors.rb (規劃中)
│   │   ├── routes.rb
│   │   ├── database.yml
│   │   └── deploy.yml         # Kamal 部署設定
│   ├── db/
│   │   ├── migrate/
│   │   └── seeds.rb
│   ├── test/                  # Rails 測試
│   │   ├── models/
│   │   ├── controllers/
│   │   └── fixtures/
│   ├── Gemfile
│   ├── Gemfile.lock
│   └── README.md
│
├── frontend-nextjs/           # Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── tech/          # 軟體開發文章
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── game/          # 遊戲開發文章
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── movies/        # 影評
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── books/         # 書評
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── series/        # 系列文章
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── search/        # 搜尋頁面
│   │   │       └── page.tsx
│   │   ├── components/
│   │   │   ├── layouts/
│   │   │   │   ├── TechLayout.tsx
│   │   │   │   ├── GameLayout.tsx
│   │   │   │   ├── MovieLayout.tsx
│   │   │   │   └── BookLayout.tsx
│   │   │   ├── filters/
│   │   │   │   ├── BookFilter.tsx
│   │   │   │   ├── MovieFilter.tsx
│   │   │   │   └── YearRangeSlider.tsx
│   │   │   ├── search/
│   │   │   │   └── SearchBar.tsx
│   │   │   ├── articles/
│   │   │   │   ├── ArticleCard.tsx
│   │   │   │   ├── ArticleList.tsx
│   │   │   │   └── InfiniteArticleList.tsx
│   │   │   └── ui/            # 共用 UI 元件
│   │   │       ├── Button.tsx
│   │   │       ├── Card.tsx
│   │   │       └── Loading.tsx
│   │   ├── lib/
│   │   │   ├── api.ts         # API client (規劃中)
│   │   │   ├── utils.ts
│   │   │   └── constants.ts
│   │   ├── hooks/
│   │   │   ├── useArticles.ts (規劃中)
│   │   │   ├── useInfiniteScroll.ts (規劃中)
│   │   │   └── useSearch.ts (規劃中)
│   │   └── types/
│   │       ├── article.ts (規劃中)
│   │       ├── series.ts (規劃中)
│   │       └── api.ts (規劃中)
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── README.md
│
├── .gitignore
├── docker-compose.yml         # 開發環境
├── package.json               # 根目錄 (管理 monorepo)
└── README.md
```

---

## API 規格

### Base URL
- 開發環境: `http://localhost:3000/api/v1`
- 生產環境: `https://your-api-domain.com/api/v1`

### 認證
- 公開 API 無需認證
- Avo 管理後台認證 (規劃中，可整合 Devise 或其他認證方案)

### 通用回應格式

**成功回應:**
```json
{
  "data": { ... },
  "meta": {
    "current_page": 1,
    "total_pages": 10,
    "total_count": 200,
    "per_page": 20
  }
}
```

**錯誤回應:**
```json
{
  "error": {
    "code": "not_found",
    "message": "Article not found"
  }
}
```

### API Endpoints

#### 1. 文章 API

**GET /api/v1/articles**
取得文章列表

Query Parameters:
```
category: string (軟體開發/遊戲開發/影評/書評)
layout_type: string (tech/game/movie/book)
q: string (搜尋關鍵字)
tag: string (標籤)
series_id: integer (系列 ID)

# 書評篩選
book_genre: string
book_year_min: integer
book_year_max: integer

# 影評篩選
movie_genre: string
movie_year_min: integer
movie_year_max: integer

# 分頁
page: integer (default: 1)
per_page: integer (default: 20, max: 100)

# 排序
sort_by: string (published_at/created_at/title)
order: string (asc/desc, default: desc)
```

回應範例:
```json
{
  "data": [
    {
      "id": 1,
      "title": "深入理解 React Hooks",
      "slug": "deep-dive-react-hooks",
      "excerpt": "React Hooks 完全指南...",
      "category": "軟體開發",
      "layout_type": "tech",
      "published_at": "2024-01-15T10:00:00Z",
      "tags": [
        { "id": 1, "name": "React", "slug": "react" },
        { "id": 2, "name": "JavaScript", "slug": "javascript" }
      ],
      "series": {
        "id": 1,
        "name": "React 進階系列",
        "slug": "react-advanced-series"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_count": 100,
    "per_page": 20
  }
}
```

**GET /api/v1/articles/:slug**
取得單篇文章

回應範例:
```json
{
  "data": {
    "id": 1,
    "title": "深入理解 React Hooks",
    "slug": "deep-dive-react-hooks",
    "content": "# 完整的 Markdown 內容...",
    "excerpt": "React Hooks 完全指南...",
    "category": "軟體開發",
    "layout_type": "tech",
    "published_at": "2024-01-15T10:00:00Z",
    "meta_title": "深入理解 React Hooks | 我的 Blog",
    "meta_description": "...",
    "og_image_url": "https://...",
    "tags": [...],
    "series": {...},
    "author": {
      "email": "admin@example.com"
    }
  }
}
```

**GET /api/v1/articles/:slug/related**
取得相關文章

回應: 與 GET /api/v1/articles 相同格式，但只回傳 5 筆

#### 2. 系列 API

**GET /api/v1/series**
取得所有系列

回應範例:
```json
{
  "data": [
    {
      "id": 1,
      "name": "React 進階系列",
      "slug": "react-advanced-series",
      "description": "從基礎到進階的 React 教學",
      "articles_count": 10
    }
  ]
}
```

**GET /api/v1/series/:slug**
取得系列詳情及其文章

回應範例:
```json
{
  "data": {
    "id": 1,
    "name": "React 進階系列",
    "slug": "react-advanced-series",
    "description": "從基礎到進階的 React 教學",
    "articles": [
      {
        "id": 1,
        "title": "React Hooks 基礎",
        "slug": "react-hooks-basics",
        "position": 1,
        "published_at": "2024-01-01T10:00:00Z"
      },
      {
        "id": 2,
        "title": "深入理解 React Hooks",
        "slug": "deep-dive-react-hooks",
        "position": 2,
        "published_at": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### 3. 標籤 API

**GET /api/v1/tags**
取得所有標籤

回應範例:
```json
{
  "data": [
    {
      "id": 1,
      "name": "React",
      "slug": "react",
      "articles_count": 25
    }
  ]
}
```

**GET /api/v1/tags/:slug/articles**
取得該標籤的所有文章

Query Parameters: 與 GET /api/v1/articles 相同
回應: 與 GET /api/v1/articles 相同格式

#### 4. 搜尋 API

**GET /api/v1/search**
全文搜尋

Query Parameters:
```
q: string (必填, 搜尋關鍵字)
category: string (可選)
page: integer
per_page: integer
```

回應: 與 GET /api/v1/articles 相同格式

#### 5. 統計 API

**GET /api/v1/stats**
取得網站統計資訊

回應範例:
```json
{
  "data": {
    "total_articles": 150,
    "categories": {
      "軟體開發": 60,
      "遊戲開發": 30,
      "影評": 35,
      "書評": 25
    },
    "total_series": 10,
    "total_tags": 50
  }
}
```

---

## 環境管理

### 開發環境設定

#### 必要軟件
- Ruby 3.2+
- Node.js 18+
- PostgreSQL 14+
- Redis (可選，用於快取)
- Git

#### 環境變數

**後端 (使用 Rails credentials 或環境變數)**
```bash
# Database
DATABASE_URL=postgresql://localhost/blog_development

# Rails
RAILS_ENV=development
SECRET_KEY_BASE=your_secret_key
# 或使用 Rails credentials: rails credentials:edit

# CORS (規劃中)
FRONTEND_URL=http://localhost:3000

# Avo (可選)
# AVO_LICENSE_KEY=your_license_key (Pro 版本需要)
```

**前端 (.env.local)**
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3000

# Site Info
NEXT_PUBLIC_SITE_NAME=我的 Blog
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics (可選)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Docker 開發環境

提供 docker-compose.yml 用於快速啟動開發環境:

**服務:**
- PostgreSQL
- Redis (可選)
- Rails API (hot reload)
- Next.js (hot reload)

**啟動指令:**
```bash
docker-compose up
```

**服務端口:**
- Rails API: http://localhost:3000
- Avo 管理後台: http://localhost:3000/avo
- Next.js: http://localhost:3000 (預設，可調整)
- PostgreSQL: localhost:5432

### 本地開發工作流程

1. **後端啟動**
```bash
cd backend-avo
bundle install
rails db:create db:migrate db:seed
rails server
```

2. **前端啟動**
```bash
cd frontend-nextjs
npm install
npm run dev
```

3. **訪問**
- 前台: http://localhost:3000 (Next.js 預設端口)
- 後台: http://localhost:3000/avo (Avo 管理後台)

### 資料庫管理

**建立資料庫:**
```bash
rails db:create
```

**執行 migration:**
```bash
rails db:migrate
```

**回滾 migration:**
```bash
rails db:rollback
```

**重置資料庫:**
```bash
rails db:reset
```

**產生種子資料:**
```bash
rails db:seed
```

**開啟 Rails console:**
```bash
rails console
```

### 測試

**後端測試 (Rails Test):**
```bash
cd backend-avo
bin/rails test
```

**前端測試 (規劃中):**
```bash
cd frontend-nextjs
npm run test
```

---

## 部署方式

### 推薦部署架構

```
使用者
  │
  ├─→ Vercel (Next.js Frontend)
  │     - 靜態檔案 CDN
  │     - Edge Functions
  │     - ISR/SSG
  │
  └─→ Kamal (Rails API + Avo)
        - Docker 容器化部署
        - PostgreSQL Database
        - Active Storage (本地或雲端)
        - Solid Queue (背景任務)
```

### 後端部署 (Kamal)

#### 準備工作

1. **config/deploy.yml**
Kamal 使用 YAML 設定檔管理部署:
```yaml
service: pp_hh_blog
image: pp_hh_blog

servers:
  web:
    - your-server-ip

registry:
  server: localhost:5555  # 或使用 Docker Hub, GHCR 等

env:
  secret:
    - RAILS_MASTER_KEY
  clear:
    SOLID_QUEUE_IN_PUMA: true

volumes:
  - "pp_hh_blog_storage:/rails/storage"
```

2. **config/puma.rb**
Rails 8 預設已包含適合生產環境的設定

3. **生產環境變數**
在 `.kamal/secrets` 設定:
```
RAILS_MASTER_KEY=...
DATABASE_URL=postgresql://...
SECRET_KEY_BASE=...
```

#### 部署步驟

1. 設定伺服器 SSH 存取
2. 設定環境變數和 secrets
3. 執行部署

**Kamal 部署指令:**
```bash
# 首次部署
bin/kamal setup

# 後續部署
bin/kamal deploy

# 查看日誌
bin/kamal logs

# 進入 Rails console
bin/kamal app exec --interactive "bin/rails console"
```

### 前端部署 (Vercel)

#### 準備工作

1. **next.config.js**
```javascript
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: ['your-cdn-domain.com'],
  },
}
```

2. **生產環境變數**
在 Vercel 設定:
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_NAME=我的 Blog
NEXT_PUBLIC_SITE_URL=https://your-blog.vercel.app
```

#### 部署步驟

1. 連接 GitHub repository
2. Vercel 自動偵測 Next.js 專案
3. 設定 Root Directory 為 `frontend`
4. 設定環境變數
5. 部署

**Vercel CLI 部署:**
```bash
vercel login
vercel --prod
```

### 資料庫備份策略

**Kamal 備份:**
- 使用 PostgreSQL 的 `pg_dump` 進行備份
- 可設定定期備份腳本

**手動備份:**
```bash
# 透過 Kamal 執行備份
bin/kamal app exec "pg_dump $DATABASE_URL > /tmp/backup.sql"

# 下載備份檔案
bin/kamal app exec --interactive "cat /tmp/backup.sql" > backup.sql

# 還原
bin/kamal app exec "psql $DATABASE_URL < /tmp/backup.sql"
```

**定期備份腳本:**
建議使用 GitHub Actions 或 cron job 每日自動備份到雲端儲存

### CI/CD 設定

**GitHub Actions 範例:**

**.github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run backend tests
        run: |
          cd backend
          bundle install
          bundle exec rspec

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run frontend tests
        run: |
          cd frontend
          npm install
          npm run test

  deploy-backend:
    needs: [test-backend]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kamal
        # Kamal 部署腳本
        run: |
          cd backend-avo
          bin/kamal deploy

  deploy-frontend:
    needs: [test-frontend]
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel
        # Vercel 自動部署
```

### 監控與日誌

**後端:**
- Kamal 提供日誌查看: `bin/kamal logs`
- 考慮整合 Sentry (錯誤追蹤)
- 考慮整合 New Relic (效能監控)

**前端:**
- Vercel Analytics
- Google Analytics
- Sentry for Next.js

---

## 重要開發注意事項

### 安全性

1. **CORS 設定**
   - 只允許指定的前端網域
   - 生產環境不可使用 `*`

2. **Avo 認證**
   - Avo 支援多種認證方案 (Devise, Pundit 等)
   - 可設定 `config.current_user_method` 和 `config.authenticate_with`
   - 建議整合授權機制限制管理後台存取

3. **API Rate Limiting**
   - 使用 rack-attack gem
   - 限制搜尋 API 的請求頻率

4. **Content Security Policy**
   - Next.js 設定 CSP headers
   - 防止 XSS 攻擊

### 效能優化

1. **資料庫索引**
   - 為常用查詢欄位建立索引
   - published_at, category, slug 等

2. **N+1 查詢優化**
   - 使用 `includes` 預載關聯資料
   - 使用 bullet gem 偵測 N+1 問題

3. **快取策略**
   - Rails: 使用 Solid Cache (Rails 8 預設)
   - Next.js: 使用 ISR (Incremental Static Regeneration)
   - Action Text 內容可考慮快取

4. **圖片優化**
   - 使用 Next.js Image 元件
   - 考慮使用 Cloudinary 或 ImageKit

### SEO 優化

1. **Meta Tags**
   - 每篇文章都要有 meta_title 和 meta_description
   - Open Graph tags
   - Twitter Card tags

2. **Sitemap**
   - Rails 產生 sitemap.xml
   - 提交到 Google Search Console

3. **Structured Data**
   - 文章使用 Article schema
   - 書評使用 Review schema

### 可訪問性 (a11y)

1. **語意化 HTML**
   - 正確使用 heading 層級
   - 使用 semantic elements

2. **鍵盤導航**
   - 確保所有互動元素可用鍵盤操作

3. **ARIA 標籤**
   - 為動態內容添加適當的 ARIA 屬性

### 內容管理最佳實踐

1. **草稿功能**
   - 文章狀態: draft, published, archived
   - 允許預覽未發布的文章

2. **版本控制**
   - 考慮使用 paper_trail gem 追蹤文章變更

3. **媒體管理**
   - 使用 ActiveStorage 或雲端儲存
   - 建議使用 Cloudinary

4. **內容編輯器**
   - Avo 使用 Action Text (Trix 編輯器)
   - 支援富文本編輯和圖片上傳
   - 可透過 Active Storage 管理媒體檔案

---

## 擴充功能建議

### 階段一 (MVP)
- ✅ 基本 CRUD (Post model)
- ✅ Avo 管理後台
- ✅ Action Text 內容編輯
- ✅ Active Storage 檔案管理
- ⏳ 四種 layout (規劃中)
- ⏳ 搜尋/篩選 (規劃中)
- ⏳ 系列文章 (規劃中)
- ⏳ 認證系統 (規劃中)

### 階段二
- 留言系統 (可使用 Disqus 或自建)
- RSS Feed
- 文章瀏覽統計
- 相關文章推薦

### 階段三
- 全文搜尋改用 Elasticsearch
- 多語系支援
- Newsletter 訂閱
- 深色模式

---

## 常見問題與解決方案

### 1. CORS 錯誤
**問題:** 前端無法存取後端 API
**解決:** 檢查 config/initializers/cors.rb 設定

### 2. Avo 無法存取
**問題:** 無法訪問 /avo 管理後台
**解決:** 
- 確認 `config/initializers/avo.rb` 設定正確
- 檢查路由設定: `mount Avo::Engine => Avo.configuration.root_path`
- 確認認證設定 (如已啟用)

### 3. 全文搜尋效能差
**問題:** 搜尋速度慢
**解決:**
- 確認 PostgreSQL 已建立 GIN 索引
- 考慮改用 Elasticsearch

### 4. 圖片載入慢
**問題:** 文章內圖片載入緩慢
**解決:**
- 使用 CDN
- Next.js Image 元件自動優化
- 考慮使用 Cloudinary

### 5. Build 時間過長
**問題:** Next.js build 時間超過 10 分鐘
**解決:**
- 使用 ISR 而非完全 SSG
- 限制一次 build 的文章數量

---

## 開發檢查清單

### 後端
- [x] 基本資料庫 schema (Post)
- [x] Avo 管理介面基本設定完成
- [x] Action Text 整合完成
- [x] Active Storage 整合完成
- [x] 基本 API endpoints (posts)
- [ ] 完整資料庫 schema (articles, series, tags)
- [ ] Model 關聯和驗證設定完成
- [ ] Avo 資源完整設定 (articles, series, tags)
- [ ] 認證系統整合完成
- [ ] 搜尋功能實作完成
- [ ] 篩選邏輯實作完成
- [ ] CORS 設定完成
- [ ] 測試撰寫完成
- [ ] API 文件完成

### 前端
- [ ] 四種 layout 設計完成
- [ ] 篩選 UI (slider) 實作完成
- [ ] 搜尋功能實作完成
- [ ] 動態載入實作完成
- [ ] 系列文章頁面完成
- [ ] SEO meta tags 設定完成
- [ ] 錯誤處理完成
- [ ] Loading 狀態完成
- [ ] Responsive design 完成
- [ ] 可訪問性檢查完成

### 部署
- [ ] 環境變數設定完成
- [ ] Kamal 部署設定完成
- [ ] Vercel 部署成功
- [ ] 資料庫 migration 執行成功
- [ ] Avo 管理後台在生產環境測試通過
- [ ] HTTPS 設定完成
- [ ] 監控工具設定完成
- [ ] 備份策略建立完成

---

## 參考資源

### 文件
- Rails Guides: https://guides.rubyonrails.org/
- Next.js Documentation: https://nextjs.org/docs
- Avo: https://docs.avohq.io/
- Action Text: https://guides.rubyonrails.org/action_text_overview.html
- Active Storage: https://guides.rubyonrails.org/active_storage_overview.html
- Kamal: https://kamal-deploy.org/
- PostgreSQL Full Text Search: https://www.postgresql.org/docs/current/textsearch.html

### 教學
- Rails API 開發: https://guides.rubyonrails.org/api_app.html
- Next.js with External APIs: https://nextjs.org/docs/basic-features/data-fetching
- TypeScript with Next.js: https://nextjs.org/docs/basic-features/typescript

### 工具
- Kamal Documentation: https://kamal-deploy.org/
- Vercel Documentation: https://vercel.com/docs
- PostgreSQL GUI: pgAdmin, Postico, TablePlus
- Docker Documentation: https://docs.docker.com/

---

## 版本紀錄

### v1.0.0 (Current)
- 基本文章 CRUD (Post model)
- Avo 管理後台
- Action Text (Trix) 內容編輯
- Active Storage 檔案管理
- Rails 8.1.2 + Next.js 16.1.6

### v1.1.0 (規劃中)
- 四種文章類型與 layout
- 搜尋與篩選功能
- 系列文章功能
- 認證系統整合

---

## 授權與聯絡

此文件為內部開發指引，僅供專案開發團隊使用。

最後更新: 2026-01-31

---

## Avo 管理後台使用說明

### 基本設定

Avo 管理後台位於 `/avo` 路徑，預設配置在 `config/initializers/avo.rb`。

### 資源設定

每個 Model 需要對應的 Avo Resource，位於 `app/avo/resources/`：

```ruby
class Avo::Resources::Post < Avo::BaseResource
  def fields
    field :title, as: :text
    field :slug, as: :text
    field :content, as: :trix, full_width: true, stacked: true
  end
end
```

### 認證整合

Avo 支援多種認證方案，可在 `config/initializers/avo.rb` 設定：

```ruby
Avo.configure do |config|
  config.current_user_method = :current_user
  config.authenticate_with do
    # 認證邏輯
  end
end
```

### 授權設定

可使用 Pundit 或其他授權 gem：

```ruby
Avo.configure do |config|
  config.authorization_client = :pundit
  config.authorization_methods = {
    index: 'index?',
    show: 'show?',
    edit: 'edit?',
    # ...
  }
end
```

---

## Action Text 使用說明

### 基本設定

Action Text 已整合在 Rails 8 中，使用 Trix 編輯器處理富文本內容。

### Model 設定

```ruby
class Post < ApplicationRecord
  has_rich_text :content
end
```

### 在 Avo 中使用

```ruby
field :content, as: :trix, full_width: true, stacked: true
```

### 在前端顯示

使用 `html-react-parser` 解析 Action Text 產生的 HTML：

```tsx
import parse from 'html-react-parser';

<div className="trix-content">
  {parse(post.content || '')}
</div>
```

---

## Active Storage 使用說明

### 基本設定

Active Storage 用於處理檔案上傳，設定在 `config/storage.yml`。

### Model 設定

```ruby
class Post < ApplicationRecord
  has_one_attached :cover_image
  has_many_attached :attachments
end
```

### 在 Avo 中使用

```ruby
field :cover_image, as: :file
field :attachments, as: :files
```

### 在前端顯示

```tsx
{post.cover_image_url && (
  <img src={post.cover_image_url} alt={post.title} />
)}
```
