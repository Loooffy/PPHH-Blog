# frozen_string_literal: true

ActiveAdmin.register Post do
  permit_params :user_id, :author_id, :director_id, :post_type_id, :title, :description, :content,
                :year, :rating, :status, :published_at, :image_key, tag_ids: [],
                series_posts_attributes: [:id, :series_id, :position, :_destroy],
                post_film_info_attributes: [:id, :film_category_id, :film_country_id, :film_length, :_destroy]

  scope :all, default: true
  scope :dev_posts
  scope :game_posts
  scope :book_posts
  scope :film_posts

  index do
    selectable_column
    id_column
    column :title
    column :status
    column :post_type
    column :slug
    column :series do |post|
      if (info = post.primary_series_info)
        link_to info[:name], admin_series_path(info[:series_id])
      else
        status_tag "無系列", class: "warn"
      end
    end
    column "No." do |post|
      if (info = post.primary_series_info)
        info[:position]
      else
        "—"
      end
    end
    actions
  end

  filter :post_type_id, as: :select, collection: proc { PostType.pluck(:name, :id) }, label: "Type"
  filter :title
  filter :user
  filter :author
  filter :director
  filter :status
  filter :published_at
  filter :created_at
  filter :tags_id_eq, as: :select, collection: proc { Tag.includes(:post_type).map { |t| ["#{t.name} (#{t.post_type.name})", t.id] } }, label: "Tag"
  filter :series_id, as: :select, collection: proc { Series.pluck(:series_name, :id) }, label: "Series"

    form do |f|
    f.inputs "Post" do
      f.input :post_type, as: :select, collection: PostType.pluck(:name, :id), include_blank: false
      f.input :title, required: true
      f.input :image_file, as: :file, hint: f.object.image_url.present? ? image_tag(f.object.image_url, height: 100) : "上傳圖片至 R2，由 Cloudflare 輸出"
      f.input :description
      f.input :content, as: :markdown_editor
      f.input :user
      f.input :author, collection: Person.authors, label: "Author (for BookPost)"
      f.input :director, collection: Person.directors, label: "Director (for FilmPost)"
      f.input :year
      f.semantic_fields_for :post_film_info, (f.object.post_film_info || f.object.build_post_film_info) do |pfi|
        pfi.input :film_category_id, as: :select, collection: FilmCategory.pluck(:film_category, :id), label: "Film Category", include_blank: true, required: false
        pfi.input :film_country_id, as: :select, collection: FilmCountry.pluck(:film_conuntry, :id), label: "Film Country", include_blank: true, required: false
        pfi.input :film_length, label: "Film Length (minutes)", required: false
      end
      f.input :rating
      f.input :status, as: :select, collection: [["Draft", "draft"], ["Published", "published"]], include_blank: false
      f.input :tags, as: :check_boxes, collection: Tag.includes(:post_type).map { |t| ["#{t.name} (#{t.post_type.name})", t.id] }
      f.has_many :series_posts, allow_destroy: true, new_record: "新增系列" do |sp|
        post_type_id = f.object.post_type_id || params.dig(:post, :post_type_id)
        series_collection = if post_type_id.present?
          Series.where(post_type_id: post_type_id).pluck(:series_name, :id)
        else
          Series.includes(:post_type).map { |s| ["#{s.series_name} (#{s.post_type.name})", s.id] }
        end
        sp.input :series, as: :select, collection: series_collection, label: "系列", hint: post_type_id.present? ? "僅顯示與此文章 Post Type 相符的系列" : "請選擇與文章 Post Type 相符的系列（建立時會驗證）"
        sp.input :position, label: "順序"
      end
    end
    f.actions do
      f.action :submit, label: "Save"
      f.cancel_link
    end
  end

  controller do
    def build_resource
      resource = super
      if resource.new_record?
        resource.user ||= User.find_by(email: current_admin_user&.email)
        resource.build_post_film_info if resource.post_film_info.nil?
      end
      resource
    end

    def create
      sync_post_status_params!
      process_image_upload!
      create! do |success, failure|
        success.html { redirect_to admin_post_path(resource), notice: "已儲存！" }
      end
    end

    def update
      sync_post_status_params!
      process_image_upload!
      update! do |success, failure|
        success.html { redirect_to admin_post_path(resource), notice: "已儲存！" }
      end
    end

    private

    def sync_post_status_params!
      params[:post] ||= {}
      if params[:post][:status] == "published"
        # For create: always set. For update: only set if not already published
        params[:post][:published_at] = Time.current if action_name != "update" || resource.published_at.blank?
      else
        params[:post][:published_at] = nil
      end
    end

    def process_image_upload!
      image_file = params[:post]&.dig(:image_file)
      return if image_file.blank?

      key = R2StorageService.new.upload(image_file)
      params[:post][:image_key] = key
    rescue R2StorageService::UploadError => e
      flash[:error] = "圖片上傳失敗: #{e.message}"
    end
  end

  action_item :publish, only: :show, if: proc { resource.status != "published" } do
    link_to "Publish",
            publish_admin_post_path(resource),
            method: :put,
            data: { confirm: "確定要發布此文章嗎？" },
            class: "action-item-button"
  end

  action_item :unpublish, only: :show, if: proc { resource.status == "published" } do
    link_to "Unpublish",
            unpublish_admin_post_path(resource),
            method: :put,
            data: { confirm: "確定要取消發布此文章嗎？" },
            class: "action-item-button"
  end

  member_action :publish, method: :put do
    resource.update!(status: "published", published_at: Time.current)
    redirect_to admin_post_path(resource), notice: "已成功發布！"
  end

  member_action :unpublish, method: :put do
    resource.update!(status: "draft", published_at: nil)
    redirect_to admin_post_path(resource), notice: "已取消發布！"
  end

  show do
    attributes_table do
      row :post_type
      row :title
      row :description
      row :slug
      row :content do |post|
        div class: "markdown-content" do
          text_node helpers.render_markdown(post.content)
        end
      end
      row :user
      row :author
      row :director
      row :year
      row :film_info do |post|
        if post.post_film_info
          info = post.post_film_info
          parts = []
          parts << info.film_category&.film_category if info.film_category
          parts << info.film_country&.film_conuntry if info.film_country
          parts << "#{info.film_length} min" if info.film_length.present?
          parts.join(" · ")
        else
          "無"
        end
      end
      row :rating
      row :image_url do |post|
        post.image_url.present? ? image_tag(post.image_url, height: 150) : "無"
      end
      row :status
      row :published_at
      row :created_at
      row :updated_at
      row :tags do |post|
        post.tags.map(&:name).join(", ")
      end
      row :series do |post|
        post.series_posts.order(:position).map do |sp|
          "#{sp.series.series_name} (#{sp.position})"
        end.join(", ")
      end
    end
  end
end
