require File.expand_path(File.dirname(__FILE__) + '/spec_helper')
require File.expand_path(File.dirname(__FILE__) + '/../../lib/blue_ridge')

describe BlueRidge do
  describe "finding the top-level directory containing the project's tests" do
    it "returns Micronaut's 'examples' directory if it exists" do
      File.stubs(:exist?).with("examples").returns(true)
      BlueRidge.find_base_spec_dir.should == "examples"
    end
    
    it "returns RSpec's 'spec' directory if it exists and no Micronaut directory exists" do
      File.stubs(:exist?).with("examples").returns(false)
      File.stubs(:exist?).with("spec").returns(true)
      BlueRidge.find_base_spec_dir.should == "spec"
    end
    
    it "returns the 'test' directory if no Micronaut or RSpec directories exist" do
      File.stubs(:exist?).with("examples").returns(false)
      File.stubs(:exist?).with("spec").returns(false)
      BlueRidge.find_base_spec_dir.should == "test"
    end
  end
  
  describe "returning the directory name to contain the project's JavaScript tests" do
    it "returns 'examples/javascripts' if the base spec dir is 'examples'" do
      BlueRidge.stubs(:find_base_spec_dir).returns("examples")
      BlueRidge.javascript_spec_dir.should == "examples/javascripts"
    end
    
    it "returns 'spec/javascripts' if the base spec dir is 'spec'" do
      BlueRidge.stubs(:find_base_spec_dir).returns("spec")
      BlueRidge.javascript_spec_dir.should == "spec/javascripts"
    end

    it "returns 'test/javascript' if the base spec dir is 'test'" do
      BlueRidge.stubs(:find_base_spec_dir).returns("test")
      BlueRidge.javascript_spec_dir.should == "test/javascript"
    end
  end
  
  describe "finding the directory containing the project's JavaScript tests" do
    it "returns 'examples/javascripts' if it exists" do
      File.stubs(:exist?).with("examples/javascripts").returns(true)
      BlueRidge.find_javascript_spec_dir.should == "examples/javascripts"
    end
    
    it "returns 'spec/javascripts' if it exists and 'examples/javascripts' does not" do
      File.stubs(:exist?).with("examples/javascripts").returns(false)
      File.stubs(:exist?).with("spec/javascripts").returns(true)
      BlueRidge.find_javascript_spec_dir.should == "spec/javascripts"
    end
    
    it "returns 'test/javascript' if it exists and 'examples/javascripts' and 'spec/javascripts' do not" do
      File.stubs(:exist?).with("examples/javascripts").returns(false)
      File.stubs(:exist?).with("spec/javascripts").returns(false)
      File.stubs(:exist?).with("test/javascript").returns(true)
      BlueRidge.find_javascript_spec_dir.should == "test/javascript"
    end
    
    it "returns null if none of the JavaScript spec directories exist" do
      File.stubs(:exist?).with("examples/javascripts").returns(false)
      File.stubs(:exist?).with("spec/javascripts").returns(false)
      File.stubs(:exist?).with("test/javascript").returns(false)
      BlueRidge.find_javascript_spec_dir.should be_nil
    end
  end

  describe "finding all spec names that live under the current directory" do
    it "returns the list of '*_spec.js' filenames under the current directory and any subdirectories" do
      Dir.expects(:glob).with("**/*_spec.js").returns(:some_filenames)
      BlueRidge.find_specs_under_current_dir.should == :some_filenames
    end
  end

  describe "running a specific spec" do
    it "runs the test runner command against the given spec filename in a separate process" do
      BlueRidge.stubs(:test_runner_command).returns("some_test_runner_command")
      BlueRidge.expects(:system).with("some_test_runner_command some_spec_file").returns(:some_value)
      BlueRidge.run_spec("some_spec_file").should == :some_value
    end
  end

  describe "runing all specs under a given directory" do
    it "changes the current working directory to the given directory" do
      Dir.expects(:chdir).with("some_directory")
      BlueRidge.run_specs_in_dir("some_directory")
    end

    it "runs the specs passing in the given spec name" do
      Dir.stubs(:chdir).yields
      BlueRidge.expects(:run_specs).with("some_spec_name")
      BlueRidge.run_specs_in_dir("some_directory", "some_spec_name")
    end

    it "returns the result of the running the specs" do
      Dir.stubs(:chdir).yields
      BlueRidge.stubs(:run_specs).returns(:some_value)
      BlueRidge.run_specs_in_dir("some_directory").should == :some_value
    end
  end
  
  describe "running specs under the current directory" do
    describe "when the given spec filename is nil" do
      it "calls run_spec for each '*_spec.js' file under the current directory" do
        BlueRidge.stubs(:find_specs_under_current_dir).returns(["first_js_spec.js", "second_js_spec.js"])
        BlueRidge.expects(:run_spec).with("first_js_spec.js")
        BlueRidge.expects(:run_spec).with("second_js_spec.js")
        BlueRidge.run_specs
      end
  
      it "calls run_spec for each of the spec files, even if an early one reports a failure" do
        BlueRidge.stubs(:find_specs_under_current_dir).returns(["first_js_spec.js", "second_js_spec.js"])
        BlueRidge.expects(:run_spec).with("first_js_spec.js").returns(false)
        BlueRidge.expects(:run_spec).with("second_js_spec.js")
        BlueRidge.run_specs
      end
  
      it "returns false if ANY of the specs reports a failure" do
        BlueRidge.stubs(:find_specs_under_current_dir).returns(["first_js_spec.js", "second_js_spec.js"])
        BlueRidge.stubs(:run_spec).with("first_js_spec.js").returns(false)
        BlueRidge.stubs(:run_spec).with("second_js_spec.js").returns(true)
        BlueRidge.run_specs.should == false
      end
  
      it "returns true if ALL of the specs reports success" do
        BlueRidge.stubs(:find_specs_under_current_dir).returns(["first_js_spec.js", "second_js_spec.js"])
        BlueRidge.stubs(:run_spec).returns(true)
        BlueRidge.run_specs.should == true
      end
    end
  
    describe "when given a spec name" do
      it "runs only the single spec and does not look for other specs" do
        BlueRidge.expects(:find_specs_under_current_dir).never
        BlueRidge.expects(:run_spec).once
        BlueRidge.run_specs("some_filename")
      end

      it "runs the corresponding spec file for the given spec name" do
        BlueRidge.expects(:run_spec).with("some_filename_spec.js").returns(true)
        BlueRidge.run_specs("some_filename").should == true
      end

      it "returns true if the spec reports success" do
        BlueRidge.stubs(:run_spec).returns(true)
        BlueRidge.run_specs("some_filename").should == true
      end
    
      it "returns false if the spec reports a failure" do
        BlueRidge.stubs(:run_spec).returns(false)
        BlueRidge.run_specs("some_filename").should == false
      end
    end
  end
end