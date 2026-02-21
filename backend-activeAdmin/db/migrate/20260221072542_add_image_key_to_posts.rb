class AddImageKeyToPosts < ActiveRecord::Migration[7.2]
  def change
    add_column :posts, :image_key, :string
  end
end
