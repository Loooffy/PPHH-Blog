# frozen_string_literal: true

json.series_id series_id
json.posts items do |sp|
  post = sp.post
  json.id post.id
  json.slug post.slug
  json.title post.title
  json.type post.post_type&.name
  json.series_id series_id
  json.series_number sp.position
end
