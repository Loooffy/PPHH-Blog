# frozen_string_literal: true

class PostFilmInfo < ApplicationRecord
  belongs_to :post, optional: true
  belongs_to :film_category, optional: true
  belongs_to :film_country, optional: true
end
