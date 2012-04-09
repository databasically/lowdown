Before("@export") do
  Given "I am logged in"
end

Given /^the project has (\d+) features$/ do |count|
  count.to_i.times do |i|
    Feature.new_with_defaults(:project => @project, :folder => @project.folders.first).tap do |feature|
      feature.name = "Feature #{i}"
      feature.save
    end
  end
end

When /^I export all the features$/ do
  visit projects_path
  click_link_within "#project_#{@project.id}", "Export"
end

Then /^I should be prompted to save a zip file$/ do
  response.content_type.should =~ /octet-stream/i
  response.headers["Content-disposition"].should =~ /attachment/i
end

Then /^there should be ([^\"]*) files in the zip$/ do |count|
  File.open("tmp/download.zip", "w") do |f|
    response.body.call(response, f)
  end
  File.should be_exist("tmp/download.zip")
  entries = 0
  Zip::ZipFile.foreach("tmp/download.zip") {|entry| entries += 1 }
  entries.should == count.to_i
  FileUtils.rm("tmp/download.zip")
end
