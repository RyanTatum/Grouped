$(document).ready(function() {
    var panels = $('.user-infos');
    var panelsButton = $('.dropdown-user');
    panels.hide();

    //Click dropdown
    panelsButton.click(function() {
        //get data-for attribute
        var dataFor = $(this).attr('data-for');
        var idFor = $(dataFor);

        //current button
        var currentButton = $(this);
        idFor.slideToggle(400, function() {
            //Completed slidetoggle
            if(idFor.is(':visible'))
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
            }
            else
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
            }
        })
    });


    $('[data-toggle="tooltip"]').tooltip();
});

$(document).ready(function(){
    document.getElementById('password').disabled = false;
    $("#edit").click(function(){
        $("#view").hide();
        $("#editprofile").show();
    });
    $("#cancel").click(function(){
        $("#editprofile").hide();
        $("#view").show();
    });
    $("#password").click(function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        document.getElementById('password').disabled = true;
        var url = "/password_reset";
        $.ajax({
           type: "POST",
           url: url,
           data: {email: "email"},
           success: function(data)
           {
               
           }
        });
    });
    /*$("#submit").click(function(){
        $("#editprofile").hide();
        $("#view").show();
        var url = "/users/id"; // the script where you handle the form input.
		$.ajax({
			   type: "PUT",
			   url: url,
			   data: $("#theForm").serialize(),
			   //data: {firstname: document.getElementById("pnumber").value + "&&&" + document.getElementById("max").value},
			   //data: {information: document.getElementById("editfname").value + "&&&" + document.getElementById("editlname").value},
			   success: function(data)
			   {
				   alert(data); // show response from the php script.
			   }
		});
    });
    */
});

$(document).ready(function()
{
    $('#created_on').hide();
    var userGroupId;
    $('#accept_btn').click(function()
    {
        userGroupId = $(this).get(0).name;
        $.ajax({
            url: '/status',
            data: {user_group_id: userGroupId, button: "accept"},
            type: 'post',
            success: function(data) 
            {
                $("#accept_btn").hide();
                $('#decline_btn').hide();
                $('#created_on').show();
            
            },
            failure: function() 
            {
                console.log("Failure");
            }
        });
    });
    $("#decline_btn").click(function()
    {
        userGroupId = $(this).get(0).name;
        $.ajax({
            url: '/status',
            data: {user_group_id: userGroupId, button: "decline"},
            type: 'post',
            success: function(data) 
            {
                $('#' + userGroupId).hide();
            },
            failure: function() 
            {
                console.log("Failure");
            }
        });
    });
});
