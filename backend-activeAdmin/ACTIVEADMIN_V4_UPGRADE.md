# ActiveAdmin v4 升級說明

已依照 [UPGRADING.md](https://github.com/activeadmin/activeadmin/blob/master/UPGRADING.md) 完成升級至 ActiveAdmin 4.0.0.beta21。

## 已完成的變更

### 1. Ruby 升級
- **需求**: ActiveAdmin v4 需要 Ruby >= 3.2
- **已安裝**: Ruby 3.2.2（透過 rbenv）
- **ruby-build**: 已安裝至 `~/.rbenv/plugins/ruby-build` 以支援新版 Ruby

### 2. Gem 更新
- ActiveAdmin: 3.4.0 → **4.0.0.beta21**
- 移除 `sassc-rails`（v4 改用 Tailwind CSS）

### 3. 資源檔
- 已執行 `rails generate active_admin:assets`
- 建立 `app/assets/stylesheets/active_admin.css`（Tailwind v4）
- 建立 `tailwind-active_admin.config.mjs`
- 移除舊的 `active_admin.scss` 和 `active_admin.js`

### 4. npm 套件
- 已安裝 `@activeadmin/activeadmin@4.0.0-beta21`
- 已安裝 `@tailwindcss/cli`
- `package.json` 的 `build:css` 已包含 active_admin.css 編譯

### 5. 設定調整（config/initializers/active_admin.rb）
移除已廢棄的設定：
- `site_title_link`
- `logout_link_method`
- `favicon`, `meta_tags`, `meta_tags_for_logged_out_pages`
- `register_stylesheet`, `register_javascript`

### 6. View Partials
- 已執行 `rails g active_admin:views`
- EasyMDE 樣式與腳本已加入 `_html_head.html.erb`

## 待處理：CSS 編譯

Tailwind v4 CLI 需 **Node.js >= 20**，目前環境為 Node 18 會導致編譯失敗。

請執行以下其中一種方式：

**選項 A：升級 Node.js**
```bash
# 使用 nvm
nvm install 20
nvm use 20

# 或使用 fnm
fnm install 20
fnm use 20
```

**選項 B：修復 npm optional dependencies**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build:css
```

編譯完成後，`app/assets/builds/active_admin.css` 會包含完整 Tailwind 樣式。

## v4 新功能
- 手機版支援
- 深色模式
- RTL 支援
- 可自訂主題（透過 partials）

## 參考資源
- [ActiveAdmin UPGRADING.md](https://github.com/activeadmin/activeadmin/blob/master/UPGRADING.md)
- [ActiveAdmin v4 Breaking Changes](https://github.com/activeadmin/activeadmin/blob/master/UPGRADING.md#breaking-changes)
