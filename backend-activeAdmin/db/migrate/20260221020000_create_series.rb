# frozen_string_literal: true

class CreateSeries < ActiveRecord::Migration[7.2]
  def change
    create_table :series do |t|
      t.string :series_name, null: false

      t.timestamps
    end

    add_index :series, :series_name
  end
end
