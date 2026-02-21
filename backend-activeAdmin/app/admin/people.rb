# frozen_string_literal: true

ActiveAdmin.register Person do
  permit_params :name, :person_type_id

  scope :all, default: true
  scope :directors
  scope :authors

  index do
    selectable_column
    id_column
    column :name
    column :person_type
    column :created_at
    actions
  end

  filter :name
  filter :person_type_id, as: :select, collection: proc { PersonType.pluck(:name, :id) }, label: "Type"
  filter :created_at

  form do |f|
    f.inputs do
      f.input :name
      f.input :person_type, as: :select, collection: PersonType.pluck(:name, :id), include_blank: false
    end
    f.actions
  end
end
