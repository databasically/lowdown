class FeaturesController < ApplicationController
  before_filter :require_user
  before_filter :load_project
  before_filter :load_folder, :only => [:new]
  skip_before_filter :verify_authenticity_token, :only => :destroy

  def show
    @feature = @project.project_items.find(params[:id])
    render :partial => @feature
  end

  def new
    @feature = Feature.new_with_defaults(:project => @project, :folder => @folder)
    render :layout => false
  end

  def create
    @feature = Feature.new(params[:feature])
    @feature.project = @project
    if @feature.save
      render :partial => @feature
    else
      render :json => @feature.errors, :status => 422
    end
  end

  def edit
    @feature = @project.project_items.find(params[:id])
    render :partial => "form"
  end

  def update
    @feature = @project.project_items.find(params[:id])
    if @feature.update_attributes(params[:feature])
      render :partial => @feature
    else
      render :json => @feature.errors, :status => 422
    end
  end

  def destroy
    @feature = @project.project_items.find(params[:id])
    @feature.destroy
    respond_to do |format|
      format.html { redirect_to(@project) }
      format.js
    end
  end

  private
  def load_folder
    @folder = @project.folders.find(params[:folder_id])
  end

  def load_project
    @project = current_user.projects.find(params[:project_id])
  end
end
