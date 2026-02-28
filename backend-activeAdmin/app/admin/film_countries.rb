# frozen_string_literal: true

ActiveAdmin.register FilmCountry do
  permit_params :film_conuntry

  menu label: "Film countries"

  index do
    selectable_column
    id_column
    column :film_conuntry
    column :created_at
    column :updated_at
    actions
  end

  filter :film_conuntry
  filter :created_at

  form do |f|
    f.inputs do
      f.input :film_conuntry, label: "Film country Name"
    end
    f.actions
  end

  show do
    attributes_table do
      row :id
      row :film_conuntry
      row :created_at
      row :updated_at
    end
  end
end
