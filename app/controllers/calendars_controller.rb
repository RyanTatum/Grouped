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
    end
end