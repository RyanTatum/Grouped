class SprintsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_filter :set_current_user
    before_filter :set_client
    before_filter :set_cache_headers
    
    def index
        redirect_to sprint_path(" ")
    end
        
    def new
        @sprint = Sprint.new
    end
    
    def create
        
    end 
    def show
        @sprints_query = @client.query("Sprint")
        @sprints = @client.query("Sprint").tap do |j|
            j.eq("group_ptr", Parse::Pointer.new({"className" => "Group", "objectId" => session[:current_user]["current_groupId"]}))
        end.get
        @users = @client.query("User_Group").tap do |j|
            j.eq("group_ptr", Parse::Pointer.new({"className" => "Group", "objectId" => session[:current_user]["current_groupId"]}))
            j.include = "user_info_ptr"
        end.get
        #@sprints = @sprints_query.get
        #@users_query = @client.query("User_Info")
        #@users = @users_query.get
        #@user = session[:current_user]
        #@user_info = @client.query("User_Info").eq("user_ptr", session[:current_user]["objectId"]).get
    end
end
