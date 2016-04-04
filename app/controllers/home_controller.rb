class HomeController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user
    
    def index
       
    end
    
    def show 
        
    end
      
    def group_change
        @new_group = @client.query("Group").tap do |q|
            q.eq("objectId", params[:groupId])
        end.get.first
        if @new_group
            session[:current_user]["current_groupId"] = @new_group["objectId"]
        end

        redirect_to users_path
    end
end