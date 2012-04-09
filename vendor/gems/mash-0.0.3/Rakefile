# -*- ruby -*-

require 'rubygems'
require 'hoe'
require './lib/mash.rb'
require 'spec/rake/spectask'

Hoe.new('mash', Mash::VERSION) do |p|
  p.rubyforge_name = 'mash-hash' # if different than lowercase project name
  p.developer('Michael Bleigh', 'michael@intridea.com')
  p.remote_rdoc_dir = ''
end

desc "Run specs."
Spec::Rake::SpecTask.new("spec") do |t|
  t.spec_files = "spec/*_spec.rb"
end
# vim: syntax=Ruby
