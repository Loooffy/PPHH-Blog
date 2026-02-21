class CreatePostTypes < ActiveRecord::Migration[7.2]
  def change
    create_table :post_types do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index :post_types, :name, unique: true
  end
end
