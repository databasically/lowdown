require 'faker'

Factory.define :user do |user|
  user.fullname { Faker::Name.name }
  user.email { Faker::Internet.email }
  user.password 'mypassword'
  user.password_confirmation 'mypassword'
end

Factory.define :project do |project|
  project.name { Faker::Company.bs }
end

Factory.define :feature do |feature|
  feature.name { Faker::Company.bs }
  feature.formatted "Feature: something"
end

Factory.define :folder do |folder|
  folder.name { Faker::Company.bs }
end
