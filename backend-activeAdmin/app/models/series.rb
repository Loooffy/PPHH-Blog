# frozen_string_literal: true

class Series < ApplicationRecord
  belongs_to :post_type, optional: true
  has_many :series_posts, -> { order(:position) }, dependent: :destroy
  has_many :posts, through: :series_posts

  validates :series_name, presence: true
  validates :post_type, presence: true

  def self.ransackable_attributes(auth_object = nil)
    %w[id series_name post_type_id created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[post_type series_posts posts]
  end
end
