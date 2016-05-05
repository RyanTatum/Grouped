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
var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";
function dateChange(d)
{
    var newDate = month[d.getMonth()] + ' ' + d.getDate(); // + ',' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
    if(d.getDate() == 1 || d.getDate() == 21 || d.getDate() == 31)
    {
        newDate = newDate + 'st, ';
    }
    else if(d.getDate() == 2 || d.getDate() == 22)
    {
        newDate = newDate + 'nd, ';
    }
    else if(d.getDate() == 3 || d.getDate() == 23)
    {
        newDate = newDate + 'rd, ';
    }
    else
    {
        newDate = newDate + 'th, ';
    }
    newDate = newDate + d.getFullYear() + ' at ';
    var tmpTime;
    if(d.getHours() - 5 <= 0)
    {
        tmpTime = d.getHours() + 12 - 5;
    }
    else if(d.getHours() - 5 > 12)
    {
        tmpTime = d.getHours() - 12 - 5;
    }
    else
    {
        tmpTime = d.getHours() - 12;
    }
    if(tmpTime < 10)
    {
        newDate = newDate + '0' + tmpTime.toString();
    }
    else
    {
        newDate = newDate + tmpTime.toString();
    }
    if(d.getMinutes() < 10)
    {
        newDate = newDate + ':' + '0' + d.getMinutes();
    }
    else
    {
        newDate = newDate + ':' + d.getMinutes();
    }
    if( d.getHours() < 12)
    {
        newDate = newDate + ' AM';
    }
    else
    {
        newDate = newDate + ' PM';
    }
    return newDate;
}

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
                query.ascending("createdAt");
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
                        if(comment_list[i].get("user_info_ptr").get("profile_picture") != undefined)
                        {
                            img_src = comment_list[i].get("user_info_ptr").get("profile_picture")._url
                            img_src = img_src.replace("http", "https");
                        }
                        else
                        {
                            img_src = "/assets/profile_picture-8fa8abb06d2738ca66fa33eb32af4f6a482b9fee5040589ed9018c05e62897b7.png";
                        }
                        var d = new Date(comment_list[i].get("createdAt")); 
                        var time_stamp = dateChange(d);
                        //var time_stamp = month[d.getMonth()] + ' ' + d.getDay() + ',' + d.getFullYear() + ' at ' + d.getHours() + ':' + d.getMinutes();
                        //var time_stamp = comment_list[i].get("createdAt");
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
    
    $(".dropdown-poker").change(function(){
        var featId = $(".dropdown-poker :selected").get(0).value;
        //var sliceIndex = window.location.href.indexOf("poker") - 1
        var newLocation = window.location.href.slice(0, window.location.href.indexOf("poker")) + "poker/" + featId; 
        //window.location.replace("https://selt-seanbateman.c9.io/poker/"+ featId);
        window.location.replace(newLocation);
        /*$.ajax({
            url: '/dropdown',
            data: {id: featId},
            type: 'post',
            success: function(data) 
            {
                //$('.'+ assignId).children(0).get(0).textContent = assignName;
                //$('.'+ assignId).children(0).get(1).textContent = assignPoints;
                //alert("Successful");
                //window.location.replace("http://stackoverflow.com");
            },
            failure: function() 
            {
                //alert("Unsuccessful");
            }
        });*/
    });
});