Before("@logged_in") do
  Given "I am logged in"
end

Given /^I am logged in$/ do
  Given "I signed up with standard credentials"
  Then "I should be logged in"
#   visit login_path
#   fill_in :user_session_email, :with => 'lowdown@lowdownapp.com'
#   fill_in :user_session_password, :with => 'mypassword'
#   click_button "Login"
end

Given /^I signed up with standard credentials$/ do
  When "I signup with email and password"
end

Given /^I signed up with OpenID$/ do
  When "I signup with my valid OpenID with full registration details"
end

When /^I login with the correct email and password$/ do
  visit logout_path
  visit login_path
  fill_in :user_session_email, :with => "lowdown@lowdownapp.com"
  fill_in :user_session_password, :with => "mypassword"
  click_button "Login"
end

When /^I login with incorrect credentials$/ do
  visit logout_path
  visit login_path
  fill_in :user_session_email, :with => "lowdown@lowdownapp.com"
  fill_in :user_session_password, :with => "incorrect"
  click_button "Login"
end

When /^I login with my correct OpenID$/ do
  visit logout_path
  visit login_path
  fill_in :user_session_openid_identifier, :with => "http://localhost:1123/lowdown?openid.success=true"
  within("#openid-login") { click_button "Login" }
  complete_open_id
end

When /^I login with an incorrect OpenID$/ do
  visit logout_path
  visit login_path
  fill_in :user_session_openid_identifier, :with => "foobar"
  within("#openid-login") { click_button "Login" }
end

When /^I deny authorization when logging in with my OpenID$/ do
  visit logout_path
  User.first.update_attribute(:openid_identifier, "http://localhost:1123/lowdown")
  visit login_path
  fill_in :user_session_openid_identifier, :with => "http://localhost:1123/lowdown"
  within("#openid-login") { click_button "Login" }
  complete_open_id
end

When /^I log out$/ do
  click_link "Logout"
end

Then /^I should be logged in$/ do
  simulate { response.should contain("Logout") }
  automate { response.should contain("Logout") }
end

Then /^I should not be logged in$/ do
  simulate { response.should_not have_tag("a", "Logout") }
  automate { response.should_not contain("Logout")}
end
