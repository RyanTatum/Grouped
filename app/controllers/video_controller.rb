class VideoController < ApplicationController
    
    skip_before_action :verify_authenticity_token
    before_filter :set_current_user
    before_filter :set_client
    before_filter :set_cache_headers
    
    def index 
    end 
end
