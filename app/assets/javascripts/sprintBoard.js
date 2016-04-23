$(document).ready(function() {
    if(document.getElementById("sprints_page"))
    {
        div_newTask_hide();
        getSprints(loadSprints);
        
        /*if(!getSprints(loadSprints) || !getFeatures(loadFeatures) || !getTasks(loadTasks) || !getGroupMembers())
        {
          throwError("Sorry, Page was not properly loaded"); 
          //maybe do a redirect
        }*/
        
        $('.newFeatureSubmit').click(function() {
            var sprint_ptr = window.new_feature_sprint_id;
            var owner_ptr = window.current_user_id;
            var name = $('#name').val();
            var description = $('#description').val();
            if($('#usePoker').is(":checked")) 
            {
                var poker = true;
                var difficulty = "";
            }
            else
            {
                var poker = false;
                var difficulty = $('#feature_dif').val();
            }
            createFeature(sprint_ptr, owner_ptr, name, description, difficulty, poker, loadNewFeature);
            div_abc_hide();
            //getSprints(loadSprints);
        });
        
        $('.newTaskSubmit').click(function() {
            var feature_ptr = window.new_task_feature_id;
            var creator_ptr = window.current_user_id;
            var title = $('#tname').val();
            var description = $('#tdescription').val();
            var totalHours;
            var type;
            createTask(feature_ptr, creator_ptr, title, description, totalHours, type, loadNewTask);
            div_newTask_hide();
        });
        
        /*$('.featureBar > .bar_title').click(function(){
            var h = this; 
        });*/
    }
});

