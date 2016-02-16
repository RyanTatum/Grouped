class GroupsController < ApplicationController
    skip_before_action :verify_authenticity_token
    #before_filter :set_current_user
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user, :only => ['show', 'edit', 'update', 'delete']
    
    def index
      redirect_to home_index_path
    end
    
    def new
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
      
        new_group = @client.object("Group")
        new_group["name"] = "New Group"
        group_result = new_group.save
        
        new_user_group = @client.object("User_Group")
        #new_user_group["user_id"] = session[:current_user]["objectId"]
        #new_user_group["group_id"] = group_result["objectId"]
        new_user_group["user_info_ptr"] = Parse::Pointer.new({"className" => "User_Info","objectId"  =>  @user_info["objectId"]})
        new_user_group["group_ptr"] = Parse::Pointer.new({"className" => "Group","objectId"  =>  group_result["objectId"]})
        new_user_group["status"] = "active"
        new_user_group["permissions"] = "group_admin"
        new_user_group.save
        redirect_to group_path(group_result["objectId"])
    end
    
    def show
        @group_id = params[:id]
        @group_record = @client.query("Group").eq("objectId", @group_id).get.first
        
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first

        @users = @client.query("User_Group").tap do |q|
          q.eq("group_ptr", Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id}))
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
=begin
        @group_id = params[:id]
        @group_record = @client.query("Group").eq("objectId", @group_id).get.first
        
        
        @user_group_query = @client.query("User_Group").tap do |q|
            q.eq("group_id", @group_id)
        end.get
        
        @user_ids = []
        @status_hash = {}
        @objectId_hash = {}
        @permissions_hash = {}
        @updated_hash = {}
        @user_group_query.each do |i|
            @status_hash[i["user_id"]] = i["status"]
            @objectId_hash[i["user_id"]] = i["objectId"]
            @permissions_hash[i["user_id"]] = i["permissions"]
            @updated_hash[i["user_id"]] = i["updatedAt"]
            @user_ids.push(i["user_id"])
        end
        
        @users = @client.query("User_Info").tap do |i|
            i.value_in("user_objectId", @user_ids)
        end.get
=end
    end
    
    def edit
        @group_id = params[:id]
        email = params[:new_name]
        @newMember = @client.query("User_Info").eq("email", email).get.first
        if @newMember != nil
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
      @user_group_id = params[:delete_user_id]
      if @user_group_id
        delete_user = @client.query("User_Group").eq("objectId", @user_group_id).get.first
      end
      if delete_user
        delete_user.parse_delete
      end
    end
end