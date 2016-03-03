class FeaturesController < ApplicationController
    before_filter :set_current_user
    before_filter :set_client
        
    def new
       @feature = Feature.new
    end
end