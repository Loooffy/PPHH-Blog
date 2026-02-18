# db/migrate/20260210100000_add_devise_to_admins.rb
class AddDeviseToAdmins < ActiveRecord::Migration[8.1]
  def change
    change_table :admins, bulk: true do |t|
      t.string :encrypted_password, null: false, default: ""
    end
  end
end
