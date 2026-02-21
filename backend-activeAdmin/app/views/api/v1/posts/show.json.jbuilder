# frozen_string_literal: true

json.id @post.id
json.type @post.post_type&.name
json.title @post.title
json.description @post.description
json.slug @post.slug
json.content @post.content
json.year @post.year
json.rating @post.rating
json.image_url @post.image_url
json.published_at @post.published_at
json.created_at @post.created_at
json.updated_at @post.updated_at
if @post.book_post?
  json.author do
    json.id @post.author&.id
    json.name @post.author&.name
  end
end
if @post.film_post?
  json.director do
    json.id @post.director&.id
    json.name @post.director&.name
  end
end
json.tags @post.tags do |tag|
  json.id tag.id
  json.name tag.name
end
if (info = @post.primary_series_info)
  json.series info[:name]
  json.series_number info[:position]
end
