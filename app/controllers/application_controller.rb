# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all
  before_filter :set_time_zone
  # before_filter :set_language
  before_filter :load_projects
  before_filter :set_current_actor

  helper_method :current_user_session, :current_user, :logged_in?
  protect_from_forgery

  # Scrub sensitive parameters from your log
  filter_parameter_logging :password, :password_confirmation

protected

  def set_time_zone
    Time.zone = current_user.timezone if current_user && current_user.timezone
  end

  # def set_language
  #   I18n.locale = current_user.language if current_user && current_user.language
  # end

  def load_projects
    @projects = current_user.projects if current_user
  end

  def default_project_path
    if current_user && current_user.last_seen_project_id && Project.exists?(current_user.last_seen_project_id)
      project_url(current_user.last_seen_project_id)
    elsif current_user && current_user.projects.any?
      project_url(current_user.projects.first)
    elsif current_user
      projects_url
    else
      new_user_url
    end
  end

  def set_current_actor
    User.current = current_user if logged_in?
  end

  def current_user_session
    return @current_user_session if defined?(@current_user_session)
    @current_user_session = UserSession.find
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = current_user_session && current_user_session.user
  end

  def require_user
    unless current_user
      store_location
      redirect_to new_user_session_url
      return false
    end
  end

  def require_no_user
    if current_user
      store_location
      redirect_to projects_url
      return false
    end
  end

  def store_location
    session[:return_to] = request.request_uri
  end

  def redirect_back_or_default(default)
    redirect_to(session[:return_to] || default)
    session[:return_to] = nil
  end

  alias_method :logged_in?, :current_user_session
end
