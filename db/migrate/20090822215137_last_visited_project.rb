class LastVisitedProject < ActiveRecord::Migration
  def self.up
    add_column :users, :last_seen_project_id, :integer
  end

  def self.down
    remove_column :users, :last_seen_project_id
  end
end
