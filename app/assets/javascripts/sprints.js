        $(document).ready(function() {
          changeTable();
        });
        function div_abc_show() {
          document.getElementById('abc').style.display = "block";
        }
        //Function to Hide Popup
        function div_abc_hide(){
          document.getElementById('abc').style.display = "none";
        }
        
        function div_sp_show() {
          document.getElementById('sprintPopup').style.display = "block";
        }
        //Function to Hide Popup
        function div_sp_hide(){
          document.getElementById('sprintPopup').style.display = "none";
        }
        
        function div_ef_show(id) {
          document.getElementById('editFeaturePopup').style.display = "block";
          var Feature = Parse.Object.extend("Feature");
          var query = new Parse.Query(Feature);
          query.include("owner_ptr")
          query.equalTo("objectId", id);
          query.find({
            success:function(feature) {
              document.getElementById('editfeaturename').value = feature[0].get('name');
              document.getElementById('editfeaturedescription').value = feature[0].get('description');
              document.getElementById('editfeatureworker').value = feature[0].get('current_worker');
              
              //document.getElementById('feature_difficulty').innerHTML = feature[0].get('owner_ptr').id;
              
              if ($('.current_user_id').get(0).id == feature[0].get('owner_ptr').id)
              {
                $('#edit_hidden_difficulty').show();
                $('#edit_feature_dif').val(feature[0].get('difficulty'));
                $('#display_difficulty').hide();
              }
              else
              {
                $('#display_difficulty').show();
                $('#edit_hidden_difficulty').hide();
                document.getElementById('display_difficulty').innerHTML = feature[0].get('difficulty');
              }
              
              document.getElementById('deletefeature').setAttribute('onclick', 'deleteFeature(' +'"'+id+'")');
              document.getElementById('updatefeature').setAttribute('onclick', 'updateFeature(' +'"'+id+'")');
            }
          });
        }
        
        //Function to Hide Popup
        function div_ef_hide(){
          document.getElementById('editFeaturePopup').style.display = "none";
        }
        
        function deleteFeature(id) {
          var Feature = Parse.Object.extend("Feature");
          var query = new Parse.Query(Feature);
          query.get(id, {
            success: function(myObj) {
              // The object was retrieved successfully.
              myObj.destroy({
                success:function() {
                  changeTable();
                  div_ef_hide();
                }
              });
            }
          });
        }
        
        function updateFeature(id) { 
          var Feature = Parse.Object.extend("Feature");
          var query = new Parse.Query(Feature);
          query.include("owner_ptr")
          query.get(id, {
            success: function(myObj) {
              // The object was retrieved successfully.
              myObj.set("name", $('#editfeaturename').val());
              myObj.set("description", $('#editfeaturedescription').val());
              myObj.set("current_worker", $('#editfeatureworker').val());
              if ($('.current_user_id').get(0).id == myObj.get('owner_ptr').id)
              {
                myObj.set("difficulty", $('#edit_feature_dif').val());
              }

              myObj.save({
                success:function() {
                  changeTable();
                  div_ef_hide();
                }
              });
            }
          });
          
        }
        
        //Function to save a new feature
        function newFeature() {
          var NewFeature = Parse.Object.extend("Feature");
          var newFeature = new NewFeature();
          newFeature.set("name", $('#name').val());
          //$('#name').val("");
          newFeature.set("description", $('#description').val());
          //$('#description').val("");
          newFeature.set("sprint_id", $('#sprint_field').val());
          newFeature.set("current_worker", $('#feature_worker').val());
          newFeature.set("status", "todo");
          newFeature.set("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""})
          newFeature.set("sprint_ptr", {"__type":"Pointer","className":"Sprint","objectId":""+ $('#sprint_field').val() +""})
          //newFeature.set("owner_ptr", {"__type":"Pointer","className":"User_Info","objectId":""+ current_user_id +""})
          var Pointer = Parse.Object.extend("User_Info");
          var pointer = new Pointer();
          pointer.set("objectId", $('.current_user_id').get(0).id);
          newFeature.set("owner_ptr", pointer);
          
          if($('#usePoker').is(":checked"))   
            newFeature.set("use_poker", true);
          else
          {
            newFeature.set("use_poker", false);
            newFeature.set("difficulty", $('#feature_dif').val());
          }

          newFeature.save(null, {
            success: function(newFeature) {
              div_abc_hide();
              changeTable();
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
        
        //Function to save a new 
        function newSprint() {
          name = $('#sprintName').get(0).value;
          var start = "";
          var end = "";
          sTemp = $('#startDate').get(0).value;
          eTemp = $('#endDate').get(0).value;
          if(sTemp != null && sTemp != "")
          {
            start = new Date(sTemp);
          }
          if(sTemp != null && sTemp != "")
          {
            end = new Date(eTemp);
          }
          
          if(name != "" && name != null && start != null && end != null)
          {
            var NewFeature = Parse.Object.extend("Sprint");
            var newFeature = new NewFeature();
            newFeature.set("name", name);
            start = new Date($('#startDate').get(0).value);
            end = new Date($('#endDate').get(0).value);
            newFeature.set("start_date", start);
            newFeature.set("end_date", end);
            newFeature.set("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""})
            newFeature.save(null, {
              success: function(newFeature) {
                div_sp_hide();
                changeTable();
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
        }
        
        function changeTable() {
          Parse.initialize("Y25GZkeg7cc6dGRDBkhw8SgxmOwT3orM7O6SxSlD","lidAaWkyQwVQRgeMwKB3PCPt09Mzfwe0T02KK0Mg");
          document.getElementById("todo").innerHTML = "";
          document.getElementById("doing").innerHTML = "";
          document.getElementById("done").innerHTML = "";
          var Feature = Parse.Object.extend("Feature");
          var query = new Parse.Query(Feature);
          var text = "";
          var sprintField = $( "#sprint_field" ).val();
          if(sprintField != null)
          {
            query.equalTo("sprint_id", sprintField);
            query.find({
              success:function(features) {
                  for (i = 0; i < features.length; i++) { 
                      var object = features[i];
                      var div = document.createElement('div');
                      div.setAttribute("id", object.id);
                      div.setAttribute('class', 'portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all');
                      div.setAttribute('onclick', 'div_ef_show(' +'"'+object.id+'")')
                      document.body.appendChild(div);
                      text = "<div class='portlet-header ui-sortable ui-widget-header ui-corner-all'>"  + object.get('name') + "</div>" + "<div class='portlet-content'>" + object.get('description') + "</div>";
                      div.innerHTML = text;
                      var columnName = object.get("status")
                      
                      if (columnName == "todo") {
                        document.getElementById("todo").appendChild(div);
                      }
                      else if (columnName == "doing") {
                        document.getElementById("doing").appendChild(div);
                      }
                      else if (columnName == "done") {
                        document.getElementById("done").appendChild(div);
                      }
                  }
              }
            });
          }
        }
        
        function save_status(item) {
            var Feature = Parse.Object.extend("Feature");
            var query = new Parse.Query(Feature);
            query.get(item.context.id, {
              success: function(feature) {
                // The object was retrieved successfully.
                feature.set("status", $(item.parent()).attr('id'))
                feature.save(null, {
                  success: function(feature) {
                    // Execute any logic that should take place after the object is saved.
                  },
                  error: function(feature, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                  }
                });
              },
              error: function(object, error) {
                  alert('not found');
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
              }
            });
        }
        
        // Monitor tilt direction and switch between classes accordingly
        function tilt_direction(item) {
          var left_pos = item.position().left,
            move_handler = function (e) {
              if (e.pageX >= left_pos) {
                item.addClass("right");
                item.removeClass("left");
              } else {
                item.addClass("left");
                item.removeClass("right");
              }
              left_pos = e.pageX;
            };
            
            $("html").bind("mousemove", move_handler);
            item.data("move_handler", move_handler);
        }
        
          $(function() {
            $( ".columnSort" ).sortable({
              connectWith: ".columnSort",
              handle: ".portlet-header",
              cancel: ".portlet-toggle .title",
              placeholder: "portlet-placeholder ui-corner-all",
              start: function (event, ui) {
                    ui.item.addClass('tilt');
                    // Start monitoring tilt direction
                    tilt_direction(ui.item);
              },
              update: function (event, ui) {
                  save_status(ui.item);
              },
              stop: function (event, ui) {
                    ui.item.removeClass("tilt");
                    // Unbind temporary handlers and excess data
                    $("html").unbind('mousemove', ui.item.data("move_handler"));
                    ui.item.removeData("move_handler");
              }
            });
            $( ".portlet" )
              .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
              .find( ".portlet-header" )
                .addClass( "ui-widget-header ui-corner-all" )
                .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
         
            $( ".portlet-toggle" ).click(function() {
              var icon = $( this );
              icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
              icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
            });
          });
          
          function valueChanged()
          {
              if($('#usePoker').is(":checked"))   
                  $("#hidden_difficulty").hide();
              else
                  $("#hidden_difficulty").show();
          }

//************************************************************************************************************
//
//***********************************************************************************************************
$(document).ready(function() {
    if(document.getElementById("poker_page"))
    {
        sprints = {};   /*global sprints*/
        features = {};  /*global features*/
        tasks = {};     /*global tasks*/
        members = {};   /*global tasks*/
        if(!getSprints() || !getFeatures() || !getTasks() || !getGroupMembers())
        {
          throwError("Sorry, Page was not properly loaded"); 
          //maybe do a redirect
        }
        changeTable();
    }
});

function getSprints()
{
    var sprintObject = Parse.Object.extend("Sprint");
    var query = new Parse.Query(sprintObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ current_group_id +""});
    query.include("group_ptr");
    query.find({
        success: function(sprint_list) {
            sprints = sprint_list;
            return true;
        },
        error: function(error) {
            return false;
        }
    });
}

function createSprint(name, start, end)
{
    var sprintObject = Parse.Object.extend("Sprint");
    var newSprint = new sprintObject();
    newSprint.set("name", name);
    newSprint.set("start_date", start);
    newSprint.set("end_date", end);
    newSprint.set("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    newSprint.save(null, {
        success: function(newSprint) {
            div_sp_hide();
            changeTable();
            return "true";
        },
        error: function(newSprint, error) {
            return "Sorry, an error occurred with the database";
        }
    });
}
function editSprint(id, name, startDate, endDate)
{
    var sprintObject = Parse.Object.extend("Sprint");
    var query = new Parse.Query(sprintObject);
    query.get(id, {
        success: function(updateSprint) {
            updateSprint.set("name", name);
            updateSprint.set("start_date", startDate);
            updateSprint.set("end_date", endDate);
            updateSprint.save({
                success:function() {
                    return "true";
                },
                error: function() {
                    return "Sorry, an error occurred with the database";
                }
            });
        },
        error: function() {
            return "Sorry, an error occurred with the database";
        }
    });
}
function deleteSprint(id)
{
    var featuresToDelete = getFeaturesInSprint(id);
    for(var i = 0; i< featuresToDelete.length; i++)
    {
        var result = deleteFeature(featuresToDelete[i].get("objectId"));
        if(result != "true")
        {
            return "Unable to delete the Sprint";
        }
    }
    var query = new Parse.Query(sprintObject);
    query.get(id, {
        success: function(myObj) {
            myObj.destroy({
                success:function() {

                    return "true";
                },
                error: function(error) {
                    return "Unable to delete the Sprint";
                }
            });
        },
        error: function(error) {
            return "Unable to delete the Sprint";
        }
    });
}
function getFeatures()
{
    var featureObject = Parse.Object.extend("Feature");
    var query = new Parse.Query(featureObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ current_group_id +""});
    query.include("group_ptr");
    query.include("sprint_ptr");
    query.include("owner_ptr");
    query.find({
        success: function(feature_list) {
            features = feature_list;
            return true;
        },
        error: function(error) {
            return false;
        }
    });  
}
function getFeaturesInSprint(sprint_id)
{
    var featureObject = Parse.Object.extend("Feature");
    var query = new Parse.Query(featureObject);
    query.equalTo("sprint_ptr", {"__type":"Pointer","className":"Sprint","objectId":""+ sprint_id +""});
    query.include("group_ptr");
    query.include("sprint_ptr");
    query.include("owner_ptr");
    query.find({
        success: function(feature_list) {
            return feature_list;
        },
        error: function(error) {
            return false;
        }
    });
}
function createFeature(sprint_ptr, owner_ptr, name, description, difficulty, poker)
{
    var featureObject = Parse.Object.extend("Feature");
    var newFeature = new featureObject();
    newFeature.set("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    newFeature.set("sprint_ptr", {"__type":"Pointer","className":"Sprint","objectId":""+ sprint_ptr +""});
    newFeature.set("owner_ptr", {"__type":"Pointer","className":"User_Info","objectId":""+ owner_ptr +""});
    newFeature.set("name", name);
    newFeature.set("description", description);
    newFeature.set("difficulty", difficulty);
    newFeature.set("use_poker", poker);
    newFeature.save(null, {
        success: function(myObj) {
                return "true";
        },
        error: function(myObj, error) {
              return "Sorry, an error occurred with the database";
        }
    });
}
function editFeature(id, sprint_ptr, owner_ptr, name, description, difficulty, poker)
{
    var featureObject = Parse.Object.extend("Feature");
    var query = new Parse.Query(featureObject);
    query.include("owner_ptr");
    query.include("sprint_ptr");
    query.get(id, {
        success: function(updateFeature) {
            updateFeature.set("sprint_ptr", {"__type":"Pointer","className":"Sprint","objectId":""+ sprint_ptr +""});
            updateFeature.set("owner_ptr", {"__type":"Pointer","className":"User_Info","objectId":""+ owner_ptr +""});
            updateFeature.set("name", name);
            updateFeature.set("description", description);
            updateFeature.set("use_poker", poker);
            if(current_user_id == myObj.get('owner_ptr').id)
            {
                updateFeature.set("difficulty", difficulty);
            }
            updateFeature.save({
                success:function() {
                    return "true";
                },
                error: function() {
                    return "Sorry, an error occurred with the database";
                }
            });
        },
        error: function() {
            return "Sorry, an error occurred with the database";
        }
    });
}
function deleteFeature(id)
{
    var tasksToDelete = getTasksInFeature(id);
    for(var i = 0; i< tasksToDelete.length; i++)
    {
        var result = deleteTask(tasksToDelete[i].get("objectId"));
        if(result != "true")
        {
            return "Unable to delete the feature";
        }
    }
    var Feature = Parse.Object.extend("Feature");
    var query = new Parse.Query(Feature);
    query.get(id, {
        success: function(myObj) {
            myObj.destroy({
                success:function() {

                    return "true";
                },
                error: function(error) {
                    return "Unable to delete the feature";
                }
            });
        },
        error: function(error) {
            return "Unable to delete the feature";
        }
    });
    
}
function getTasks()
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ current_group_id +""});
    query.include("feature_ptr");
    query.include("creator_ptr");
    query.find({
        success: function(task_list) {
            tasks = task_list;
            return true;
        },
        error: function(error) {
            return false;
        }
    });   
}
function getTasksInFeature(feature_id)
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.equalTo("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ feature_id +""});
    query.include("feature_ptr");
    query.include("creator_ptr");
    query.find({
        success: function(task_list) {
            return task_list;
        },
        error: function(error) {
            return false;
        }
    });   
}
function createTask(feature_ptr, creator_ptr, title, description, totalHours, type)
{
    var taskObject = Parse.Object.extend("Task");
    var newTask = new taskObject();
    newTask.set("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ feature_ptr +""});
    newTask.set("creator_ptr", {"__type":"Pointer","className":"User_Info","objectId":""+ creator_ptr +""});
    newTask.set("title", title);
    newTask.set("description", description);
    newTask.set("total_hours", totalHours);
    newTask.set("type", type);
    newTask.set("current_column", 1);
    newTask.save(null, {
        success: function(myObj) {
                return "true";
        },
        error: function(myObj, error) {
              return "Sorry, an error occurred with the database";
        }
    });
}
function editTask(id, feature_ptr, current_worker, column, title, description, totalHours, type)
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.include("feature_ptr");
    query.include("current_worker");
    query.get(id, {
        success: function(updateTask) {
            updateTask.set("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ feature_ptr +""});
            updateTask.set("current_worker", {"__type":"Pointer","className":"User_Info","objectId":""+ current_worker +""});
            updateTask.set("title", title);
            updateTask.set("description", description);
            updateTask.set("total_hours", totalHours);
            updateTask.set("type", type);
            updateTask.set("current_column", column);
            updateTask.save({
                success:function() {
                    return "true";
                },
                error: function() {
                    return "Sorry, an error occurred with the database";
                }
            });
        },
        error: function() {
            return "Sorry, an error occurred with the database";
        }
    });
}
function taskMoved(id, feature_ptr)
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.include("feature_ptr");
    query.include("current_worker");
    query.get(id, {
        success: function(updateTask) {
            updateTask.set("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ feature_ptr +""});
            updateTask.set("current_worker", {"__type":"Pointer","className":"User_Info","objectId":""+ current_user_id +""});
            updateTask.save({
                success:function() {
                    return "true";
                },
                error: function() {
                    return "Sorry, an error occurred with the database";
                }
            });
        },
        error: function() {
            return "Sorry, an error occurred with the database";
        }
    });
}
function deleteTask(id)
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.get(id, {
        success: function(myObj) {
            myObj.destroy({
                success:function() {
                    return "true";
                },
                error: function(error) {
                    return "Unable to delete the task";
                }
            });
        },
        error: function(error) {
            return "Unable to delete the task";
        }
    });
}

function getGroupMembers()
{
    var userGroupObject = Parse.Object.extend("User_Group");
    var query = new Parse.Query(userGroupObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ current_group_id +""});
    query.include("group_ptr");
    query.find({
        success: function(member_list) {
            members = member_list;
        },
        error: function(error) {
            return false;
        }
    });
}
function makeDate(dateString)
{
  if(dateString != null && dateString != "")
  {
    rtnDate = new Date(dateString);
    if(rtnDate == "Invalid Date")
    {
      return false;
    }
    return rtnDate;
  }
  else
  {
    return false;
  }
}
function dateCompare(start, end)
{
  if(start >= end)
  {
    return false;
  }
  else
  {
    return true;
  }
}
function throwError(errorMessage)
{
  
}