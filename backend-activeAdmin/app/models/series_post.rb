# frozen_string_literal: true

class SeriesPost < ApplicationRecord
  belongs_to :series
  belongs_to :post

  validates :post_id, uniqueness: { scope: :series_id }
  validates :position, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
