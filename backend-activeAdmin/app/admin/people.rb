# frozen_string_literal: true

ActiveAdmin.register Person do
  permit_params :name, :type

  scope :all, default: true
  scope :directors, -> { where(type: "Director") }
  scope :authors, -> { where(type: "Author") }

  index do
    selectable_column
    id_column
    column :name
    column :type
    column :created_at
    actions
  end

  filter :name
  filter :type, as: :select, collection: [["Director", "Director"], ["Author", "Author"]]
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :type, as: :select, collection: [["Director", "Director"], ["Author", "Author"]], include_blank: false
    end
    f.actions
  end
end
