# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "localhost:3000", "127.0.0.1:3000", /localhost(:\d+)?/, /127\.0\.0\.1(:\d+)?/
    resource "/api/*", headers: :any, methods: [:get, :post, :patch, :put, :delete, :options, :head]
  end
end
