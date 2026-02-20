class Director < Person
  has_many :posts, foreign_key: :director_id, dependent: :nullify, inverse_of: :director
end
