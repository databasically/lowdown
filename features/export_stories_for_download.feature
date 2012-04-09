@export
Feature: Export Stories for Download
  In order to allow customers to easily use Lowdown stories in their local projects
  As a participant
  I want download a project's features

  # 2   
  Scenario: Participant can download all features
    Given I am a collaborator on a project named "Lowdown"
    And the project has 3 features
    When I export all the features
    Then I should be prompted to save a zip file
    And there should be 3 files in the zip
