class ChangePostFilmInfosFilmCategoryAndCountryToOptional < ActiveRecord::Migration[7.2]
  def change
    change_column_null :post_film_infos, :film_category_id, true
    change_column_null :post_film_infos, :film_country_id, true
  end
end
