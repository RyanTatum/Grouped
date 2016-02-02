class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    #before_filter :set_current_user
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user, :only => ['show', 'edit', 'update', 'delete']
    
    def index
        expires_now
        if session[:current_user]
            redirect_to home_index_path
        end
    end
    
    def create
        @user = @client.user({
            :username => params["email"],
            :password => params["password"],
            :firstname => params["fname"],
            :lastname => params["lname"],
            :email => params["email"]
        })
        @user.save
        #rescue Parse::ParseProtocolError
            # redirect back to login form and try again
    #    test = Parse::Object.new("Test")
    #    test["field"] = params["email"]
    #    test.save
        redirect_to home_index_path
    end
end