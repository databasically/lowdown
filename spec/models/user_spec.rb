require File.expand_path(File.dirname(__FILE__) + '/../spec_helper')

describe User do
  before(:each) do
    @user = Factory.build(:user)
  end

  it "should create a new instance given valid attributes" do
    lambda { @user.save! }.should_not raise_error
  end

  describe "mapping OpenID registration fields" do
    it "should assign the nickname to the fullname if given" do
      @user.map_openid_registration('nickname' => 'Wes')
      @user.fullname.should == 'Wes'
    end

    it "should prefer the fullname over the nickname" do
      @user.map_openid_registration('nickname' => 'Wes', 'fullname' => 'Wes Garrison')
      @user.fullname.should == 'Wes Garrison'
    end

    it "should normalize the language" do
      @user.map_openid_registration('language' => 'EN')
      @user.language.should == 'en'
    end

    it "should normalize the timezone" do
      @user.map_openid_registration('timezone' => "America/Chicago")
      @user.timezone.should == 'Central Time (US & Canada)'
    end

    it "should use the Rails-style timezone when given" do
      @user.timezone = "Central Time (US & Canada)"
      @user.timezone.should == "Central Time (US & Canada)"
    end
  end
end
