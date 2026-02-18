class Avo::Resources::Post < Avo::BaseResource
  self.authorization_policy = PostPolicy
  self.show_controls = true
  self.visible_on_sidebar = true

  def index_fields
    field :id, as: :id
    field :title, as: :text
    field :category, as: :select, options: {
      '軟體開發': 'dev',
      '遊戲開發': 'game',
      '影評': 'film',
      '書評': 'book',
    }
    field :status, as: :select, options: {
      'draft': 'draft',
      'published': 'published',
      'archived': 'archived'
    }
    field :updated_at, as: :date_time
  end

  def fields
    # 共用欄位
    panel "基本資訊" do
      field :title, as: :text
      field :slug, as: :text
      field :category, as: :select, options: {
        '軟體開發': 'dev',
        '遊戲開發': 'game',
        '影評': 'film',
        '書評': 'book',
      }
      field :excerpt, as: :textarea
      field :status, as: :select, options: {
        'draft': 'draft',
        'published': 'published',
        'archived': 'archived'
      }, default: 'published'
      field :published_at, as: :date_time
      field :author, as: :text
      field :content, as: :rhino
    end

    panel "書評資訊",
      visible: -> {resource.record.new_record? || resource.record.category == "book"} do
      field :book_title, as: :text 
      field :book_author, as: :text 
      field :book_published_year, as: :number 
      field :book_rating, as: :number, step: 0.5 
      field :book_isbn, as: :text 
      field :book_cover_image_url, as: :text
    end

    panel "影評資訊", 
      visible: -> {resource.record.new_record? || resource.record.category == "film"} do
      field :movie_title, as: :text
      field :movie_director, as: :text
      field :movie_release_year, as: :number
      field :movie_rating, as: :number, step: 0.1
      field :movie_imdb_id, as: :text
    end

    panel "軟體開發資訊",
          description: "軟體開發專用欄位（僅當 category 為 '軟體開發' 時顯示）" do
      # 未來可在此添加軟體開發專屬欄位
    end

    panel "遊戲開發資訊",
          description: "遊戲開發專用欄位（僅當 category 為 '遊戲開發' 時顯示）" do
      # 未來可在此添加遊戲開發專屬欄位
    end

    # SEO 欄位（所有類型共用）
    panel "SEO 設定" do
      field :meta_title, as: :text
      field :meta_description, as: :textarea
      field :og_image_url, as: :text
    end
  end
end