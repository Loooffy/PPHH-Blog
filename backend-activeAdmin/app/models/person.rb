class Person < ApplicationRecord
  scope :directors, -> { where(type: "Director") }
  scope :authors, -> { where(type: "Author") }

  has_many :authored_posts, class_name: "Post", foreign_key: :author_id, dependent: :nullify, inverse_of: :author
  has_many :directed_posts, class_name: "Post", foreign_key: :director_id, dependent: :nullify, inverse_of: :director

  validates :name, presence: true, uniqueness: true

  def self.ransackable_attributes(auth_object = nil)
    %w[id name type created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[authored_posts directed_posts]
  end
end
