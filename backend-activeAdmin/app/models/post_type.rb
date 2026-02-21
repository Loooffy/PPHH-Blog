# frozen_string_literal: true

class PostType < ApplicationRecord
  has_many :posts, dependent: :restrict_with_error
  has_many :tags, dependent: :restrict_with_error
  has_many :series, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: true
end
