class AddFieldsToPosts < ActiveRecord::Migration[8.1]
  def change
    add_column :posts, :category, :string
    add_column :posts, :layout_type, :string
    add_column :posts, :excerpt, :text
    add_column :posts, :status, :string
    add_column :posts, :published_at, :datetime
    add_column :posts, :author, :string
    add_column :posts, :book_title, :string
    add_column :posts, :book_author, :string
    add_column :posts, :book_genre, :string
    add_column :posts, :book_published_year, :integer
    add_column :posts, :book_rating, :decimal, precision: 3, scale: 1
    add_column :posts, :movie_title, :string
    add_column :posts, :movie_director, :string
    add_column :posts, :movie_genre, :string
    add_column :posts, :movie_release_year, :integer
    add_column :posts, :movie_rating, :decimal, precision: 3, scale: 1
    add_column :posts, :movie_imdb_id, :string
    add_column :posts, :meta_title, :string
    add_column :posts, :meta_description, :text
    add_column :posts, :og_image_url, :string
  end
end
