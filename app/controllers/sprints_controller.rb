class SprintsController < ApplicationController
    before_filter :set_current_user
    before_filter :set_client
        
    def show
        @sprints_query = @client.query("Sprint")
        @sprints = @sprints_query.get
        @features_query = @client.query("Feature")
        @features = @features_query.get
    end
    
    def change_sprint
        @features_query = @client.query("Feature")
        @features = @features_query.get
    end
end
