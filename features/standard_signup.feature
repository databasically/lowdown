Feature: Standard Signup
  In order to begin using Lowdown for collaboration on feature stories
  I want to create an account

  # 
  Scenario: Signup with valid email/password combination
    Given I do not have an account
    When I signup with email and password
    Then I should be logged in
    And my details should be filled in

  # 
  Scenario: Signup leaving full name blank
    Given I do not have an account
    When I signup with the name field blank
    Then I should be logged in
    And I should be prompted to fill in my name

  # 
  Scenario: Attempt signup with blank email
    Given I do not have an account
    When I signup with a blank email
    Then I should not be logged in
    And there should be an error on the email address

  # 
  Scenario: Attempt signup with invalid password
    Given I do not have an account
    When I signup with mismatched password and confirmation
    Then I should not be logged in
    And there should be an error on the password