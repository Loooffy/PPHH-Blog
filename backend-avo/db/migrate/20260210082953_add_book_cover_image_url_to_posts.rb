class AddBookCoverImageUrlToPosts < ActiveRecord::Migration[8.1]
  def change
    add_column :posts, :book_cover_image_url, :string
  end
end
