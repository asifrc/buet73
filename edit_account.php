<?php //Bismillah
include('conn.php');
/*
Load Account Settings and Allow Save
*/
/*
'First Name', text
'Last Name', text
'Display Name', text
'Department', dropdown
'Email', email
'Password', password
Facebook connect..
*/



$dep[0] = "Architecture";
$dep[1] = "Civil Engineering";
$dep[2] = "Chemical Engineering";
$dep[3] = "Electrical Engineering";
$dep[4] = "Mechanical Engineering";
$dep[5] = "Metallurgical Engineering";
$dep[6] = "Naval Architecture";

?>
<h1 align="center">Account Settings</h1>
<div id="#acctop">
<?php
/*
Profile Picture
*/

if ($u['profpic']!="")
{
	$picx = true;
	$pic = "pics/profile/".$uid."/".$u['profpic'];
	$thumb = "pics/profile/".$uid."/thumbnail/".$u['profpic'];
}
else
{
	$picx = false;
	$pic = "pics/profile/no/pic.gif";
	$thumb = "pics/profile/no/thumbnail/pic.gif";
}
echo "<div>\n";
echo "<table><tr><td style=\"vertical-align: top;\"><img id=\"imgpp\" src=\"".$pic."\" width=\"210px\">";
?>
<div style="width: 250px; align: center;">
<!-- The file upload form used as target for the file upload widget -->
    <form id="fileupload" action="//jquery-file-upload.appspot.com/" method="POST" enctype="multipart/form-data">
        <!-- Redirect browsers with JavaScript disabled to the origin page -->
        <noscript><input type="hidden" name="redirect" value="http://blueimp.github.com/jQuery-File-Upload/"></noscript>
        <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->
        <div class="row fileupload-buttonbar">
            <div class="span7">
                <!-- The fileinput-button span is used to style the file input field as button -->
                <span id="btnup" class="btn btn-success fileinput-button btnsup">
                    <i class="icon-plus icon-white"></i>
                    <span>Upload Pic</span>
                    <input type="file" name="files[]" multiple>
                </span>
                <button type="button" id="btnrem" class="mybut btnsup" onclick="$('#dlgRemPP').dialog('open');">
                    <span>Remove</span>
                </button>
            </div>
        </div>
        <!-- The loading indicator is shown during file processing -->
        <div class="fileupload-loading"></div>
        <br>
        <!-- The table listing the files available for upload/download -->
        <table role="presentation" class="table table-striped"><tbody class="files" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody></table>
    </form>
</div>

<!-- The template to display files available for upload -->
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload fade">
        <td class="preview"><span class="fade"></span></td>
        {% if (file.error) { %}
            <td class="error" colspan="2"><span class="label label-important">Error</span> {%=file.error%}</td>
        {% } else if (o.files.valid && !i) { %}
            <td class="start">{% if (!o.options.autoUpload) { %}
                <button class="btn btn-primary">
                    <i class="icon-upload icon-white"></i>
                    <span>Upload</span>
                </button>
            {% } %}</td>
        {% } else { %}
            <td colspan="2"></td>
        {% } %}
        <td class="cancel">{% if (!i) { %}
            <button class="btn btn-warning">
                <i class="icon-ban-circle icon-white"></i>
                <span>Cancel</span>
            </button>
        {% } %}</td>
    </tr>
{% } %}
</script>
<!-- The template to display files available for download -->
<script id="template-download" type="text/x-tmpl">

</script>
<!-- The main application script -->
<script src="scripts/ppup01.js"></script>

<?
/*
Account Info
*/
echo "</td><td style=\"vertical-align: top;\"><div>";
echo "<table>\n";
?>
<!-- Error Dialog -->
<tr><td colspan="2">
<div id="posSett" class="ui-widget">
	<div class="ui-state-highlight ui-corner-all">
		<span class="ui-icon ui-icon-info" style="float: left; margin-right: 10px;"></span>
		<span id="posSettmsg" class="blktxt"></span>
	</div>
</div>
<div id="errSett" class="ui-widget">
    <div class="ui-state-error ui-corner-all">
        <span class="ui-icon ui-icon-alert" style="float: left; margin-right: 10px;;"></span>
        <span id="errSettmsg" class="blktxt"></span>
    </div>
</div>
</td></tr>
<?php
echo "<tr><td>Department</td>\n";
echo "\t<td><select class=\"frmsett\" id=\"txDepartment\">\n";
foreach ($dep as $d)
{
	echo "\t\t<option";
	if ($d==$u["Department"])
	{
		echo " selected";
	}
	echo ">".$d."</option>\n";
}
echo "\t</select></td></tr>\n";

$fls = array("FirstName", "LastName", "DisplayName", "Email");
foreach ($fls as $fl)
{
	$inp[$fl] =  "<input type=\"text\" id=\"tx".$fl."\" class=\"frmsett\" value=\"".$u[$fl]."\">";
	echo "<tr><td class=\"tdl\">".$fl."</td><td>".$inp[$fl]."</td></tr>\n";
}

echo "<tr><td>&nbsp;</td><td><button class=\"jqbtnD\">Change Password</button></td></tr>\n";

echo "<tr><td>&nbsp;</td><td>&nbsp;</td></tr>\n";
echo "<tr><td>&nbsp;</td><td><button class=\"jqbtnD\" onclick=\"frmsettSave();\">Save</button>\n";
echo "<button class=\"jqbtnD\" onclick=\"$('#ui-tabs-1').load('edit_account.php');\">Cancel</button></td></tr>\n";

echo "</table>\n";
echo "</div>\n";

/*
Profile Picture Upload
*/
?>
</div>
<?php
echo "</td></tr></div>";
?>
<?php
echo "<span id=\"spimgval\" style=\"display: none;\">".$pic."</span>";
?>

<script type="text/javascript">
	$(function() {
		//Init Profile Upload CSS
		$('head').append('<link rel="stylesheet" href="styles/jquery.fileupload-ui.css" type="text/css" />');
		//Init jqui buttonss
		$('.jqbtnD').button();
		if ($('#spimgval').html()=="pics/profile/no/pic.gif")
		{
			$('#btnrem').hide();
		}
		$('#posSett').hide();
		$('#errSett').hide();
	});
</script>