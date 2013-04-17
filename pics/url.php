<?php //Bismillah
include('../conn.php');
/*
Returns the Profile Pic URL
*/

//Default Profile Picture
$pic = "pics/profile/no/pic.gif";
$thumb = "pics/profile/no/thumbnail/pic.gif";

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
				$pic = "pics/profile/".$_GET['id']."/".$rsu['profpic'];
				$thumb = "pics/profile/".$_GET['id']."/thumbnail/".$rsu['profpic'];
			}
		}
	}
}

//Return picture based on whether thumbnail is requested
if ($t)
{
	echo $thumb;
}
else
{
	echo $pic;
}
?>
