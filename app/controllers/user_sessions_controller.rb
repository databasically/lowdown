class UserSessionsController < ApplicationController
  layout 'plain'
  before_filter :require_no_user, :only => [:new, :create]
  before_filter :require_user, :only => :destroy
  
  def new
    @user_session = UserSession.new
  end
  
  def create
    @user_session = UserSession.new(params[:user_session])
    @user_session.remember_me = true
    @user_session.save do |result|
      if result
        @current_user = @user_session.user
        redirect_back_or_default(default_project_path) and return
      else
        render(:action => :new) and return
      end
    end
    # total hack, but authlogic-oid doesn't label the url as error
    @user_session.errors.add(:openid_identifier, @user_session.errors.on_base) if @user_session.errors.on_base
    render :action => :new unless performed?
  end
  
  def destroy
    current_user_session.destroy
    redirect_back_or_default root_url
  end
end
