# frozen_string_literal: true

class FilmCountry < ApplicationRecord
  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "film_conuntry", "id", "updated_at"]
  end
end
