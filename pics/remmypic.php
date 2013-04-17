<?php //Bismillah
include('../conn.php');
/*
Removes the current user's profile picture/thumb
*/

//Prevent Accidental/Unauthorized Deletion
if (!isset($_GET['auth']))
{
	die("noAuth");
}
if ($_GET['auth']!="abc201301221337xyz")
{
	die("invalidAuth");
}

//Confirm that User is logged in
if (!$uid)
{
	die("NotLoggedIn");
}

if ($u)
{
	if ($u['profpic']!="")
	{
		$pic = "profile/".$uid."/".$u['profpic'];
		$thumb = "profile/".$uid."/thumbnail/".$u['profpic'];
		$sql = "Update `users` Set `profpic`='';";
		if (unlink($pic)&&unlink($thumb)&&myq($sql))
		{
			die("Success");
		}
		else
		{
			die("ExecError");
		}
	}
	else
	{
		die("NoPic");
	}
}
else
{
	die("UserNotFound");
}
?>