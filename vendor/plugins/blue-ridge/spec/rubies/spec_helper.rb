require "micronaut"

def not_in_editor?
  ['TM_MODE', 'EMACS', 'VIM'].all? { |k| !ENV.has_key?(k) }
end

Micronaut.configure do |config|
  config.formatter = :progress
  config.mock_with :mocha
  config.color_enabled = not_in_editor?
  config.filter_run :focused => true
  config.alias_example_to :fit, :focused => true
  config.profile_examples = false
end
