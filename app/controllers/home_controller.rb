class HomeController < ApplicationController
    def index
        query = Parse::Query.new("Test")
        @thequery = query.exists("field")
        @results = @thequery.get
    end
end