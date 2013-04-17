<?php //Bismillah
//Does the user need to be logged in to see this page? (Will replace content with *_nologin.php if logged out)
$need_login = true;
include('conn.php');
?>
<head>
<title>Class of '73</title>
<link href="styles/global.css" rel="stylesheet" type="text/css">
<link href="styles/jqueryui.css" rel="stylesheet" type="text/css">
<style type="text/css">
.frmsett
{
	width: 225px;
}
</style>
<script type="text/javascript" src="scripts/global.js"></script>
<script type="text/javascript" src="scripts/jquery.js"></script>
<script type="text/javascript" src="scripts/jqueryui.js"></script>

<script src="scripts/tmpl.min.js"></script>
<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
<script src="scripts/load-image.min.js"></script>
<!-- The Canvas to Blob plugin is included for image resizing functionality -->
<script src="scripts/canvas-to-blob.min.js"></script>
<!-- jQuery Image Gallery -->
<script src="scripts/jquery.image-gallery.min.js"></script>
<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
<script src="scripts/jquery.iframe-transport.js"></script>
<!-- The basic File Upload plugin -->
<script src="scripts/jquery.fileupload.js"></script>
<!-- The File Upload file processing plugin -->
<script src="scripts/jquery.fileupload-fp.js"></script>
<!-- The File Upload user interface plugin -->
<script src="scripts/jquery.fileupload-ui.js"></script>
<!-- The File Upload jQuery UI plugin -->
<script src="scripts/jquery.fileupload-jui.js"></script>

<script type="text/javascript">
//Remove Profile Pic
function rempic()
{
	$.get(
		"pics/remmypic.php", {
			auth: "abc201301221337xyz"
		},
		function(data) {
			$.get('pics/myurl.php', { thumb: 'false' }, function(responseText) { $('#imgpp').attr('src', responseText); });
			$('#btnrem').hide();
		});
}

//Save Account Settings
function frmsettSave()
{
	$('#posSett').hide();
	$('#errSett').hide();
	
	$.get("edit_account_save.php", {
			"FirstName": $('#txFirstName').val(),
			"LastName": $('#txLastName').val(),
			"DisplayName": $('#txDisplayName').val(),
			"Department": $('#txDepartment').val(),
			"Email": $('#txEmail').val()
		}, function(data) {
			if (data!="Success")
			{
				$('#errSettmsg').html(data);
				$('#errSett').show('shake');
			}
			else
			{
				$('#posSettmsg').html("<strong>Success:</strong>&nbsp;You're information has been saved.");
				$('#posSett').fadeIn(function() { setTimeout( function() { $('#posSett').fadeOut(4000); }, 2000); });
			}
		});
}
			
</script>
</head>
<body>
<?php
include('head.php');
?>
<script type="text/javascript">
	$(function() {
		//$( "#settbox" ).tabs( "option", "heightStyle", "fill" );
		$('#settbox').css('border', '0px');
		
		//init remove profpic dialog
		$('#dlgRemPP').dialog({
			resizable: false,
			autoOpen: false,
			modal: true,
			buttons: {
				"Remove": function() { rempic(); $(this).dialog("close"); },
				"Close": function() { $(this).dialog("close"); }
			}
		});
	});
</script>
        <div id="content">
        	
            <div id="settbox" class="jqtabs">
            	<ul>
                	<li><a href="edit_account.php">Account Settings</a></li>
                    <li><a href="edit_contact.php">Contact Info</a></li>
                    <li><a href="edit_family.php">Family</a></li>
                    <li><a href="edit_career.php">Career</a></li>
                    <li><a href="edit_memories.php">Memories</a></li>
                    <li><a href="edit_photos.php">Photos</a></li>
				</ul>
            </div>
        
        </div>
<?php
include('foot.php');
?>
<!-- Delete Confirmation Dialog -->
<div id="dlgRemPP" title="Remove Profile Picture?">
	<span class="ui-icon ui-icon-alert" style="float: left; margin: 0px 15px 15px 0px;"></span>Are you sure you want to remove your profile picture?</p>
</div>
</body>