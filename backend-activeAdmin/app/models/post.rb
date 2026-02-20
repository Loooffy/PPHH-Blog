class Post < ApplicationRecord
  scope :dev_posts, -> { where(type: "DevPost") }
  scope :game_posts, -> { where(type: "GamePost") }
  scope :book_posts, -> { where(type: "BookPost") }
  scope :film_posts, -> { where(type: "FilmPost") }

  belongs_to :user, optional: true
  belongs_to :author, class_name: "Person", optional: true, inverse_of: :authored_posts
  belongs_to :director, class_name: "Person", optional: true, inverse_of: :directed_posts
  has_many :post_tags, dependent: :destroy
  has_many :tags, through: :post_tags

  validates :slug, uniqueness: true, allow_blank: true
  validates :type, presence: true

  before_validation :set_default_slug, on: :create

  def set_default_slug
    return if slug.present? || title.blank?

    full_hash = Digest::MD5.hexdigest(title)
    candidate = full_hash[0, 8]
    # 若發生碰撞，使用更多字元
    candidate = full_hash[0, 16] while Post.exists?(slug: candidate)
    self.slug = candidate
  end

  def self.ransackable_attributes(auth_object = nil)
    %w[id user_id author_id director_id type title description slug content year rating status published_at created_at updated_at]
  end

  def self.ransackable_associations(auth_object = nil)
    %w[user author director tags]
  end
end
