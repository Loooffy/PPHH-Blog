# frozen_string_literal: true

class Post < ApplicationRecord
  scope :dev_posts, -> { joins(:post_type).where(post_types: { name: "DevPost" }) }
  scope :game_posts, -> { joins(:post_type).where(post_types: { name: "GamePost" }) }
  scope :book_posts, -> { joins(:post_type).where(post_types: { name: "BookPost" }) }
  scope :film_posts, -> { joins(:post_type).where(post_types: { name: "FilmPost" }) }

  belongs_to :post_type
  belongs_to :user, optional: true
  belongs_to :author, class_name: "Person", optional: true, inverse_of: :authored_posts
  belongs_to :director, class_name: "Person", optional: true, inverse_of: :directed_posts
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags
  has_many :series_posts, dependent: :destroy
  has_many :series, through: :series_posts

  accepts_nested_attributes_for :series_posts, allow_destroy: true, reject_if: ->(attrs) { attrs["series_id"].blank? }

  validates :slug, uniqueness: true, allow_blank: true
  validates :post_type, presence: true

  before_validation :set_default_slug, on: :create

  def set_default_slug
    return if slug.present? || title.blank?

    full_hash = Digest::MD5.hexdigest(title)
    candidate = full_hash[0, 8]
    # 若發生碰撞，使用更多字元
    candidate = full_hash[0, 16] while Post.exists?(slug: candidate)
    self.slug = candidate
  end

  def type
    post_type&.name
  end

  def book_post?
    post_type&.name == "BookPost"
  end

  def film_post?
    post_type&.name == "FilmPost"
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[id user_id author_id director_id post_type_id title description slug content year rating status published_at created_at updated_at]
  end

  def primary_series_info
    sp = series_posts.includes(:series).order("series_posts.position").first
    return nil unless sp

    { name: sp.series.series_name, position: sp.position }
  end

  def self.ransackable_associations(auth_object = nil)
    %w[user author director post_type tags series]
  end
end
