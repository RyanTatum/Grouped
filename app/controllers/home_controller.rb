class HomeController < ApplicationController
    before_filter :set_current_user
    before_filter :set_client
    
    def index
       
    end
    
    def show 
        
    end
      
    def group_change
        @new_group = @client.query("User_Group").tap do |q|
            q.eq("objectId", params[:groupId])
            q.include = "group_ptr,user_info_ptr"
        end.get.first
        if @new_group
            session[:current_user]["current_groupId"] = @new_group
        end
        @path = params[:cur_path]
        puts "***************"
        puts @path
        if @path
            if @path.include? "/poker"
                redirect_to users_path
            elsif @path.include? "/sprints"
                redirect_to sprint_path
            elsif @path.include? "/chat"
                redirect_to users_path
            elsif @path.include? "/video"
                redirect_to users_path
            else
                redirect_to users_path
            end
        else
            redirect_to users_path
        end
    end
end