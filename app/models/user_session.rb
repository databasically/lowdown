class UserSession < Authlogic::Session::Base
  self.remember_me     = true
  self.remember_me_for = 2.weeks
end
