class MembershipsController < ApplicationController
  before_filter :require_user
  def create
    @project = Project.find(params[:project_id])
    
    begin
      @user = User.find_or_create_by_email(params[:email])
      if @user.new_record?
        # set dummy password
        @user.set_random_password
      end

      # notify if validations pass
      if @user.save!
        UserNotifications.deliver_new_account(@user, @project, current_user, request.host_with_port)
      end
    
      @project.users << @user unless @project.users.include?(@user)
      flash[:notice] = "User added to project and notified by email."
    rescue Exception => e
      flash[:error] = e
    end
    
    redirect_to edit_project_path(@project)
  end
  
  def destroy
    @project = Project.find(params[:project_id])
    @membership = @project.memberships.find(params[:id])
    @membership.destroy
    flash[:notice] = "#{@membership.user.fullname || 'User'} removed from project."
    if current_user == @project.creator
      redirect_to(edit_project_path(@project))
    else
      redirect_to(projects_path)
    end
  end
end
