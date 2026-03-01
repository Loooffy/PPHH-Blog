# frozen_string_literal: true

class SeriesPost < ApplicationRecord
  belongs_to :series
  belongs_to :post

  validates :post_id, uniqueness: { scope: :series_id }
  validates :position, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validate :series_post_type_must_match_post_type

  private

  def series_post_type_must_match_post_type
    return if series.blank? || post.blank?

    if series.post_type_id != post.post_type_id
      errors.add(:series_id, "的 Post Type (#{series.post_type&.name}) 必須與文章的 Post Type (#{post.post_type&.name}) 一致")
    end
  end
end
