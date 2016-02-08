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
    
    def password
      Parse::User.reset_password(session[:current_user]["email"], @client)
      redirect_to home_index_path
    end
    
    def update
        @updateuser = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        if params[:file]
          @photo = @client.file({
            :body => IO.read(params[:file].tempfile),
            :local_filename => params[:file].original_filename,
            :content_type => params[:file].content_type
          })
          begin
            @photo.save
          rescue Parse::ParseProtocolError
            redirect_to user_path(session[:current_user]["objectId"])
          end
          @updateuser["first_name"] = params[:first_name]
          @updateuser["last_name"] = params[:last_name]
          @updateuser["profile_picture"] = @photo
          begin
            session[:current_user]["first_name"] = params[:first_name]
            session[:current_user]["last_name"] = params[:last_name]
            @updateuser.save
          rescue Parse::ParseProtocolError
            redirect_to user_path(session[:current_user]["objectId"])
          end
          @updated = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
          session[:current_user]["profile_picture"] = @updated["profile_picture"]
          redirect_to user_path(session[:current_user]["objectId"])
        else 
          @updateuser["first_name"] = params[:first_name]
          @updateuser["last_name"] = params[:last_name]
          begin
            session[:current_user]["first_name"] = params[:first_name]
            session[:current_user]["last_name"] = params[:last_name]
            @updateuser.save
          rescue Parse::ParseProtocolError
            redirect_to user_path(session[:current_user]["objectId"])
          end
          redirect_to user_path(session[:current_user]["objectId"])
        end
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
                @userquery = @client.query("_User").eq("username", params["email"]).get.first
                @userinfo = @client.object("User_Info")
                @userinfo["user_objectId"] = @userquery["objectId"]
                @userinfo["email"] = params["email"]
                @userinfo["first_name"] = params["fname"]
                @userinfo["last_name"] = params["fname"]
                begin
                  @userinfo.save
                rescue Parse::ParseProtocolError
                end
            end
            redirect_to home_index_path
        else
           flash[:notice]= "Error: Passwords do not match!" 
           redirect_to home_index_path
        end
    end
end