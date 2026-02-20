# frozen_string_literal: true

ActiveAdmin.register User do
  permit_params :username, :email

  index do
    selectable_column
    id_column
    column :username
    column :email
    column :created_at
    actions
  end

  filter :username
  filter :email
  filter :created_at

  form do |f|
    f.inputs do
      f.input :username
      f.input :email
    end
    f.actions
  end
end
