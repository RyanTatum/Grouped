class GroupsController < ApplicationController
    skip_before_action :verify_authenticity_token
    #before_filter :set_current_user
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user, :only => ['show', 'edit', 'update', 'delete']
    
    def index
    
    end
    
    def new
        new_group = @client.object("Group")
        new_group["name"] = "New Group"
        group_result = new_group.save
        
        new_user_group = @client.object("User_Group")
        new_user_group["user_id"] = session[:current_user]["objectId"]
        new_user_group["group_id"] = group_result["objectId"]
        new_user_group["status"] = "active"
        new_user_group["permissions"] = "group_admin"
        new_user_group.save
        redirect_to group_path(group_result["objectId"])
    end
    
    def show
        @group_id = params[:id]
        @group_record = @client.query("Group").eq("objectId", @group_id).get.first
        #@group_record_query = @client.query("Group").eq("objectId", @group_id)
        #@group_record_query.include = "File"
        #@group_record = @group_record_query.get.first
        
        @user_group_query = @client.query("User_Group").tap do |q|
            q.eq("group_id", @group_id)
        end.get
        
        @user_ids = []
        @status_hash = {}
        @objectId_hash = {}
        @permissions_hash = {}
        @user_group_query.each do |i|
            @status_hash[i["user_id"]] = i["status"]
            @objectId_hash[i["user_id"]] = i["objectId"]
            @permissions_hash[i["user_id"]] = i["permissions"]
            @user_ids.push(i["user_id"])
        end
        
        @users = @client.query("User_Info").tap do |i|
            i.value_in("user_objectId", @user_ids)
        end.get
    end
    
    def edit
        @group_id = params[:id]
        email = params[:new_name]
        @newMember = @client.query("User_Info").eq("email", email).get.first
        if @newMember != nil
            puts "**************************"
            @addMember = @client.object("User_Group")
            @addMember["group_id"] = @group_id
            @addMember["user_id"] = @newMember["user_objectId"]
            @addMember["status"] = "pending"
            @addMember.save
        end
        redirect_to group_path(@group_id)
    end
    
    def create
    
    end
    
    def update
        @group_id = params[:id]
        @updategroup = @client.query("Group").eq("objectId", @group_id).get.first
        if params[:file]
          @photo = @client.file({
            :body => IO.read(params[:file].tempfile),
            :local_filename => params[:file].original_filename,
            :content_type => params[:file].content_type
          })
          begin
            @photo.save
          rescue Parse::ParseProtocolError
            redirect_to group_path(@group_record["objectId"])
          end
          @updategroup["name"] = params[:new_name]
          @updategroup["group_icon"] = @photo
          begin
            @group_record = @updategroup.save
          rescue Parse::ParseProtocolError
            redirect_to group_path(@group_record["objectId"])
          end
          #@updated = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
          #session[:current_user]["profile_picture"] = @updated["profile_picture"]
          redirect_to group_path(@group_record["objectId"])
        else 
          @updategroup["name"] = params[:new_name]
          begin
            @group_record = @updategroup.save
          rescue Parse::ParseProtocolError
            redirect_to group_path(@group_record["objectId"])
          end
          redirect_to group_path(@group_record["objectId"])
        end
    end
    
    def destroy
    
    end
end