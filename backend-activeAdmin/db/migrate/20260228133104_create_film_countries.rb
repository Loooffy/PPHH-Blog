class CreateFilmCountries < ActiveRecord::Migration[7.2]
  def change
    create_table :film_countries do |t|
      t.string :film_conuntry

      t.timestamps
    end
  end
end
