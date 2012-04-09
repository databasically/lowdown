class MilestonesController < ApplicationController
  before_filter :require_user
  before_filter :load_project
  before_filter :load_folder, :only => :create
  skip_before_filter :verify_authenticity_token
  
  def index
    respond_to do |format|
      format.json do
        milestones = @project.milestones.all.to_a.map do |milestone|
          {:id => milestone.id,
           :html => render_to_string(:partial => milestone)}
        end
        render :json => milestones
      end
    end
  end
  
  def create
    @milestone = Milestone.create!(:project => @project, :folder => @folder)
    render :partial => @milestone, :status => :created
  end
  
  def destroy
    @milestone = @project.milestones.find(params[:id])
    @milestone.destroy
    respond_to do |format|
      format.html do
        redirect_to(project_path(@project))
      end
      format.js
    end
  end
  
  private
  def load_project
    @project = current_user.projects.find(params[:project_id])
  end

  def load_folder
    @folder = @project.folders.find(params[:folder_id])
  end
end
