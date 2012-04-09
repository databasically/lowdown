class ProjHours < ActiveRecord::Migration
  def self.up
    add_column :projects, :hours, :integer, :default => 0
  end

  def self.down
    remove_column :projects, :hours
  end
end
