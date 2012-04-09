Feature: Tabs and sets
  In order to better organize my project and be able to focus attention on current tasks
  As a user
  I want to be able to create separate pages within an individual project

  # 
  Scenario: Initial Tab
    Given This test is pending
    Given I have a project named "My Project"
    And I am on my new project page
    When I edit the title of the initial Tab and save
    Then I will see the new name of the Tab displayed

  # 
  Scenario: Add a new Tab
    Given This test is pending
    Given I have a project named "My Project"
    When I add a new Tab
    Then I will see a new Page
    And I will be able to edit the title of the Tab

  # 
  Scenario: Edit an existing Tab name
    Given This test is pending
    Given I have a project named "My Project"
    And I have chosen to edit the Tab name
    When I edit the title of the Tab and save
    Then I will see the new name of the Tab displayed
