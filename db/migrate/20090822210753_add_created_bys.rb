class AddCreatedBys < ActiveRecord::Migration
  def self.up
    add_column :project_items, :creator_id, :integer
    add_column :project_items, :updater_id, :integer
    add_column :projects, :updater_id, :integer
  end

  def self.down
    remove_column :table_name, :column_name
    remove_column :project_items, :updater_id
    remove_column :project_items, :creator_id
  end
end
