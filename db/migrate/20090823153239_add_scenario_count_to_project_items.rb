class AddScenarioCountToProjectItems < ActiveRecord::Migration
  def self.up
    add_column :project_items, :scenario_count, :integer, :default => 0
  end

  def self.down
    remove_column :project_items, :scenario_count
  end
end
