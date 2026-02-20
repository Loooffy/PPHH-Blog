class User < ApplicationRecord
  has_many :posts, dependent: :nullify

  validates :email, uniqueness: true

  def self.ransackable_attributes(auth_object = nil)
    %w[id username email created_at updated_at]
  end
end
