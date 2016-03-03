class PokerController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user, :only => ['show', 'edit', 'update', 'delete']
    
    def index
        redirect_to poker_path("no_feat")
    end
    
    def new
        
    end
    
    def show
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        #@feature_id = params[:id]
        @feature_id = "i1SOfr1P6N"
        @group_id = "QUxofxenGB" #session[:current_user]["group_id"]
        
        @sprints = @client.query("Sprint").tap do |j|
            j.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id}))
        end.get 
        
        @features = @client.query("Feature").tap do |q|
            q.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id}))
            q.include = "group_ptr,sprint_ptr,owner_ptr"  
        end.get
        
        if @feature_id == "no_feat"
            if @features
                @selected_feat = @features.first
                @feature_id = @selected_feat["objectId"]
                @selected_sprint = @selected_feat["sprint_ptr"]
            end
        end
        
        @group_members = @client.query("User_Group").tap do |j|
            j.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id}))
        end.get 
        
        @group_size = @group_members.length
        
        @poker_users = @client.query("Poker").tap do |i|
            i.eq("feature_ptr", Parse::Pointer.new({"className" => "Feature","objectId"  =>  @feature_id}))
            i.include = "feature_ptr,user_info_ptr"
        end.get 
        
        @display_votes = false
        if(@group_size == @poker_users.length)
            @display_votes = true
        end
        
        @stored_vote = 0
        @poker_users.each do |i|
           if @user_info["objectId"] == i["user_info_ptr"]["objectId"]
               @stored_vote = i['vote']
           end
        end
        
        @feature_comments = @client.query("Poker_Discussion").tap do |i|
            i.eq("feature_ptr", Parse::Pointer.new({"className" => "Feature","objectId"  =>  @feature_id}))
            i.include = "feature_ptr,user_info_ptr"
        end.get 
    end
    
    def vote
        @new_rating = params[:rating]
        #@feature_id = params[:id]
        @feature_id = "i1SOfr1P6N"
        #@user_info_id = session[:current_user]["user_info_id"]
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        
        @user_vote = @client.query("Poker").tap do |i|
            i.eq("feature_ptr", Parse::Pointer.new({"className" => "Feature","objectId"  =>  @feature_id}))
            i.eq("user_info_ptr", Parse::Pointer.new({"className" => "User_Info","objectId"  =>  @user_info["objectId"]}))
        end.get.first
        
        if @user_vote
            @user_vote["vote"] = @new_rating.to_i
            @user_vote.save
        else
            @add_vote = @client.object("Poker")
            @add_vote["feature_ptr"] = Parse::Pointer.new({"className" => "Feature","objectId"  =>  @feature_id})
            @add_vote["user_info_ptr"] = Parse::Pointer.new({"className" => "User_Info","objectId"  =>  @user_info["objectId"]})
            @add_vote["vote"] = @new_rating.to_i
            @add_vote.save
        end
        puts @user_vote
        
        redirect_to poker_path("C7nugV0h2l")
    end
end    