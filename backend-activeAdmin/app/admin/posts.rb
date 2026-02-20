# frozen_string_literal: true

ActiveAdmin.register Post do
  permit_params :user_id, :author_id, :director_id, :type, :title, :description, :slug, :content,
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
  filter :tags_id_eq, as: :select, collection: Tag.pluck(:name, :id), label: "Tag"

  form do |f|
    f.inputs "Post" do
      f.input :type, as: :select, collection: [["DevPost", "DevPost"], ["GamePost", "GamePost"], ["BookPost", "BookPost"], ["FilmPost", "FilmPost"]], include_blank: false
      f.input :user
      f.input :author, collection: Author.all, label: "Author (for BookPost)"
      f.input :director, collection: Director.all, label: "Director (for FilmPost)"
      f.input :title
      f.input :description
      f.input :slug
      f.input :content, as: :markdown_editor
      f.input :year
      f.input :rating
      f.input :status
      f.input :published_at
      f.input :tags, as: :select, multiple: true, collection: Tag.all
    end
    f.actions
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
