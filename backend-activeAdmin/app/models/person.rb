# frozen_string_literal: true

class Person < ApplicationRecord
  scope :directors, -> { joins(:person_type).where(person_types: { name: "Director" }) }
  scope :authors, -> { joins(:person_type).where(person_types: { name: "Author" }) }

  belongs_to :person_type
  has_many :authored_posts, class_name: "Post", foreign_key: :author_id, dependent: :nullify, inverse_of: :author
  has_many :directed_posts, class_name: "Post", foreign_key: :director_id, dependent: :nullify, inverse_of: :director

  validates :name, presence: true, uniqueness: true

  def director?
    person_type&.name == "Director"
  end

  def author?
    person_type&.name == "Author"
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[id name person_type_id created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[person_type authored_posts directed_posts]
  end
end
