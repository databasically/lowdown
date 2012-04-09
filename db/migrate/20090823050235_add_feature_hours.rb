class AddFeatureHours < ActiveRecord::Migration
  def self.up
    remove_column :projects, :hours # dunno what I was thinking when I added this
    add_column :project_items, :hours, :integer, :default => 0
  end

  def self.down
    add_column :projects, :hours, :integer, :default => 0
    remove_column :project_items, :hours
  end
end
