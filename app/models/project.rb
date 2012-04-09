class Project < ActiveRecord::Base
  has_many :memberships, :dependent => :destroy
  has_many :users, :through => :memberships
  has_many :folders, :order => "name", :dependent => :destroy
  has_many :project_items, :dependent => :destroy
  has_many :features, :foreign_key => 'project_id'
  has_many :milestones, :foreign_key => 'project_id'

  validates_length_of :name, :maximum => 35

  after_create :add_creator_as_member
  after_create :create_a_folder

  include UserActions

  def total_hours
    return @total_hours if @total_hours
    result = features.sum('hours')
    @total_hours = result
  end

  def total_cost
    self.total_hours * rate
  end

  def add_creator_as_member
    self.users << self.creator
  end

  def features_zipfile
    self.save_features_to_files!
    system("cd #{export_dirname} && zip #{export_zipname} *")
    export_zipname
  end

  protected
  def save_features_to_files!
    FileUtils.mkdir SAVE_TO rescue nil
    FileUtils.rm_rf export_dirname
    FileUtils.mkdir export_dirname
    self.features.each do |feature|
      f = File.new(File.join(export_dirname, feature.filename), "w")
      f << feature.formatted
      f.close
    end
  end

  SAVE_TO = File.join(Rails.root, "tmp", "feature-export")
  def export_dirname
    File.join(SAVE_TO, "#{name.parameterize.underscore}-#{self.id}".to_s)
  end

  def export_zipname
    File.join(export_dirname, "lowdown-#{name.parameterize.underscore}.zip")
  end

  def create_a_folder
    folders.create!
  end
end
