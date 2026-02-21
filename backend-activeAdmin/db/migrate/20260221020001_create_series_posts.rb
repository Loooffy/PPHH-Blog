# frozen_string_literal: true

class CreateSeriesPosts < ActiveRecord::Migration[7.2]
  def change
    create_table :series_posts do |t|
      t.references :series, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      t.integer :position, null: false, default: 1

      t.timestamps
    end

    add_index :series_posts, [:series_id, :post_id], unique: true
    add_index :series_posts, [:series_id, :position]
  end
end
