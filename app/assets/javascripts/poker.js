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