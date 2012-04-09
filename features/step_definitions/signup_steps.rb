Given /^I do not have an account$/ do
  User.count.should == 0
end

When /^I signup with email and password$/ do
  visit signup_path
  fill_in :user_fullname, :with => "Lowdown User"
  fill_in :user_email, :with => "lowdown@lowdownapp.com"
  fill_in :user_password, :with => "mypassword"
  fill_in :user_password_confirmation, :with => "mypassword"
  click_button "Signup"
end

When /^I signup with the name field blank$/ do
  visit signup_path
  fill_in :user_email, :with => "lowdown@lowdownapp.com"
  fill_in :user_password, :with => "mypassword"
  fill_in :user_password_confirmation, :with => "mypassword"
  click_button "Signup"
end

When /^I signup with a blank email$/ do
  visit signup_path
  fill_in :user_fullname, :with => "Lowdown User"
  fill_in :user_password, :with => "mypassword"
  fill_in :user_password_confirmation, :with => "mypassword"
  click_button "Signup"
end

When /^I signup with mismatched password and confirmation$/ do
  visit signup_path
  fill_in :user_fullname, :with => "Lowdown User"
  fill_in :user_email, :with => "lowdown@lowdownapp.com"
  fill_in :user_password, :with => "mypassword"
  fill_in :user_password_confirmation, :with => "mismatch"
  click_button "Signup"
end

When /^I signup with OpenID URL "([^\"]*)"$/ do |url|
  visit signup_path
  fill_in :user_openid_identifier, :with => url
  click_button "Signup"
end

When /^I signup with my valid OpenID with full registration details$/ do
  start_open_id_server('fullreg.yml')
  When 'I signup with OpenID URL "http://localhost:1123/lowdown?openid.success=true"'
  complete_open_id
  User.count.should > 0
end

When /^I signup with my valid OpenID without any registration details$/ do
  start_open_id_server('noreg.yml')
  When 'I signup with OpenID URL "http://localhost:1123/lowdown?openid.success=true"'
  complete_open_id
end

When /^I signup with an invalid OpenID$/ do
  When 'I signup with OpenID URL "fakeopenid"'
end

When /^I signup with my valid OpenID and decline authorization$/ do
  start_open_id_server('fullreg.yml')
  When 'I signup with OpenID URL "http://localhost:1123/lowdown"'
  complete_open_id
end

Then /^there should be an error on the email address$/ do
  simulate do
    response.should have_tag("div.error-with-field") do
      with_tag("input#user_email")
    end
  end
  automate do
    response.should have_selector("div.error-with-field input#user_email")
  end
end

Then /^there should be an error on the password$/ do
  simulate do
    response.should have_tag("div.error-with-field") do
      with_tag("input#user_password")
    end
  end
  automate do
    response.should have_selector("div.error-with-field input#user_password")
  end
end

Then /^my details should be filled in$/ do
  visit edit_profile_path
  simulate do
    field_named("user[fullname]").value.should_not be_blank
    field_named("user[email]").value.should_not be_blank
  end
  automate do
    selenium.wait_for_no_field_value('css=input#user_fullname', '', :timeout_in_seconds => 2)
    selenium.wait_for_no_field_value('css=input#user_email', '', :timeout_in_seconds => 2)
  end
end

Then /^my details should be empty$/ do
  simulate do
    field_named("user[fullname]").value.should be_blank
    field_named("user[email]").value.should be_blank
  end
  automate do
    selenium.wait_for_field_value('css=input#user_fullname', '', :timeout_in_seconds => 2)
    selenium.wait_for_field_value('css=input#user_email', '', :timeout_in_seconds => 2)
  end
end

Then /^I should be prompted to fill in my email$/ do
  simulate { response.should have_tag("form", /please.*email/i) }
  automate { selenium.wait_for_text(/email/, :element => "css=form", :timeout_in_seconds => 2) }
end

Then /^I should be prompted to fill in my name$/ do
  simulate { response.should have_tag("form", /please.*name/i) }
  automate { selenium.wait_for_text(/name/, :element => "css=form", :timeout_in_seconds => 2) }
end
