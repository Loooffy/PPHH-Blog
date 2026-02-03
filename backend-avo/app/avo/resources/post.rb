class Avo::Resources::Post < Avo::BaseResource
  def index_fields
    field :id, as: :id
    field :title, as: :text
    field :category, as: :select, options: {
      '軟體開發': '軟體開發',
      '遊戲開發': '遊戲開發',
      '影評': '影評',
      '書評': '書評'
    }
    field :status, as: :select, options: {
      'draft': 'draft',
      'published': 'published',
      'archived': 'archived'
    }
    field :published_at, as: :date_time
    field :updated_at, as: :date_time
  end

  def fields
    # 共用欄位
    panel "基本資訊" do
      field :title, as: :text
      field :slug, as: :text
      field :category, as: :select, options: {
        '軟體開發': '軟體開發',
        '遊戲開發': '遊戲開發',
        '影評': '影評',
        '書評': '書評'
      }
      field :excerpt, as: :textarea
      field :status, as: :select, options: {
        'draft': 'draft',
        'published': 'published',
        'archived': 'archived'
      }, default: 'published'
      field :published_at, as: :date_time
      field :author, as: :text, 
            if: -> { 
              layout_type = resource.record&.layout_type
              layout_type.nil? || layout_type != 'tech'
            }
      field :content, as: :rhino
    end

    # 書評專屬欄位
    panel "書評資訊", 
          description: "書評專用欄位（僅當 layout_type 為 'book' 時顯示）" do
      field :book_title, as: :text, 
            if: -> { resource.record&.layout_type == 'book' }
      field :book_author, as: :text, 
            if: -> { resource.record&.layout_type == 'book' }
      field :book_genre, as: :select, 
            options: {
              '小說': '小說',
              '散文': '散文',
              '商業': '商業',
              '科技': '科技',
              '心理': '心理',
              '歷史': '歷史'
            },
            if: -> { resource.record&.layout_type == 'book' }
      field :book_published_year, as: :number, 
            if: -> { resource.record&.layout_type == 'book' }
      field :book_rating, as: :number, step: 0.1, 
            if: -> { resource.record&.layout_type == 'book' }
      field :book_isbn, as: :text, 
            if: -> { resource.record&.layout_type == 'book' }
    end

    # 影評專屬欄位
    panel "影評資訊",
          description: "影評專用欄位（僅當 layout_type 為 'movie' 時顯示）" do
      field :movie_title, as: :text, 
            if: -> { resource.record&.layout_type == 'movie' }
      field :movie_director, as: :text, 
            if: -> { resource.record&.layout_type == 'movie' }
      field :movie_genre, as: :select,
            options: {
              '動作': '動作',
              '劇情': '劇情',
              '科幻': '科幻',
              '恐怖': '恐怖',
              '喜劇': '喜劇',
              '愛情': '愛情',
              '紀錄片': '紀錄片'
            },
            if: -> { resource.record&.layout_type == 'movie' }
      field :movie_release_year, as: :number, 
            if: -> { resource.record&.layout_type == 'movie' }
      field :movie_rating, as: :number, step: 0.1, 
            if: -> { resource.record&.layout_type == 'movie' }
      field :movie_imdb_id, as: :text, 
            if: -> { resource.record&.layout_type == 'movie' }
    end

    # 軟體開發專屬欄位
    panel "軟體開發資訊",
          description: "軟體開發專用欄位（僅當 category 為 '軟體開發' 時顯示）" do
      # 未來可在此添加軟體開發專屬欄位
    end

    # 遊戲開發專屬欄位
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