class GroupsController < ApplicationController
    skip_before_action :verify_authenticity_token
    #before_filter :set_current_user
    before_filter :set_client
    before_filter :set_cache_headers
    before_filter :set_current_user
    
    def index
      redirect_to home_index_path
    end
    
    def new
        @user_info = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
      
        new_group = @client.object("Group")
        new_group["name"] = "New Group"
        new_group["group_count"] = 5
        group_result = new_group.save
        
        new_user_group = @client.object("User_Group")
        #new_user_group["user_id"] = session[:current_user]["objectId"]
        #new_user_group["group_id"] = group_result["objectId"]
        new_user_group["user_info_ptr"] = Parse::Pointer.new({"className" => "User_Info","objectId"  =>  @user_info["objectId"]})
        new_user_group["group_ptr"] = Parse::Pointer.new({"className" => "Group","objectId"  =>  group_result["objectId"]})
        new_user_group["status"] = "active"
        new_user_group["permissions"] = "group_admin"
        new_user_group.save
        
        new_sprint = @client.object("Sprint")
        new_sprint["name"] = "Backlog"
        new_sprint["group_ptr"] = Parse::Pointer.new({"className" => "Group","objectId"  =>  group_result["objectId"]})
        new_sprint.save
        
        redirect_to group_path(group_result["objectId"])
    end
    
    def show
        @calendar = @client.query("User_Info").eq("user_objectId", session[:current_user]["objectId"]).get.first
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
        
        @sprint_columns = @group_record["sprint_names"];
        if(@sprint_columns == nil|| @sprint_columns == [] || @sprint_columns == "")
           @sprint_columns = ["Todo", "Doing", "Done"] 
        end
    end
    
    def edit
        @group_id = params[:id]
        email = params[:new_name]
        @newMember = @client.query("User_Info").eq("email", email).get.first
        if @newMember != nil
            @addMember = @client.object("User_Group")
            #@addMember["group_id"] = @group_id
            #@addMember["user_id"] = @newMember["user_objectId"]
            @addMember["group_ptr"] = Parse::Pointer.new({"className" => "Group","objectId"  =>  @group_id})
            @addMember["user_info_ptr"] = Parse::Pointer.new({"className" => "User_Info","objectId"  =>  @newMember["objectId"]})
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
        @starCount = params[:starCount]
        @sprintCount = params[:sprint_columns].to_i
        @newCols = []
        for i in 0..(@sprintCount - 1)
          @newCols.push(params["col#{i}_name"])
        end
        
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
          @updategroup["star_count"] = @starCount.to_i
          @updategroup["sprint_names"] = @newCols
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
          @updategroup["star_count"] = @starCount.to_i
          @updategroup["sprint_names"] = @newCols
          begin
            @group_record = @updategroup.save
          rescue Parse::ParseProtocolError
            redirect_to group_path(@group_record["objectId"])
          end
          redirect_to group_path(@group_record["objectId"])
        end
    end
    
    def destroy
      @group_id = params[:id]
      @user_group_id = params[:delete_user_id]
      if @user_group_id
        delete_user = @client.query("User_Group").eq("objectId", @user_group_id).get.first
      end
      if delete_user
        delete_user.parse_delete
      end
      redirect_to group_path(@group_id)
    end
end