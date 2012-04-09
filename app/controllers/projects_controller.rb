class ProjectsController < ApplicationController
  before_filter :require_user
  before_filter :load_project, :only => [:show, :edit, :destroy, :update]
  skip_before_filter :verify_authenticity_token, :only => [:destroy]
  after_filter :set_user_last_seen_project, :only => :show
  
  def index
    
  end

  def show
    respond_to do |format|
      format.html { redirect_to project_folder_url(@project, @project.folders.first) }
      format.xml  { render :xml => @project }
      format.zip { send_file @project.features_zipfile }
    end
  end

  def new
    @project = Project.new
    respond_to do |format|
      format.html # new.html.haml
      format.xml  { render :xml => @project }
    end
  end

  def create
    @project = Project.new(params[:project])
    @project.creator = current_user
    respond_to do |format|
      if @project.save
        format.html { redirect_to(@project) }
        format.xml  { render :xml => @project, :status => :created, :location => @project }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @project.errors, :status => :unprocessable_entity }
      end
    end
  end

  def edit
  end

  def update
    if @project.update_attributes(params[:project])
      redirect_to(edit_project_path(@project))
    else
      render :action => 'edit'
    end
  end
  
  def destroy
    if current_user == @project.creator
      @project.destroy 
    end
    respond_to do |format|
      format.html { redirect_to(projects_path) }
      format.js do
        render :js => @project.frozen? ? "$('##{dom_id(@project)}').remove()" : 'alert("You can\'t remove that project");'
      end
    end
  end
    
private
  def load_project
    @project = current_user.projects.find(params[:id])    
  end

  def load_folder
    @folder = params[:folder_id] ? @project.folders.find(params[:folder_id]) : @project.folders.first
  end
  
  def set_user_last_seen_project
    current_user.update_attribute(:last_seen_project_id, @project.id) unless current_user.last_seen_project_id == @project.id
  end
end
