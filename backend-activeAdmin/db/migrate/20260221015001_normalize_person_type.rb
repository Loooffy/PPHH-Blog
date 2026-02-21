# frozen_string_literal: true

class NormalizePersonType < ActiveRecord::Migration[7.2]
  def up
    # Seed person_types
    person_type_values = %w[Director Author]
    person_type_ids = {}
    person_type_values.each do |name|
      id = execute("INSERT INTO person_types (name, created_at, updated_at) VALUES ('#{name}', NOW(), NOW()) RETURNING id").first["id"]
      person_type_ids[name] = id
    end

    # Add person_type_id to people
    add_reference :people, :person_type, null: true, foreign_key: true

    # Backfill from type
    person_type_ids.each do |type_name, type_id|
      execute("UPDATE people SET person_type_id = #{type_id} WHERE type = '#{type_name}'")
    end

    change_column_null :people, :person_type_id, false
    remove_column :people, :type
  end

  def down
    add_column :people, :type, :string

    execute("UPDATE people SET type = pt.name FROM person_types pt WHERE people.person_type_id = pt.id")

    remove_reference :people, :person_type, foreign_key: true
  end
end
