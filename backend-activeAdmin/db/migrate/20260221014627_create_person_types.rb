class CreatePersonTypes < ActiveRecord::Migration[7.2]
  def change
    create_table :person_types do |t|
      t.string :name, null: false

      t.timestamps
    end
    add_index :person_types, :name, unique: true
  end
end
