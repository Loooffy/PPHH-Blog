# frozen_string_literal: true

class NormalizePostType < ActiveRecord::Migration[7.2]
  def up
    # Seed post_types
    post_type_values = %w[DevPost GamePost BookPost FilmPost]
    post_type_ids = {}
    post_type_values.each do |name|
      id = execute("INSERT INTO post_types (name, created_at, updated_at) VALUES ('#{name}', NOW(), NOW()) RETURNING id").first["id"]
      post_type_ids[name] = id
    end

    # Add post_type_id to posts
    add_reference :posts, :post_type, null: true, foreign_key: true

    # Backfill from type
    post_type_ids.each do |type_name, type_id|
      execute("UPDATE posts SET post_type_id = #{type_id} WHERE type = '#{type_name}'")
    end

    change_column_null :posts, :post_type_id, false
    remove_column :posts, :type
  end

  def down
    add_column :posts, :type, :string

    execute("UPDATE posts SET type = pt.name FROM post_types pt WHERE posts.post_type_id = pt.id")

    remove_reference :posts, :post_type, foreign_key: true
  end
end
