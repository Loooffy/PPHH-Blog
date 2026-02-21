# frozen_string_literal: true

ActiveAdmin.register Series do
  permit_params :series_name, :post_type_id

  index do
    selectable_column
    id_column
    column :series_name
    column :post_type
    column "文章數" do |s|
      s.posts.count
    end
    column :created_at
    actions
  end

  filter :series_name
  filter :post_type_id, as: :select, collection: proc { PostType.pluck(:name, :id) }, label: "Type"
  filter :created_at

  form do |f|
    f.inputs do
      f.input :series_name
      f.input :post_type, as: :select, collection: PostType.pluck(:name, :id), include_blank: false
    end
    f.actions
  end

  show do
    attributes_table do
      row :series_name
      row :post_type
      row :created_at
      row :updated_at
      row :posts do |series|
        series.series_posts.order(:position).map do |sp|
          "##{sp.position} #{sp.post&.title}"
        end.join(", ")
      end
    end
  end
end
