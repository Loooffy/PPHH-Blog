class PostTag < ApplicationRecord
  belongs_to :post
  belongs_to :tag

  validates :post_id, uniqueness: { scope: :tag_id }

  def self.ransackable_attributes(auth_object = nil)
    %w[id post_id tag_id created_at updated_at]
  end
end
