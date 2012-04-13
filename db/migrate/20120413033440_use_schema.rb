class UseSchema < ActiveRecord::Migration
  def self.up
    puts "\n\n"
    puts "=" * 60
    puts "Previous migrations have been removed.\n\n"
    puts "Use 'rake db:schema:load' to load database tables."
    puts "=" * 60
    puts "\n\n"
  end

  def self.down
    remove_index :folders, :name
    
    remove_index :folders, :project_id
    remove_index :project_items, :folder_id
    remove_column :project_items, :folder_id
    drop_table :folders
  end
end
