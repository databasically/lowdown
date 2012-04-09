class ProjectItem < ActiveRecord::Base
  belongs_to :project
  belongs_to :folder
  validates_presence_of :project_id, :folder_id
  validate :folder_belongs_to_project
  acts_as_list :scope => :folder_id

  # Useful for milestone calculations
  named_scope :descending, :order => "position desc"
  named_scope :before, lambda {|item| {:conditions => ["position < ?", item.position] }}
  named_scope :between, lambda {|one, two| {:conditions => {:position => one.position..two.position }}}

  include UserActions

  def move_to(folder)
    raise ArgumentError, "Invalid project" unless folder.project == self.project
    transaction do
      remove_from_list
      self.folder = folder
      add_to_list_bottom
      save!
    end
  end

  private
  def folder_belongs_to_project
    unless folder.project_id == project_id
      errors.add(:folder_id, "does not belong to this project")
    end
  end
end
