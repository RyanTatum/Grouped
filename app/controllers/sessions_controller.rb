class SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_filter :set_client
    skip_before_filter :set_current_user
    
    
    def new
        
    end
    
    def create
        #@user = Parse::User.authenticate(params["email"],params["password"])
        #rescue Parse::ParseProtocolError
        #if @user
            cookies.permanent[:username]=params["email"]
            cookies.permanent[:password]=params["password"]
            redirect_to home_index_path
        #else 
        #    redirect_to users_path
        #end
    end
    
    def destroy
        cookies.delete(:username)
        cookies.delete(:password)
        session.clear
        flash[:notice]="You have successfully logged out!"
        redirect_to users_path
    end
end