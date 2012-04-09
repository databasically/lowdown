class AddSubscriptionActiveToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :subscription_active, :boolean
  end

  def self.down
    remove_column :users, :subscription_active
  end
end
