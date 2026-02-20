# frozen_string_literal: true

# Committee: OpenAPI request/response validation
# https://github.com/interagent/committee
#
# Set COMMITTEE_VALIDATE=true to enable, COMMITTEE_VALIDATE=false to disable
# Default: enabled in development/test, disabled in production
committee_enabled = if ENV.key?("COMMITTEE_VALIDATE")
  %w[1 true yes].include?(ENV["COMMITTEE_VALIDATE"].to_s.downcase)
else
  Rails.env.development? || Rails.env.test?
end

if committee_enabled
  schema_path = Rails.root.join("swagger", "openapi.yaml")

  Rails.application.config.middleware.use Committee::Middleware::RequestValidation,
    schema_path: schema_path.to_s,
    prefix: "/api/v1",
    coerce_date_times: true,
    coerce_query_params: true,
    params_key: "action_dispatch.request.request_parameters",
    strict_reference_validation: true

  Rails.application.config.middleware.use Committee::Middleware::ResponseValidation,
    schema_path: schema_path.to_s,
    prefix: "/api/v1",
    validate_success_only: true,
    strict_reference_validation: true
end
