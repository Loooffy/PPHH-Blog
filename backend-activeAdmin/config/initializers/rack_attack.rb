# frozen_string_literal: true

# Rack::Attack - Rate limiting & DDoS protection
# https://github.com/rack/rack-attack

### Configure Cache ###
Rack::Attack.cache.store = Rails.cache

### 取得真實客戶端 IP ###
# 若使用 Cloudflare 或反向代理，需從 header 取得真實 IP
# 否則 req.ip 會回傳代理 IP，導致所有用戶被視為同一 IP
def real_ip(req)
  req.env["HTTP_CF_CONNECTING_IP"].presence ||
    req.env["HTTP_X_FORWARDED_FOR"]&.split(",")&.first&.strip.presence ||
    req.ip
end

### Throttle 設定 ###

# 一般 API：每 IP 每分鐘最多 60 次請求
Rack::Attack.throttle("req/ip", limit: 60, period: 1.minute) do |req|
  real_ip(req) unless req.path.start_with?("/up")
end

# 較嚴格：每 IP 每 5 分鐘最多 300 次請求（防止短時間大量請求）
Rack::Attack.throttle("req/ip/5min", limit: 300, period: 5.minutes) do |req|
  real_ip(req) unless req.path.start_with?("/up")
end

### Blocklist：可疑掃描路徑直接拒絕 ###
# 常見漏洞掃描路徑，直接回 403 不消耗 Rails 資源
Rack::Attack.blocklist("block/scanner-paths") do |req|
  path = req.path.downcase
  # 只阻擋明確的惡意路徑，避免誤擋合法請求
  (path.include?(".env") || path.include?("phpinfo") || path.include?("/api/node/") || path.include?("/apis/"))
end
