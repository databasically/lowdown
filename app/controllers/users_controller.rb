class UsersController < ApplicationController
  before_filter :require_no_user, :only => [:new, :create, :accept]
  before_filter :require_user, :only => [:edit, :update]
  
  def new
    @user = User.new
    render :layout => 'plain'
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      if @user.fullname.blank?
        redirect_to edit_user_path(@user)
      else
        redirect_to default_project_path
      end
    else
      render :action => :new, :layout => 'plain'
    end
  end

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    @user.attributes = params[:user]
    @user.save do |result|
      if result
        redirect_to edit_profile_url
      else
        render :action => :edit
      end
    end
  end

  def accept
    @user = User.find_using_perishable_token(params[:token])
    redirect_to login_url and return unless @user
    if request.put?
      @user.attributes = params[:user]
      @user.save do |result|
        redirect_to projects_url and return if result
      end
    end
    render :layout => 'plain'
  end
end
