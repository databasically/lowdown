require 'tcp_socket_extension' # in selenium-client
require 'webrat/core_extensions/tcp_socket'
require 'webrat/selenium/silence_stream'
module OpenIdWorld
  include Webrat::Selenium::SilenceStream
  def start_open_id_server(config="fullreg.yml")
    $stderr.print "==> Starting OpenID server on port 1123... "
    begin
      silence_stream(STDOUT) do
        @openid_process = fork do
          exec "/usr/bin/env", "ruby", 
               "#{Rails.root}/vendor/gems/roman-rots-0.2.1/bin/rots", 
          "--config", "#{Rails.root}/features/support/openid/#{config}", "2>&1"
        end
        TCPSocket.wait_for_service_with_timeout \
          :host     => "0.0.0.0",
          :port     => 1123,
          :timeout  => 30 # seconds
      end
      $stderr.puts "Ready!"
    rescue SocketError
      $stderr.puts "Failed to start the OpenID server!"
      $stderr.puts ""
      $stderr.puts "Please verify that you can start the server on port 1123."
      exit 1
    end
    at_exit do
      stop_open_id_server
    end
  end
  
  def stop_open_id_server
    if @openid_process
      $stderr.puts "==> Stopping OpenID server"
      system "kill -9 #{@openid_process}"
      @openid_process = nil
    end
  end
  
  def complete_open_id
    simulate do
      response.should be_redirect
      openid_auth = Net::HTTP.get_response(URI.parse(response.redirect_url))
      case openid_auth
      when Net::HTTPRedirection
        redir_uri = URI.parse(openid_auth['location'])
        if redir_uri.host == request.host
          visit redir_uri.request_uri
        else
          raise "OpenID completion failed! Sent to: #{redir_uri.to_s}"
        end
      else
        raise "Expected OpenID process to redirect! #{openid_auth.inspect}"
      end
    end
    automate do
      # Allow selenium to redirect by itself
    end
  end
end
World(OpenIdWorld)

After("@openid") do
  stop_open_id_server
end
