ActionController::Routing::Routes.draw do |map|
  map.signup "signup", :controller => :users,          :action => :new
  map.login "login",   :controller => :user_sessions,  :action => :new
  map.logout "logout", :controller => :user_sessions,  :action => :destroy
  map.accept "accept/:token", :controller => :users,   :action => :accept

  map.resource :profile, :controller => :users, :only => [:edit, :update]

  map.resource :user_session
  map.resources :users
  map.resources :password_resets
  map.resources :projects, :has_many => [:memberships, :features, :milestones] do |projects|
    projects.resources :folders, :member => {:accept => :post, :reorder => :post}, :has_many => [:features, :milestones]
  end

  map.root :controller => :home
end
