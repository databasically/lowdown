module UserActions
  unloadable
  def self.included(base)
    base.class_eval do
      before_validation :set_actor
      
      belongs_to :creator, :class_name => "User", :foreign_key => "creator_id"
      belongs_to :updater, :class_name => "User", :foreign_key => "updater_id"

      validates_presence_of :creator_id, :on => :create, :message => "is required"
      validates_presence_of :updater_id, :on => :update, :message => "is required"
    end
  end
  
  def set_actor
    self.updater = User.current
    self.creator = User.current if new_record?
  end
end