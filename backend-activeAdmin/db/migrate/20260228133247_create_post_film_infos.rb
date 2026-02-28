class CreatePostFilmInfos < ActiveRecord::Migration[7.2]
  def change
    create_table :post_film_infos do |t|
      t.integer :film_length
      t.references :film_country, null: false, foreign_key: true
      t.references :film_category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
