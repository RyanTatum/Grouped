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
        @userinfoquery = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        session[:current_user]["email"]=@userinfoquery["email"]
        session[:current_user]["first_name"]=@userinfoquery["first_name"]
        session[:current_user]["last_name"]=@userinfoquery["last_name"]
        session[:current_user]["profile_picture"]=@userinfoquery["profile_picture"]
        rescue Parse::ParseProtocolError
        #flash[:notice]="Error: Invalid Email/Password combination!"
        redirect_to users_path
      end
    end
    @current_user=User.find_by_id(1)
    @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
    @groups = @client.query("User_Group").tap do |q|
        q.eq("user_info_ptr", Parse::Pointer.new({"className" => "User_Info","objectId"  =>  @user_info["objectId"]}))
        q.include = "group_ptr,user_info_ptr"
      end.get
  end
  
  def logged_in?
    if session[:current_user]
      return true
    else
      return false
    end
  end
end
