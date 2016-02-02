class HomeController < ApplicationController
    before_filter :set_current_user
    before_filter :set_client
    
    def index
        @current_user
    end
end