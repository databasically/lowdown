class CreateProjectItems < ActiveRecord::Migration
  def self.up
    create_table :project_items do |t|
      t.string :type
      t.string :name
      t.binary :hash
      t.text :formatted
      t.integer :project_id
      t.integer :position

      t.timestamps
    end
  end

  def self.down
    drop_table :project_items
  end
end
