# Be sure to restart your server when you modify this file

# Specifies gem version of Rails to use when vendor/rails is not present
RAILS_GEM_VERSION = '2.3.5' unless defined? RAILS_GEM_VERSION

# Bootstrap the Rails environment, frameworks, and default configuration
require File.join(File.dirname(__FILE__), 'boot')

Rails::Initializer.run do |config|
  # config.gem 'haml', :version => ">=2.2.0", :lib => 'sass'
  # config.gem "chriseppstein-compass", :lib => 'compass'
  # config.gem "chriseppstein-compass-960-plugin", :lib => "ninesixty"
  # config.gem 'cucumber', :lib => false
  # config.gem 'authlogic'
  # config.gem 'authlogic-oid', :lib => 'authlogic_openid'
  # config.gem 'mash'
  # config.gem 'andand', :version => "1.3.1"
  # config.gem 'whenever', :lib => false, :source => 'http://gemcutter.org/'
  # Settings in config/environments/* take precedence over those specified here.
  # Application configuration should go into files in config/initializers
  # -- all .rb files in that directory are automatically loaded.
  config.cache_store = :file_store, "tmp/cache"
  
  # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
  # Run "rake -D time" for a list of tasks for finding time zone names.
  config.time_zone = 'UTC'

  config.action_view.field_error_proc = Proc.new do |html, instance|
    if html !~ /label/
      %{<div class="error-with-field">#{html} <small class="error">&bull; #{[instance.error_message].flatten.first}</small></div>}
    else
      html
    end
  end
end
