class SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_filter :set_client
    skip_before_filter :set_current_user
    
    
    def new
        
    end
    
    def create
        cookies.permanent[:username]=params["email"]
        cookies.permanent[:password]=params["password"]
        redirect_to home_index_path
    end
    
    def destroy
        cookies.delete(:username)
        cookies.delete(:password)
        session.clear
        flash[:notice]="You have successfully logged out!"
        redirect_to users_path
    end
end