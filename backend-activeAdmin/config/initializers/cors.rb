# frozen_string_literal: true

# CORS 允許的來源
# 開發環境：localhost / 127.0.0.1
# 正式環境：透過 CORS_ALLOWED_ORIGINS 設定（例如 http://173.212.204.97:5678）
cors_origins = [
  "localhost:3000",
  "127.0.0.1:3000",
  /localhost(:\d+)?/,
  /127\.0\.0\.1(:\d+)?/
]

# 正式環境：從環境變數讀取允許的前端網址（可多個，以逗號分隔）
if ENV["CORS_ALLOWED_ORIGINS"].present?
  cors_origins += ENV["CORS_ALLOWED_ORIGINS"].split(",").map(&:strip)
end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*cors_origins)
    resource "/api/*", headers: :any, methods: [:get, :post, :patch, :put, :delete, :options, :head]
  end
end
