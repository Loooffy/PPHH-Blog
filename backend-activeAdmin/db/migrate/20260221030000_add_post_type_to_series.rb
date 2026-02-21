# frozen_string_literal: true

class AddPostTypeToSeries < ActiveRecord::Migration[7.2]
  def change
    add_reference :series, :post_type, null: true, foreign_key: true

    reversible do |dir|
      dir.up do
        default_type = PostType.find_by(name: "DevPost") || PostType.first
        if default_type
          Series.where(post_type_id: nil).update_all(post_type_id: default_type.id)
          change_column_null :series, :post_type_id, false
        end
      end
    end
  end
end
