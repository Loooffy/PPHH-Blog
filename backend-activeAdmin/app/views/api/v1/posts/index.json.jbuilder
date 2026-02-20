# frozen_string_literal: true

json.posts @posts do |post|
  json.id post.id
  json.type post.type
  json.title post.title
  json.description post.description
  json.slug post.slug
  json.year post.year
  json.rating post.rating
  json.published_at post.published_at
  json.created_at post.created_at
  json.author post.author&.name if post.is_a?(BookPost)
  json.director post.director&.name if post.is_a?(FilmPost)
  json.tags post.tags do |tag|
    json.id tag.id
    json.name tag.name
  end
end

json.meta do
  json.current_page @posts.current_page
  json.total_pages @posts.total_pages
  json.total_count @posts.total_count
  json.per_page @posts.limit_value
end
