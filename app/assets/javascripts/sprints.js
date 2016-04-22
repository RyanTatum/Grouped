        $(document).ready(function() {
          //changeTable();
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