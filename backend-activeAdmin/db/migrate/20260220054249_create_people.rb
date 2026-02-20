class CreatePeople < ActiveRecord::Migration[7.2]
  def change
    create_table :people do |t|
      t.string :name, null: false
      t.string :type, null: false

      t.timestamps
    end

    add_index :people, :name, unique: true
  end
end
