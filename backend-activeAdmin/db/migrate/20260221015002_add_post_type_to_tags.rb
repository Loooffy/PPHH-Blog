# frozen_string_literal: true

class AddPostTypeToTags < ActiveRecord::Migration[7.2]
  def up
    dev_post_type_id = execute("SELECT id FROM post_types WHERE name = 'DevPost' LIMIT 1").first["id"]

    add_reference :tags, :post_type, null: true, foreign_key: true
    execute("UPDATE tags SET post_type_id = #{dev_post_type_id} WHERE post_type_id IS NULL")
    change_column_null :tags, :post_type_id, false
  end

  def down
    remove_reference :tags, :post_type, foreign_key: true
  end
end
