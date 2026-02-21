# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_02_21_072542) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "people", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "person_type_id", null: false
    t.index ["name"], name: "index_people_on_name", unique: true
    t.index ["person_type_id"], name: "index_people_on_person_type_id"
  end

  create_table "person_types", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_person_types_on_name", unique: true
  end

  create_table "post_tags", force: :cascade do |t|
    t.bigint "post_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id", "tag_id"], name: "index_post_tags_on_post_id_and_tag_id", unique: true
    t.index ["post_id"], name: "index_post_tags_on_post_id"
    t.index ["tag_id"], name: "index_post_tags_on_tag_id"
  end

  create_table "post_types", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_post_types_on_name", unique: true
  end

  create_table "posts", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "author_id"
    t.bigint "director_id"
    t.string "title"
    t.string "description"
    t.string "slug"
    t.text "content"
    t.integer "year"
    t.integer "rating"
    t.string "status"
    t.datetime "published_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "post_type_id", null: false
    t.string "image_key"
    t.index ["author_id"], name: "index_posts_on_author_id"
    t.index ["director_id"], name: "index_posts_on_director_id"
    t.index ["post_type_id"], name: "index_posts_on_post_type_id"
    t.index ["slug"], name: "index_posts_on_slug", unique: true
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "series", force: :cascade do |t|
    t.string "series_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "post_type_id", null: false
    t.index ["post_type_id"], name: "index_series_on_post_type_id"
    t.index ["series_name"], name: "index_series_on_series_name"
  end

  create_table "series_posts", force: :cascade do |t|
    t.bigint "series_id", null: false
    t.bigint "post_id", null: false
    t.integer "position", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_series_posts_on_post_id"
    t.index ["series_id", "position"], name: "index_series_posts_on_series_id_and_position"
    t.index ["series_id", "post_id"], name: "index_series_posts_on_series_id_and_post_id", unique: true
    t.index ["series_id"], name: "index_series_posts_on_series_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "post_type_id", null: false
    t.index ["post_type_id"], name: "index_tags_on_post_type_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "people", "person_types"
  add_foreign_key "post_tags", "posts"
  add_foreign_key "post_tags", "tags"
  add_foreign_key "posts", "people", column: "author_id"
  add_foreign_key "posts", "people", column: "director_id"
  add_foreign_key "posts", "post_types"
  add_foreign_key "posts", "users"
  add_foreign_key "series", "post_types"
  add_foreign_key "series_posts", "posts"
  add_foreign_key "series_posts", "series"
  add_foreign_key "tags", "post_types"
end
