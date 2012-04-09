class Folder < ActiveRecord::Base
  belongs_to :project
  has_many :project_items, :order => "position", :dependent => :destroy
  has_many :features, :order => "position", :foreign_key => 'folder_id'
  has_many :milestones, :order => "position", :foreign_key => 'folder_id'
  
  validates_presence_of :name
  
  before_validation_on_create :create_default_name
  
  def reorder!(ids)
    transaction do
      # Make sure we do a total reordering
      ids = (ids.map(&:to_i) + project_item_ids).uniq
      ids.each_with_index do |id, index|
        # Don't trigger callbacks
        project_items.update_all({:position => index+1}, {:id => id})
      end
    end
  end

  private
  def create_default_name
    self.name ||= "Folder " + (project.folders.count + 1).to_s
  end
end
