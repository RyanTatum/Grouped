class SprintsController < ApplicationController
    before_filter :set_current_user
    before_filter :set_client
        
    def new
        @sprint = Sprint.new
    end
    
    def create
        
    end 
    def show
        @sprints_query = @client.query("Sprint")
        @sprints = @sprints_query.get
    end
end