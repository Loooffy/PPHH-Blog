class AddPostIdToPostFilmInfos < ActiveRecord::Migration[7.2]
  def change
    add_reference :post_film_infos, :post, null: true, foreign_key: true, index: { unique: true }
  end
end
