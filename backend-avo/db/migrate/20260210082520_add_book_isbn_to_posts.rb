class AddBookIsbnToPosts < ActiveRecord::Migration[8.1]
  def change
    add_column :posts, :book_isbn, :integer
  end
end
