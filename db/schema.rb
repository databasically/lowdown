# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20091208033440) do

  create_table "folders", :force => true do |t|
    t.integer  "project_id"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "folders", ["name"], :name => "index_folders_on_name"
  add_index "folders", ["project_id"], :name => "index_folders_on_project_id"

  create_table "memberships", :force => true do |t|
    t.integer  "user_id"
    t.integer  "project_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "memberships", ["user_id", "project_id"], :name => "index_memberships_on_user_id_and_project_id"

  create_table "open_id_authentication_associations", :force => true do |t|
    t.integer "issued"
    t.integer "lifetime"
    t.string  "handle"
    t.string  "assoc_type"
    t.binary  "server_url"
    t.binary  "secret"
  end

  create_table "open_id_authentication_nonces", :force => true do |t|
    t.integer "timestamp",  :null => false
    t.string  "server_url"
    t.string  "salt",       :null => false
  end

  create_table "project_items", :force => true do |t|
    t.string   "type"
    t.string   "name"
    t.binary   "tree"
    t.text     "formatted"
    t.integer  "project_id"
    t.integer  "position"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "creator_id"
    t.integer  "updater_id"
    t.integer  "hours",          :default => 0
    t.integer  "scenario_count", :default => 0
    t.integer  "folder_id"
  end

  add_index "project_items", ["folder_id"], :name => "index_project_items_on_folder_id"
  add_index "project_items", ["project_id", "position"], :name => "index_project_items_on_project_id_and_position"

  create_table "projects", :force => true do |t|
    t.string   "name"
    t.integer  "creator_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "updater_id"
    t.integer  "rate",       :default => 0
  end

  add_index "projects", ["creator_id"], :name => "index_projects_on_creator_id"
  add_index "projects", ["name"], :name => "index_projects_on_name"

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "users", :force => true do |t|
    t.string   "fullname"
    t.string   "email"
    t.string   "timezone"
    t.string   "language"
    t.string   "crypted_password"
    t.string   "password_salt"
    t.string   "openid_identifier"
    t.string   "perishable_token"
    t.string   "persistence_token"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "last_seen_project_id"
    t.boolean  "subscription_active"
  end

  add_index "users", ["email"], :name => "index_users_on_email"
  add_index "users", ["openid_identifier"], :name => "index_users_on_openid_identifier"

end
