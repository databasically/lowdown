require 'tzinfo'
class User < ActiveRecord::Base
  extend ActiveSupport::Memoizable
  cattr_accessor :current # for UserActions
  has_many :memberships, :dependent => :destroy
  has_many :projects, :through => :memberships
  has_many :created_projects, :class_name => "Project", :foreign_key => 'creator_id'

  acts_as_authentic do |c|
    c.merge_validates_length_of_email_field_options :unless => :using_openid?
    c.merge_validates_format_of_email_field_options :unless => :using_openid?
    c.merge_validates_uniqueness_of_email_field_options :unless => :using_openid?
    c.openid_required_fields [:fullname, :email]
    c.openid_optional_fields [:nickname, :timezone, :language]
    c.perishable_token_valid_for 30.days
  end

  def display_name
    fullname.blank? ? email : fullname
  end

  def nickname=(value)
    self.fullname = value
  end

  def language=(value)
    self[:language] = value ? value.to_s.downcase : nil
  end

  def timezone=(value)
    # Normalizes TZInfo names into their Rails equivalents
    Time.use_zone(value) do
      self[:timezone] = ActiveSupport::TimeZone::MAPPING.index(Time.zone.name) || Time.zone.name
    end
  end

  def map_openid_registration(registration)
    # Read nickname first so as to prefer fullname
    %w{nickname fullname email timezone language}.each do |key|
      unless registration[key].blank?
        self.send("#{key}=", registration[key])
      end
    end
  end

  def set_random_password(length=12)
    alphanumerics = ('a'..'z').to_a.concat(('A'..'Z').to_a.concat(('0'..'9').to_a))
    self.password = self.password_confirmation = alphanumerics.sort_by{rand}.to_s[0..length]
  end

  def deliver_password_reset_instructions!(host)  
    reset_perishable_token!  
    UserNotifications.deliver_forgot_password(self, host)  
  end
end
