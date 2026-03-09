# PPHH Blog

個人 Blog 系統，支援四種文章類型（軟體開發、遊戲開發、影評、書評），每種類型有獨立 layout 與主題。

## 架構

- **後端**：`backend-activeAdmin` — Rails 7.2 + PostgreSQL + ActiveAdmin v4 + Devise
- **前端**：`frontend-nextjs` — Next.js 16 + TypeScript + Tailwind CSS 4
- **儲存**：Cloudflare R2
- **部署**：Docker Compose

## 快速開始

```bash
cp .env.example .env   # 編輯設定
docker-compose up --build
```

- 前台：`http://localhost:5678`
- 後台：`http://localhost:6789/admin`
- API：`http://localhost:6789/api/v1`

## 目錄

```
PPHH-Blog/
├── backend-activeAdmin/   # Rails API + ActiveAdmin
├── frontend-nextjs/       # Next.js App Router
└── docker-compose.yml
```

## API

`/api/v1/posts`、`/api/v1/posts/:slug`、`/api/v1/tags`、`/api/v1/series`。詳見 `backend-activeAdmin/swagger/`。

## 環境變數

`.env.example` 含必要設定；Docker 需 `postgres-shared-net` 網路。
