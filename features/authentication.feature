Feature: Authentication
  In order to use Lowdown to collaborate on feature stories
  As a user
  I want log in to my account

  # 1
  Scenario: Standard login
    Given I signed up with standard credentials
    When I login with the correct email and password
    Then I should be logged in

  # 1
  Scenario: Unsuccessful standard login
    Given I signed up with standard credentials
    When I login with incorrect credentials
    Then I should not be logged in
    And I should see an error on the page

  # 1
  @openid
  Scenario: OpenID login
    Given this scenario needs a working open id server via bundler
    Given I signed up with OpenID
    When I login with my correct OpenID
    Then I should be logged in

  # 1
  @openid
  Scenario: OpenID login with error
    Given this scenario needs a working open id server via bundler
    Given I signed up with OpenID
    When I login with an incorrect OpenID
    Then I should not be logged in
    And I should see an error on the page

  # 1
  @openid
  Scenario: OpenID login with denied access
    Given this scenario needs a working open id server via bundler
    Given I signed up with OpenID
    When I deny authorization when logging in with my OpenID 
    Then I should not be logged in

  Scenario: Logout
    Given I am logged in
    When I log out
    Then I should not be logged in
