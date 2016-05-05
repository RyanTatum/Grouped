class CalendarsController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_filter :set_client, :set_current_user
    
    def create
        @calendar = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        #@calendar.array_add("times", 0)
        #@calendar.array_add("times", 1)
        #@calendar.array_add("times", 0)
        #params["times"].each { |x| @calendar.array_remove("times", x)}
        #params["times"].each { |x| @calendar.array_add("times", x[1].to_i)}
        #@calendar.save
        @calendar.array_remove("times", 0)
        @calendar.array_remove("times", 1)
        @calendar.save
        update(params["times"])
        redirect_to "/users/#{session[:current_user]["objectId"]}"    
    end
    
    def update(values)
        @calendar = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        values.each { |x| @calendar.array_add("times", x[1].to_i)}
        @calendar.save
    end
    
    def show
        @calendar = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        @group_id = params[:id]
        @group_record = @client.query("Group").eq("objectId", @group_id).get.first
        
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        
        @users = @client.query("User_Group").tap do |q|
          q.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id.to_s}))
          q.include = "group_ptr,user_info_ptr"
        end.get
        
        @users.each do |i|
          if i["user_info_ptr"]["objectId"] == @user_info["objectId"]
            if i["permissions"] == "group_admin"
              @permissions = true;
            else
              @permissions = false;
            end
          end
        end
        
        if @calendar["times"].class == NilClass
          @calendar["times"] = Array.new(255, 0)
        end
    end
    
    def edit
        @calendar = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        if @calendar["times"].class == NilClass
          @calendar["times"] = Array.new(255, 0)
        end
    end
end