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
if ($u)
{
	if ($u['profpic']!="")
	{
		$pic = "pics/profile/".$uid."/".$u['profpic'];
		$thumb = "pics/profile/".$uid."/thumbnail/".$u['profpic'];
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
