# frozen_string_literal: true

json.series @series do |s|
  json.id s.id
  json.series_name s.series_name
  json.type s.post_type&.name
end
