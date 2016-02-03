class HomeController < ApplicationController
    before_filter :set_current_user
    before_filter :set_client
    
    def index
       
    end
end