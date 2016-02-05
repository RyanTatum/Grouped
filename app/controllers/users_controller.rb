class UsersController < ApplicationController
    skip_before_action :verify_authenticity_token
    #before_filter :set_current_user
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user, :only => ['show', 'edit', 'update', 'delete']
    
    def index
        expires_now
        if session[:current_user]
            flash[:notice]="You are already logged in!"
            redirect_to home_index_path
        end
    end
    
    def show
        @groups_query = @client.query("Project")
        @groups = @groups_query.get
        
    end
    
    def create
        if params["password"] === params["cpassword"]
            @no_error=true
            @user = @client.user({
                :username => params["email"],
                :password => params["password"],
                :firstname => params["fname"],
                :lastname => params["lname"],
                :email => params["email"]
            })
            begin
                @user.save
            rescue Parse::ParseProtocolError => e
                @no_error=false
                flash[:notice]="Error: " + e.error + "!"
            end
            if @no_error
                flash[:notice]="You have successfully registered a new account!"
            end
            redirect_to home_index_path
        else
           flash[:notice]= "Error: Passwords do not match!" 
           redirect_to home_index_path
        end
    end
end