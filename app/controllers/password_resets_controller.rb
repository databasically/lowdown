# app/controllers/password_resets_controller.rb
class PasswordResetsController < ApplicationController
  layout 'plain'
  before_filter :require_no_user
  before_filter :load_user_using_perishable_token, :only => [:edit, :update]

  def create
    @user = User.find_by_email(params[:email])
    if @user
      @user.deliver_password_reset_instructions!(request.host)
      flash[:notice] = "Instructions to reset your password have been emailed to you. " +
        "Please check your email."
      redirect_to login_url
    else
      flash[:notice] = "No user was found with that email address!"
      render :action => :new
    end
  end

  def update
    @user.password = params[:user][:password]
    @user.password_confirmation = params[:user][:password_confirmation]
    @user.save do |result|
      if result
        flash[:notice] = "Password successfully updated."
        redirect_to edit_profile_url
      else
        render :action => :edit
      end
    end
  end

  private
  def load_user_using_perishable_token
    @user = User.find_using_perishable_token(params[:id])
    unless @user
      flash[:notice] = "We're sorry, but we could not locate your account. " +
        "If you are having issues try copying and pasting the URL " +
        "from your email into your browser or restarting the " +
        "reset password process."
      redirect_to new_password_reset_url
    end
  end
end
