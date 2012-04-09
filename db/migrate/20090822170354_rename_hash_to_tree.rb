class RenameHashToTree < ActiveRecord::Migration
  def self.up
    rename_column :project_items, :hash, :tree
  end

  def self.down
    rename_column :project_items, :tree, :hash
  end
end
