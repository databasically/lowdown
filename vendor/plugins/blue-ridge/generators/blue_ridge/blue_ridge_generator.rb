require File.expand_path(File.dirname(__FILE__) + '/../../lib/blue_ridge')

class BlueRidgeGenerator < Rails::Generator::Base
  def manifest
    record do |m|
      base_dir = BlueRidge.javascript_spec_dir
      
      m.directory base_dir
      m.file 'application_spec.js', "#{base_dir}/application_spec.js"
      m.file 'spec_helper.js',      "#{base_dir}/spec_helper.js"
      
      m.directory "#{base_dir}/fixtures"
      m.file 'application.html', "#{base_dir}/fixtures/application.html"
      m.file 'screw.css',        "#{base_dir}/fixtures/screw.css"
    end
  end
end
