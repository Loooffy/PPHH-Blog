# frozen_string_literal: true

ActiveAdmin.register Tag do
  permit_params :name, :post_type_id

  index do
    selectable_column
    id_column
    column :name
    column :post_type
    column :created_at
    actions
  end

  filter :name
  filter :post_type_id, as: :select, collection: proc { PostType.pluck(:name, :id) }, label: "Type"
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :post_type, as: :select, collection: PostType.pluck(:name, :id), include_blank: false
    end
    f.actions
  end
end
