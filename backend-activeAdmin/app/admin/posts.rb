# frozen_string_literal: true

ActiveAdmin.register Post do
  permit_params :user_id, :author_id, :director_id, :type, :title, :description, :content,
                :year, :rating, :status, :published_at, tag_ids: []

  scope :all, default: true
  scope :dev_posts
  scope :game_posts
  scope :book_posts
  scope :film_posts

  index do
    selectable_column
    id_column
    column :type
    column :title
    column :user
    column :status
    column :published_at
    column :created_at
    actions
  end

  filter :type, as: :select, collection: [["DevPost", "DevPost"], ["GamePost", "GamePost"], ["BookPost", "BookPost"], ["FilmPost", "FilmPost"]]
  filter :title
  filter :user
  filter :author
  filter :director
  filter :status
  filter :published_at
  filter :created_at
  filter :tags_id_eq, as: :select, collection: proc { Tag.pluck(:name, :id) }, label: "Tag"

  form do |f|
    f.inputs "Post" do
      f.input :type, as: :select, collection: [["DevPost", "DevPost"], ["GamePost", "GamePost"], ["BookPost", "BookPost"], ["FilmPost", "FilmPost"]], include_blank: false
      f.input :user
      f.input :author, collection: Author.all, label: "Author (for BookPost)"
      f.input :director, collection: Director.all, label: "Director (for FilmPost)"
      f.input :title
      f.input :description
      f.input :content, as: :markdown_editor
      f.input :year
      f.input :rating
      f.input :status, as: :select, collection: [["Draft", "draft"], ["Published", "published"]], include_blank: false
      f.input :tags, as: :check_boxes, collection: Tag.pluck(:name, :id)
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
      end
      resource
    end

    def create
      sync_post_status_params!
      create! do |success, failure|
        success.html { redirect_to admin_post_path(resource), notice: "已儲存！" }
      end
    end

    def update
      sync_post_status_params!
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
      row :type
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
      row :rating
      row :status
      row :published_at
      row :created_at
      row :updated_at
      row :tags do |post|
        post.tags.map(&:name).join(", ")
      end
    end
  end
end
