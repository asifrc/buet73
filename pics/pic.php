<?php //Bismillah
include('../conn.php');
/*
Returns the Profile Pic URL
*/

//Default Profile Picture
$pic = "profile/no/pic.gif";
$thumb = "profile/no/thumbnail/pic.gif";

//Determine if Thumbnail Version Requested
$t = false;
if (isset($_GET['t']))
{
	if ($_GET['t']=="thumb")
	{
		$t = true;
	}
}

//Check for valid user	
if (isset($_GET['id']))
{
	if ($_GET['id']!="")
	{
		$sql = "Select `profpic` From `users` Where `id`=".$_GET['id'];
		if ($db = myq($sql))
		{
			$rsu = mysql_fetch_array($db);
			if ($rsu['profpic']!="")
			{
				$pic = "profile/".$_GET['id']."/".$rsu['profpic'];
				$thumb = "profile/".$_GET['id']."/thumbnail/".$rsu['profpic'];
			}
		}
	}
}
//Return picture based on whether thumbnail is requested
if ($t)
{
	$imgname = $thumb;
}
else
{
	$imgname =  $pic;
}

//Display Image
header('content-type: image/png');
$fimg = fopen($imgname,"r");
$img = fread($fimg, filesize($imgname));
print $img;
?>
