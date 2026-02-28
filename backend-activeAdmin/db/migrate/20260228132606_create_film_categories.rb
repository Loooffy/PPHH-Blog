class CreateFilmCategories < ActiveRecord::Migration[7.2]
  def change
    create_table :film_categories do |t|
      t.string :film_category

      t.timestamps
    end
  end
end
