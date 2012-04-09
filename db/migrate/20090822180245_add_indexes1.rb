class AddIndexes1 < ActiveRecord::Migration
  def self.up
    add_index :memberships,   [:user_id, :project_id]
    add_index :projects,      :creator_id
    add_index :projects,      :name
    add_index :project_items, [:project_id, :position]
  end

  def self.down
    remove_index :memberships,   [:user_id, :project_id]
    remove_index :projects,      :creator_id
    remove_index :projects,      :name
    remove_index :project_items, [:project_id, :position]
  end
end
