class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  #def set_current_user
  #  @current_user ||= Parse::User.authenticate(cookies[:username], cookies[:password])
  #  redirect_to user_path unless @current_user
  #end  
  
  def set_cache_headers
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end
  
  def set_client
    @client = Parse.create(
                    application_id: 'Y25GZkeg7cc6dGRDBkhw8SgxmOwT3orM7O6SxSlD',
                    api_key:        'LMXA2ffbXm2yORUgCvGuEKsgu8fOgbpqNFwQUz8Z')
                    
    Parse.init :application_id => 'Y25GZkeg7cc6dGRDBkhw8SgxmOwT3orM7O6SxSlD',
               :api_key        => 'LMXA2ffbXm2yORUgCvGuEKsgu8fOgbpqNFwQUz8Z'
  end
  
  def set_current_user
    @client = Parse.create(
                    application_id: 'Y25GZkeg7cc6dGRDBkhw8SgxmOwT3orM7O6SxSlD',
                    api_key:        'LMXA2ffbXm2yORUgCvGuEKsgu8fOgbpqNFwQUz8Z')
                    
    Parse.init :application_id => 'Y25GZkeg7cc6dGRDBkhw8SgxmOwT3orM7O6SxSlD',
               :api_key        => 'LMXA2ffbXm2yORUgCvGuEKsgu8fOgbpqNFwQUz8Z'
    if session[:current_user] == nil
      begin
        session[:current_user] ||= Parse::User.authenticate(cookies[:username],cookies[:password], @client)
      rescue Parse::ParseProtocolError
        #flash[:notice]="Error: " + e.error + "!"
        redirect_to users_path
      end
    end
    @groups_query = @client.query("Project")
    @groups = @groups_query.get
  end
  
  def logged_in?
    if session[:current_user]
      return true
    else
      return false
    end
  end
end
