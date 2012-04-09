# Configuration for Selenium mode
Webrat.configure do |config|
  config.mode = :selenium
  config.application_environment = :cucumber
end
