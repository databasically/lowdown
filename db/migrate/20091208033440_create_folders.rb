class CreateFolders < ActiveRecord::Migration
  def self.up
    create_table :folders do |t|
      t.integer :project_id
      t.string :name
    
      t.timestamps
    end
    add_index :folders, :project_id
    add_index :folders, :name  # default order is by name
    
    add_column :project_items, :folder_id, :integer
    add_index :project_items, :folder_id
    
    Folder.reset_column_information
    ProjectItem.reset_column_information
    
    Project.find_in_batches(:batch_size => 100) do |batch|
      batch.each do |project|
        folder = project.folders.create(:name => "Folder 1")
        folder.save
        project.project_items.update_all(:folder_id => folder.id)
      end
    end
    
  end

  def self.down
    remove_index :folders, :name
    
    remove_index :folders, :project_id
    remove_index :project_items, :folder_id
    remove_column :project_items, :folder_id
    drop_table :folders
  end
end
