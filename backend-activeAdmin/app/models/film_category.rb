# frozen_string_literal: true

class FilmCategory < ApplicationRecord
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "film_category", "id", "updated_at"]
  end
end
