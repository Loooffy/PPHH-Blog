# PPHH Blog

個人 Blog 系統，支援四種文章類型（軟體開發、遊戲開發、影評、書評），每種類型有獨立 layout 與主題。

## 架構

- **後端**：`backend-activeAdmin` — Rails 7.2 + PostgreSQL + ActiveAdmin v4 + Devise
- **前端**：`frontend-nextjs` — Next.js 16 + TypeScript + Tailwind CSS 4
- **儲存**：Cloudflare R2
- **部署**：Docker Compose

## 快速開始

### 開發環境

```bash
cp .env.example.dev .env.dev   # 編輯設定
docker compose -f docker-compose.dev.yml --env-file .env.dev up -d
```

### 正式環境

```bash
cp .env.example.prod .env.prod   # 編輯設定（含 RAILS_MASTER_KEY、資料庫密碼等）
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### 存取位址

- 前台：`http://localhost:5678`
- 後台：`http://localhost:6789/admin`
- API：`http://localhost:6789/api/v1`

## 目錄

```
PPHH-Blog/
├── backend-activeAdmin/      # Rails API + ActiveAdmin
│   ├── Dockerfile            # 正式環境
│   └── Dockerfile.dev        # 開發環境
├── frontend-nextjs/          # Next.js App Router
│   ├── Dockerfile.prod       # 正式環境
│   └── Dockerfile.dev        # 開發環境
├── docker-compose.yml        # 開發環境（預設）
├── docker-compose.dev.yml    # 開發環境
├── docker-compose.prod.yml   # 正式環境
├── .env.example.dev          # 開發環境變數範本
└── .env.example.prod         # 正式環境變數範本
```

## API

`/api/v1/posts`、`/api/v1/posts/:slug`、`/api/v1/tags`、`/api/v1/series`。詳見 `backend-activeAdmin/swagger/`。

## 環境變數

`.env.example` 含必要設定；Docker 需 `postgres-shared-net` 網路。
