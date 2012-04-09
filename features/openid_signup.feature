@openid
Feature: OpenID Signup
  In order to begin using Lowdown for collaboration on feature stories
  I want to create an account

  # 
  Scenario: Create account with OpenID
    Given this scenario needs a working open id server via bundler
    Given I do not have an account
    When I signup with my valid OpenID with full registration details
    Then I should be logged in
    And my details should be filled in

  # 
  Scenario: Create account with OpenID without details
    Given this scenario needs a working open id server via bundler
    Given I do not have an account
    When I signup with my valid OpenID without any registration details
    Then I should be logged in
    And my details should be empty
    And I should be prompted to fill in my email
    And I should be prompted to fill in my name

  # 
  Scenario: Submit invalid OpenID
    Given this scenario needs a working open id server via bundler
    Given I do not have an account
    When I signup with an invalid OpenID
    Then I should not be logged in
    And I should see an error on the page

  # 
  Scenario: Decline OpenID authorization
    Given this scenario needs a working open id server via bundler
    Given I do not have an account
    When I signup with my valid OpenID and decline authorization
    Then I should not be logged in
    And I should see an error on the page