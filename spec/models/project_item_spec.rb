require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe ProjectItem do

  describe "moving to another folder" do
    before :each do
      @user = Factory(:user)
      User.current = @user
      @project = Factory(:project)
      @folder1 = Factory(:folder, :project => @project)
      @folder2 = Factory(:folder, :project => @project)
      @feature1 = Factory(:feature, :project => @project, :folder => @folder1)
      @feature2 = Factory(:feature, :project => @project, :folder => @folder2)
    end

    def do_move
      @feature1.move_to(@folder2)
    end

    it 'should move from one folder to another' do
      do_move
      @folder2.features.should include(@feature1)
    end

    it 'should put it at the bottom of the list' do
      do_move
      @folder2.project_items.last.should == @feature1
    end

    it 'should remove it from the other folder' do
      do_move
      @folder1.project_items.should be_empty
    end

    it 'should raise an error if moving to a different project' do
      @folder3 = Factory(:folder, :project => Factory(:project))
      lambda { @feature1.move_to(@folder3) }.should raise_error
    end
  end
end
