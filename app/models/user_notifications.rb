class UserNotifications < ActionMailer::Base
  

  def new_account(new_user, project, current_user, host, sent_at = Time.now)
    subject    "You've been invited to #{host}"
    recipients new_user.email
    from       "noreply@lowdownapp.com"
    sent_on    sent_at
    
    body       :new_user => new_user, :project => project, :current_user => current_user, :host => host
  end

  def forgot_password(user, host, sent_at = Time.now)
    subject    'UserNotifications#forgot_password'
    recipients user.email
    from       'noreply@lowdownapp.com'
    sent_on    sent_at
    
    body       :user => user, :host => host
  end

end
