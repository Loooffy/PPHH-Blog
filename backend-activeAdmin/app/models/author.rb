class Author < Person
  has_many :posts, foreign_key: :author_id, dependent: :nullify, inverse_of: :author
end