function getSprints(callback)
{
    var sprintObject = Parse.Object.extend("Sprint");
    var query = new Parse.Query(sprintObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    query.include("group_ptr");
    query.ascending("start_date");
    query.find({
        success: function(sprint_list) {
            window.sprints = sprint_list;
            if(typeof callback === 'function')
            {
                callback();
            }
            return true;
        },
        error: function(error) {
            return false;
        }
    });
}
function getSprint(id,callback)
{
    var sprintObject = Parse.Object.extend("Sprint");
    var query = new Parse.Query(sprintObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    query.equalTo("objectId", id);
    query.include("group_ptr");
    query.ascending("start_date");
    query.find({
        success: function(sprint) {
            if(typeof callback === 'function')
            {
                callback(sprint);
            }
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
    query.equalTo("sprint_ptr", {"__type":"Pointer","className":"Sprint","objectId":""+ sprint_id +""});
    query.include("group_ptr");
    query.include("sprint_ptr");
    query.include("owner_ptr");
    query.find({
        success: function(myObj) {
            return myObj;
        },
        error: function(error) {
            return false;
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
function getFeatures(callback)
{
    var featureObject = Parse.Object.extend("Feature");
    var query = new Parse.Query(featureObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    query.include("group_ptr");
    query.include("sprint_ptr");
    query.include("owner_ptr");
    query.ascending("createdAt");
    query.find({
        success: function(feature_list) {
            window.features = feature_list;
            if(typeof callback === 'function')
            {
                callback();
            }
            return true;
        },
        error: function(error) {
            return false;
        }
    });  
}
function getFeature(id,callback)
{
    var featureObject = Parse.Object.extend("Feature");
    var query = new Parse.Query(featureObject);
    //query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    //query.equalTo("objectId", id);
    query.include("group_ptr");
    query.include("sprint_ptr");
    query.include("owner_ptr");
    //query.ascending("createdAt");
    query.get(id,{
        success: function(feature) {
            if(typeof callback === 'function')
            {
                callback(feature);
            }
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
function createFeature(sprint_ptr, owner_ptr, name, description, difficulty, poker, callback)
{
    var featureObject = Parse.Object.extend("Feature");
    var newFeature = new featureObject();
    newFeature.set("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    newFeature.set("sprint_ptr", {"__type":"Pointer","className":"Sprint","objectId":""+ sprint_ptr +""});
    newFeature.set("owner_ptr", {"__type":"Pointer","className":"User_Info","objectId":""+ owner_ptr +""});
    newFeature.set("name", name);
    newFeature.set("description", description);
    if(difficulty != "")
    {
        newFeature.set("difficulty", difficulty);
    }
    newFeature.set("use_poker", poker);
    newFeature.save(null, {
        success: function(myObj) {
                if(typeof callback === 'function')
                {
                    callback(myObj);
                }
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
function getTasks(callback)
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    query.include("feature_ptr");
    query.include("creator_ptr");
    query.find({
        success: function(task_list) {
            window.tasks = task_list;
            if(typeof callback === 'function')
            {
                callback();
            }
            return true;
        },
        error: function(error) {
            return false;
        }
    });   
}
function getTask(id,callback)
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    query.equalTo("objectId", id);
    query.include("feature_ptr");
    query.include("creator_ptr");
    query.find({
        success: function(task) {
            if(typeof callback === 'function')
            {
                callback(task);
            }
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
    query.ascending("updatedAt");
    query.find({
        success: function(task_list) {
            return task_list;
        },
        error: function(error) {
            return false;
        }
    });   
}
function createTask(feature_ptr, creator_ptr, title, description, totalHours, type,callback)
{
    var taskObject = Parse.Object.extend("Task");
    var newTask = new taskObject();
    newTask.set("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ feature_ptr +""});
    newTask.set("creator_ptr", {"__type":"Pointer","className":"User_Info","objectId":""+ creator_ptr +""});
    newTask.set("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ window.selected_group_id +""});
    newTask.set("Title", title);
    newTask.set("description", description);
    newTask.set("total_hours", totalHours);
    newTask.set("type", type);
    newTask.set("current_column", 1);
    newTask.save(null, {
        success: function(myObj) {
                if(typeof callback === 'function')
                {
                    callback(myObj);
                }
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
function taskMoved(id, feature_ptr, column)
{
    var taskObject = Parse.Object.extend("Task");
    var query = new Parse.Query(taskObject);
    query.include("feature_ptr");
    query.include("current_worker");
    query.get(id, {
        success: function(updateTask) {
            updateTask.set("feature_ptr", {"__type":"Pointer","className":"Feature","objectId":""+ feature_ptr +""});
            updateTask.set("current_worker", {"__type":"Pointer","className":"User_Info","objectId":""+ current_user_id +""});
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

function getGroupMembers(callback)
{
    var userGroupObject = Parse.Object.extend("User_Group");
    var query = new Parse.Query(userGroupObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    query.include("group_ptr");
    query.find({
        success: function(member_list) {
            window.members = member_list;
            if(typeof callback === 'function')
            {
                callback();
            }
            return true;
        },
        error: function(error) {
            return false;
        }
    });
}
function getColumns(callback)
{
    var sprintColumnObject = Parse.Object.extend("Sprint_Columns");
    var query = new Parse.Query(sprintColumnObject);
    query.equalTo("group_ptr", {"__type":"Pointer","className":"Group","objectId":""+ selected_group_id +""});
    query.include("group_ptr");
    query.find({
        success: function(column_list) {
            window.columns = column_list;
            if(typeof callback === 'function')
            {
                callback();
            }
            return true;
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
    var rtnDate = new Date(dateString);
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
function loadSprints()
{
    if(window.sprints != [] && window.sprints != undefined)
    {
        for(var i = 0; i < window.sprints.length; i++)
        {
            var sprint_html = '<div class = "sprintBar" id=' + window.sprints[i].id + '>\
                                    <div id=' + window.sprints[i].id + ' class= "toggle_sprint" onclick="toggleSprint(this.id)">-</div>\
                                    <div class= "bar_title">' + window.sprints[i].get("name") + '</div>\
                                    <div id=' + window.sprints[i].id + ' class= "bar_add_button" onclick="div_abc_show(this.id);">Add</div>\
                              </div>';
            if($('.board').children() == [])
            {
                $('.board div:last-child').append(sprint_html);
            }
            else
            {
                $('.board').append(sprint_html);
            }
        }
        getFeatures(loadFeatures);
    }
}
function loadFeatures()
{
    if(window.features != [] && window.features != undefined)
    {
        for(var i = 0; i < window.features.length; i++)
        {  
            var name = window.features[i].get("name");
            var difficulty = "" + window.features[i].get("difficulty")
            if(difficulty == null || difficulty == "" || difficulty == 'undefined')
            {
                difficulty = "--"
            }
            var sprintId = "" + window.features[i].get("sprint_ptr").id;
            var feature_html = '<div name=' + sprintId + ' class = "featureBar" id="'+ window.features[i].id + '">\
                                    <div name=' + sprintId + ' id=' + window.features[i].id + ' class= "toggle_feature" onclick="toggleFeature(this.id)">-</div>\
                                    <div id=' + window.features[i].id +' class="bar_title">' + name +'</div>\
                                    <div id=' + window.features[i].id + ' class= "bar_add_button" onclick="div_newTask_show(this.id);">Add</div>\
                                </div>';
            $(feature_html).insertAfter('#' + window.features[i].get("sprint_ptr").id);
            //var feature_num = "feature" + i;
            //var column_container = '<div class="my_column_container" id=' + feature_num +'></div>';
            //$(column_container).insertAfter('#' + window.features[i].id);
            var column_width = Math.floor(100 / number_of_columns);
            var style_string = " width:" + String(column_width) + "% ";
            for(var j = number_of_columns; j > 0; j--)
            {
                var id_string = "column" + j + "feature" + window.features[i].id;
                var column_html = '<div style= ' + style_string + 'class= "my_column columnSort" id= ' + id_string + ' name=' + sprintId + '></div>';
                $(column_html).insertAfter('#' + window.features[i].id);
                //$('#feature' + i).append(column_html);
            }
            
        }
        getTasks(loadTasks);
    }
}
function loadTasks()
{
    if(window.tasks != [] && window.tasks != undefined)
    {
        for(var i = 0; i < window.tasks.length; i++)
        {
            var id = "" + window.tasks[i].id;
            var name = window.tasks[i].get("Title");
            var description = window.tasks[i].get("description");
            if(description == undefined || description == null || description == "")
            {
                description = "No description to display"
            }
            if(window.tasks[i].get("current_worker") != undefined)
            {
                var worker = window.tasks[i].get("current_worker").get("first_name") + " " + window.tasks[i].get("current_worker").get("last_name");
            }
            else
            {
                var worker = "--"
            }
            
            var hours = window.tasks[i].get("total_hours");
            if(hours == undefined || hours == null)
            {
                hours = "--"
            }
            var task_html = '<div id=' + id + ' class="task_container">\
                                <div id=' + window.tasks[i].id +' class ="task_header handler">' + name + '</div>\
                                <div class ="task_description handler">' + description + '</div>\
                                <div class ="task_footer handler">\
                                    <div class = "task_worker">' + worker + '</div>\
                                    <div class = "task_hours">Hrs: ' + hours + '</div>\
                                </div>\
                            </div>';
            $('#column' + window.tasks[i].get("current_column") + 'feature' + window.tasks[i].get("feature_ptr").id).append(task_html);
            //$(task_html).insertAfter('#' + window.features[i].get("sprint_ptr").id);
            
        }
        activateSort();
    }   
}

function loadNewFeature(addfeat)
{
            var name = addfeat.get("name");
            var difficulty = "" + addfeat.get("difficulty")
            if(difficulty == null || difficulty == "" || difficulty == 'undefined')
            {
                difficulty = "--"
            }
            var sprintId = "" + addfeat.get("sprint_ptr").objectId;
            var feature_html = '<div name=' + sprintId + ' class = "featureBar" id="'+ addfeat.id + '">\
                                    <div name=' + sprintId + ' id=' + addfeat.id + ' class= "toggle_feature" onclick="toggleFeature(this.id)">-</div>\
                                    <div class= "bar_title">' + name +'</div>\
                                    <div id=' + addfeat.id + ' class= "bar_add_button" onclick="div_newTask_show(this.id);">Add</div>\
                                </div>';
            $(feature_html).insertAfter('#' + addfeat.get("sprint_ptr").objectId);
            //var feature_num = "feature" + i;
            //var column_container = '<div class="my_column_container" id=' + feature_num +'></div>';
            //$(column_container).insertAfter('#' + window.features[i].id);
            var column_width = Math.floor(100 / number_of_columns);
            var style_string = " width:" + String(column_width) + "% ";
            for(var j = number_of_columns; j > 0; j--)
            {
                var id_string = "column" + j + "feature" + addfeat.id;
                var column_html = '<div style= ' + style_string + 'class= "my_column columnSort" id= ' + id_string + ' name=' + sprintId + '></div>';
                $(column_html).insertAfter('#' + addfeat.id);
                //$('#feature' + i).append(column_html);
            }
}

function loadNewTask(addtask)
{
            var id = "" + addtask.id;
            var name = addtask.get("Title");
            var description = addtask.get("description");
            if(description == undefined || description == null || description == "")
            {
                description = "No description to display"
            }
            if(addtask.get("current_worker") != undefined)
            {
                var worker = addtask.get("current_worker").get("first_name") + " " + addtask.get("current_worker").get("last_name");
            }
            else
            {
                var worker = "--"
            }
            
            var hours = addtask.get("total_hours");
            if(hours == undefined || hours == null)
            {
                hours = "--"
            }
            var task_html = '<div id=' + id + ' class="task_container">\
                                <div class ="task_header handler">' + name + '</div>\
                                <div class ="task_description handler">' + description + '</div>\
                                <div class ="task_footer handler">\
                                    <div class = "task_worker">' + worker + '</div>\
                                    <div class = "task_hours">Hrs: ' + hours + '</div>\
                                </div>\
                            </div>';
            $('#column' + addtask.get("current_column") + 'feature' + addtask.get("feature_ptr").objectId).append(task_html);
            activateSort();
}

function activateSort()
{
    $(function() {
        $( ".my_column" ).sortable({
            connectWith: ".my_column",
            handle: ".handler",
            //cancel: ".portlet-toggle",
            placeholder: "portlet-placeholder ui-corner-all",
            start: function (event, ui) {
                ui.item.addClass('tilt');
                // Start monitoring tilt direction
                tilt_direction(ui.item);
            },
            update: function (event, ui) {
                //save_status(ui.item);
                get_new_status(ui.item);
            },
            stop: function (event, ui) {
                ui.item.removeClass("tilt");
                // Unbind temporary handlers and excess data
                $("html").unbind('mousemove', ui.item.data("move_handler"));
                ui.item.removeData("move_handler");
             }
        });
     
       /* $( ".task_container" ) //.addClass( "ui-widget ui-widget-content ui-helper-clearfix" )
          .find( ".task_header" )
            .addClass( "ui-widget-header ui-corner-all" )
            .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");*/
            
       /* $(".task_header").prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
     
        $( ".portlet-toggle" ).click(function() {
          var icon = $( this );
          icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
          icon.closest( ".task_container" ).find( ".task_description" ).toggle();
          icon.closest( ".task_container" ).find( ".task_footer" ).toggle();
        });*/
    });
}

function tilt_direction(item) 
{
    var left_pos = item.position().left,
    move_handler = function (e) {
        if (e.pageX >= left_pos) 
        {
            item.addClass("right");
            item.removeClass("left");
        } 
        else 
        {
            item.addClass("left");
            item.removeClass("right");
        }
        left_pos = e.pageX;
    };
            
    $("html").bind("mousemove", move_handler);
    item.data("move_handler", move_handler);
}

function get_new_status(item)
{
    var id = item.get(0).id;
    var colAndId = $(item).parent().get(0).id;
    var col = parseInt(colAndId[6]);
    var featId = colAndId.slice(14, colAndId.length);
    item.children(".task_footer").children(".task_worker").text(window.current_user_fname + " " + window.current_user_lname);
    taskMoved(id,featId,col);
    
}

function toggleSprint(id)
{
    //$('[name=' + id + ']').toggle();
    var item = $('#' + id + ' .toggle_sprint');
    var feats = $('.toggle_feature[name=' + id + ']').text("-");
    if(item.text() == '-')
    {
        $('[name=' + id + ']').hide();
        item.text("+");
        
    }
    else
    {
        $('[name=' + id + ']').show();
        item.text("-");
    }
}

function toggleFeature(id)
{
    /*for(var i = 1 ; i <= number_of_columns; i++)
    {
        $('#column' + i + 'feature' + id).show();
    }*/
    var item = $('#' + id + ' .toggle_feature');
    if(item.text() == '-')
    {
        for(var i = 1 ; i <= number_of_columns; i++)
        {
            $('#column' + i + 'feature' + id).hide();
        }
        item.text("+");
        
    }
    else
    {
        for(var i = 1 ; i <= number_of_columns; i++)
        {
            $('#column' + i + 'feature' + id).show();
        }
        item.text("-");
    }
}

function div_sp_show() {
    document.getElementById('sprintPopup').style.display = "block";
}
        //Function to Hide Popup
function div_sp_hide(){
    document.getElementById('sprintPopup').style.display = "none";
}

function div_abc_show(id) {
    document.getElementById('abc').style.display = "block";
    window.new_feature_sprint_id = id;
}
        //Function to Hide Popup
function div_abc_hide(){
    document.getElementById('abc').style.display = "none";
}

function div_newTask_show(id) {
    document.getElementById('newTask').style.display = "block";
    window.new_task_feature_id = id;
}

function div_newTask_hide() {
    document.getElementById('newTask').style.display = "none";
}

function div_ef_show(item) {
    document.getElementById('editFeaturePopup').style.display = "block";
        /*var Feature = Parse.Object.extend("Feature");
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
          });*/
}
        
        //Function to Hide Popup
function div_ef_hide(){
    document.getElementById('editFeaturePopup').style.display = "none";
}