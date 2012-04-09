Given /^I have a project named "([^\"]*)"$/ do |name|
  Factory(:project, :creator => @user, :name => name)
end

Given /^I am a collaborator on a project named "([^\"]*)"$/ do |name|
  @project = Factory(:project, :name => name)
  @user = User.current = Factory(:user)
  @project.users << @user
end

Given /^I have (\d+) projects$/ do |count|
  count.to_i.times do
    Factory(:project, :creator => @user)
  end
end

When /^I open the project "([^\"]*)"$/ do |name|
  project = Project.find_by_name(name)
  visit project_path(project)
end
