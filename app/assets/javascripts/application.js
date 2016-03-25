// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery-ui
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require_self
//= require bootstrap-sprockets

//$('.dropdown-toggle').dropdown()

$(document).ready(function() {
    $(".group_selection").click(function(){
        var selected = this.id;
        var path = this.name;
        $.ajax({
            url: '/group_change',
            data: {groupId: selected, cur_path: path},
            type: 'post',
            success: function(data) 
            {
                $(".check_mark").hide();
                $("#check" + selected).show();
                var newLocation = "";
                //var newLocation = window.location.href.slice(0, window.location.href.indexOf(path));
                if(path.indexOf("poker") >= 0)
                {
                    //newLocation = "/poker";
                    newLocation = window.location.href.slice(0, window.location.href.indexOf("poker")) + "/poker";
                }
                else if(path.indexOf("sprint") >= 0)
                {
                    newLocation = window.location.href.slice(0, window.location.href.indexOf("sprint")) + "/sprints";
                }
                else if(path.indexOf("chat") >= 0)
                {
                    newLocation = window.location.href.slice(0, window.location.href.indexOf("chat")) + "/chat";
                }
                else if(path.indexOf("video") >= 0)
                {
                    newLocation = window.location.href.slice(0, window.location.href.indexOf("video")) + "/video";
                }
                else if(path.indexOf("user") >= 0 || path.indexOf("group") >= 0)
                {
                    newLocation = window.location.href;
                }
                else
                {
                    newLocation = window.location.href;
                }
                window.location.replace(newLocation);
            },
            failure: function() 
            {
                
            }
        });
    });
    
});