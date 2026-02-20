class CreatePosts < ActiveRecord::Migration[7.2]
  def change
    create_table :posts do |t|
      t.references :user, null: true, foreign_key: true
      t.references :author, null: true, foreign_key: { to_table: :people }
      t.references :director, null: true, foreign_key: { to_table: :people }
      t.string :type, null: false
      t.string :title
      t.string :description
      t.string :slug
      t.text :content
      t.integer :year
      t.integer :rating
      t.string :status
      t.datetime :published_at

      t.timestamps
    end

    add_index :posts, :slug, unique: true
  end
end
