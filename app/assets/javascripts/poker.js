/*$(document).ready(function(){
   
   $("#sprint_dropdown :selected").text();
   var selected_sprint;
   $("#sprint_dropdown").change(function(){
     selected_sprint = $("#sprint_dropdown :selected").get(0).value;
     var feat_drop = $("#feature_dropdown");
     $('.default_select').attr('selected', true);
     for(var i = 0; i < feat_drop.children().length ; i++)
     {
        var featId = feat_drop.children().get(i).id;
        if(feat_drop.children().get(i).value != selected_sprint)
        {
            $('#' + featId).hide();
        }
        else
        {
            $('#' + featId).show(); 
        }
     }
   }());
});*/

$(document).ready(function() {
    Parse.initialize("Y25GZkeg7cc6dGRDBkhw8SgxmOwT3orM7O6SxSlD","lidAaWkyQwVQRgeMwKB3PCPt09Mzfwe0T02KK0Mg");
    var comment_list = {};
    if(document.getElementById("poker_page"))
    {
        window.setInterval(function pokerPull(){
                var Poker_Discussion = Parse.Object.extend("Poker_Discussion");
                var query = new Parse.Query(Poker_Discussion);
                query.equalTo("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ current_feature_id +""});
                query.include("user_info_ptr");
                query.find({
                    success: function(comments) {
                        comment_list = comments;
                    },
                    error: function(error) {
                        //alert("Error: " + error.code + " " + error.message);
                    }
                });
                
                if(comment_list.length != number_of_comments)
                {
                    for(var i = number_of_comments; i < comment_list.length; i++)
                    {   
                        var img_src = "";
                        if(comment_list[i].get("user_info_ptr").get("profile_picture")._url)
                        {
                            img_src = comment_list[i].get("user_info_ptr").get("profile_picture")._url
                        }
                        else
                        {
                            img_src = "/assets/profile_picture-8fa8abb06d2738ca66fa33eb32af4f6a482b9fee5040589ed9018c05e62897b7.png";
                        }
                        var time_stamp = comment_list[i].get("createdAt");
                        var user_name = comment_list[i].get("user_info_ptr").get("first_name") + ' ' + comment_list[0].get("user_info_ptr").get("last_name");
                        var comment = comment_list[i].get("message");
                        var chat_html = '<li class="left clearfix">\
    						    <span class="chat-img pull-left">\
    						        <img height= "50", width= "50", src = '+ img_src +'>\
    						    </span>\
    						    <div class="chat-body clearfix">\
    							    <div class="header">\
    								    <strong class="primary-font">' + user_name + '</strong> <small class="pull-right text-muted">\
    									   <span class="glyphicon glyphicon-time"></span>'+ time_stamp +'</small>\
    							    </div>\
    							    <p>\
    								    '+ comment + '\
    							    </p>\
    						    </div>\
    					    </li>';
    			        $('.chat').append(chat_html);
                    }
                    number_of_comments = comment_list.length;
                }
        }, 1000);
    }

    
    
    $('#btn-chat').click(function() {
        var comment = $('[name= "comment"]').get(0).value;
        var f_id = this.name;
        if(comment != null && comment.trim() != "")
        {
          var NewMessage = Parse.Object.extend("Poker_Discussion");
          var newMessage = new NewMessage();
          newMessage.set("message", comment);
          $('[name= "comment"]').val("");
          newMessage.set("user_info_ptr", {"__type":"Pointer","className":"User_Info","objectId":""+ current_user_id +""});
          newMessage.set("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ f_id +""});
          
          newMessage.save(null, {
            success: function(newMessage) {
              //pokerPull();
              return true;
            },
            error: function(newFeature, error) {
              // Execute any logic that should take place if the save fails.
              // error is a Parse.Error with an error code and message.
              alert('Failed to create new object, with error code: ' + error.message);
              return false;
            }
          });
        }
    });
});

function pokerPull()
{
        console.log("hello");
}