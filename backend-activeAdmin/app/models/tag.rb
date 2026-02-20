class Tag < ApplicationRecord
  has_many :post_tags, dependent: :destroy
  has_many :posts, through: :post_tags

  def self.ransackable_attributes(auth_object = nil)
    %w[id name created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[posts]
  end
end
