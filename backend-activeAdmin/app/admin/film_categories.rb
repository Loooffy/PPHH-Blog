# frozen_string_literal: true

ActiveAdmin.register FilmCategory do
  permit_params :film_category

  menu label: "Film categories"

  index do
    selectable_column
    id_column
    column :film_category
    column :created_at
    column :updated_at
    actions
  end

  filter :film_category
  filter :created_at

  form do |f|
    f.inputs do
      f.input :film_category, label: "Film category Name"
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :film_category
      row :created_at
      row :updated_at
    end
  end
end
