class PokerController < ApplicationController
    skip_before_action :verify_authenticity_token
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user, :only => ['show', 'edit', 'update', 'delete']
    
    def index
        redirect_to poker_path("no_feat")
    end
    
    def submitVote
        @feature_id = params[:id]
        @diff = params[:diff]
        if @feature_id
            @feature = @client.query("Feature").tap do |q|
                q.eq("objectId", @feature_id)
                q.include = "group_ptr,sprint_ptr,owner_ptr"  
            end.get.first
            if @feature
                @feature["difficulty"] = @diff.to_i
                @feature.save
            end
            redirect_to poker_path(@feature_id)
        else
            redirect_to poker_path("no_feat")
        end
    end
    
    def show
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        @feature_id = params[:id]
        @selected_sprint = params[:sprint_id]
        #@feature_id = "i1SOfr1P6N"
        #@group_id = "QUxofxenGB" 
        @group_id =  session[:current_user]["current_groupId"]
        
        if !@group_id || @group_id == ""
            redirect_to users_path
            flash[:notice] = "You need be in a group in order to poker"
        end
        
        @sprints = @client.query("Sprint").tap do |j|
            j.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id}))
        end.get 
        
        @features = @client.query("Feature").tap do |q|
            q.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id}))
            q.include = "group_ptr,sprint_ptr,owner_ptr"  
        end.get
        
        puts "****************"
        puts @features
        
        if !@features || @features == []
            flash[:notice] = "The selected group has no features to poker"
           redirect_to users_path 
        end
        
        if @feature_id == "no_feat"
            if @features && @features.first
                @selected_feat = @features.first
                @feature_id = @selected_feat["objectId"]
                @selected_sprint = @selected_feat["sprint_ptr"]
            end
        else
            @selected_feat = @client.query("Feature").tap do |q|
                q.eq("objectId", @feature_id)
                q.include = "group_ptr,sprint_ptr,owner_ptr"  
            end.get.first
        end
        
        @group_members = @client.query("User_Group").tap do |j|
            j.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id}))
            j.include = "group_ptr,user_info_ptr"
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
        
        @sumbit_enable = true
        if @poker_users.first
            @first_vote = @poker_users.first["vote"]
        end
        
        @stored_vote = 0
        @voted_hash = {}
        @poker_users.each do |i|
            @voted_hash[i["user_info_ptr"]["objectId"]] = true
            if @user_info["objectId"] == i["user_info_ptr"]["objectId"]
                @stored_vote = i['vote']
            end
            if !@display_votes || @first_vote != i["vote"]
               @sumbit_enable = false 
            end
        end
        
        @feature_comments = @client.query("Poker_Discussion").tap do |i|
            i.eq("feature_ptr", Parse::Pointer.new({"className" => "Feature","objectId"  =>  @feature_id}))
            i.include = "feature_ptr,user_info_ptr"
            i.order_by = "createdAt"
            i.order = :ascending
        end.get 
    end
    
    def vote
        @new_rating = params[:rating]
        @feature_id = params[:feat_id]
        #@feature_id = "i1SOfr1P6N"
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
        
        redirect_to poker_path(@feature_id)
    end
    
    def comment
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
        @new_comment = params[:comment]
        @feature_id = params[:feat_id]
        
        new_message = @client.object("Poker_Discussion")
        new_message["user_info_ptr"] = Parse::Pointer.new({"className" => "User_Info","objectId"  =>  @user_info["objectId"]})
        new_message["feature_ptr"] = Parse::Pointer.new({"className" => "Feature","objectId"  =>  @feature_id})
        new_message["message"] = @new_comment
        message_result = new_message.save
        
        #redirect_to poker_path(@feature_id)
    end
end    