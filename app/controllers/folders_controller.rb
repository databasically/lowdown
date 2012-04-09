class FoldersController < ApplicationController
  before_filter :require_user
  before_filter :load_project, :only => [:show, :create, :edit, :update, :destroy, :reorder, :accept]
  before_filter :load_folder, :only => [:show, :edit, :update, :reorder, :accept, :destroy]
  skip_before_filter :verify_authenticity_token, :only => [:reorder]
  
  def create
    @folder = @project.folders.create!(params[:folder])
    flash[:folder_created] = true
    redirect_to project_folder_url(@project, @folder)
  end
  
  def update
    @folder.update_attributes!(params[:folder])
    render :json => @folder
  end

  def destroy
    @folder.destroy
    redirect_to project_folder_url(@project, @project.folders.first)
  end
  
  def reorder
    @folder.reorder!(params[:project_items])
    render_milestones
  end

  def accept
    @feature = @project.project_items.find(params[:feature_id])
    @feature.move_to(@folder)
    render_milestones
  end

  private
  def load_project
    @project = Project.find(params[:project_id])
  end

  def load_folder
    @folder = @project.folders.find(params[:id])
  end

  def render_milestones
    milestones = @project.milestones.all.to_a.map do |milestone|
      {:id => milestone.id,
        :html => render_to_string(:partial => milestone)}
    end
    render :json => milestones
  end
end
