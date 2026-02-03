class Api::BaseController < ActionController::Base
  # API controllers don't need CSRF protection
  skip_before_action :verify_authenticity_token
  
  # Skip browser version check for API endpoints (if it exists)
  skip_before_action :allow_browser, raise: false
end
