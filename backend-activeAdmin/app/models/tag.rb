# frozen_string_literal: true

class Tag < ApplicationRecord
  belongs_to :post_type
  has_many :post_tags, dependent: :destroy
  has_many :posts, through: :post_tags

  def self.ransackable_attributes(auth_object = nil)
    %w[id name post_type_id created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[post_type posts]
  end
end
