Then /^I should see an error on the page$/ do
  response.should have_selector("div.error-with-field")
end