# Allow the metal piece to run in isolation
require(File.dirname(__FILE__) + "/../../config/environment") unless defined?(Rails)

class UserFinder
  def self.call(env)
    request = Rack::Request.new(env)
    if env["PATH_INFO"] =~ /users\/by_email/ && env['rack.session'].try(:[], 'user_credentials_id') && request.params['email']
      return [200, {"Content-Type" => "application/json"}, [{:users => [], :email => ''}.to_json]] if request.params['email'].blank?
      user = User.find_by_id(env['rack.session']['user_credentials_id'])
      members = user.projects.map(&:users).flatten.select {|m| m.email =~ /#{request.params['email']}/i }
      members << User.find_by_email(request.params['email'])
      json = { 'email' => request.params['email'], 'users' => members.compact.uniq.map {|m| {'name' => m.fullname, 'email' => m.email } }}.to_json
      [200, {"Content-Type" => "application/json"}, [json]]
    else
      [404, {"Content-Type" => "text/html"}, ["Not Found"]]
    end
  rescue
    [404, {"Content-Type" => "text/html"}, ["Not Found"]]
  end
end
