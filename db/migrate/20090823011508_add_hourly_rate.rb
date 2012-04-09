class AddHourlyRate < ActiveRecord::Migration
  def self.up
    add_column :projects, :rate, :integer, :default => 0
  end

  def self.down
    remove_column :projects, :rate
  end
end
