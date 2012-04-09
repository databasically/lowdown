module UsersHelper
  def normal_signup_toggle
    object = @user || @user_session
    if object.errors.on(:openid_identifier)
      {:style => "display:none"}
    else
      {}
    end
  end
  
  def openid_signup_toggle
    object = @user || @user_session
    if object.errors.on(:openid_identifier)
      {}
    else
      {:style => "display:none"}
    end
  end
end
