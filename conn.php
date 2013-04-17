<?php //Bismillah
$conn = mysql_connect("buet73dev.db.6539354.hostedresource.com", "buet73dev", "Alumni0!");
if (!$conn)
{
	die("A database error occured: ".mysql_error());
}
mysql_select_db("buet73dev");

//Database Error handler
function err($tx)
{
	die($tx);
}

//Checks if there are greater than 0 records, return either query object or false
function myq($sq)
{
	if(!$dbq = mysql_fetch_array(mysql_query(str_replace("Select *", "Select Count(*)", $sq))))
	{
		err("MySQL Error: ".mysql_error());
	}
	if ($dbq["Count(*)"]!="0")
	{
		$dbr = mysql_query($sq);
	}
	else
	{
		$dbr = false;
	}
	return $dbr;
}

//USER STUFF
$u = false;
$uid = false;
session_start();
if (isset($_SESSION['uid']))
{
	if ($_SESSION['uid']!="")
	{
		$uid = $_SESSION['uid'];
	}
}

if ($uid)
{
	$sqlu = "Select * From `users` Where `id`=".$uid;
	$u = mysql_fetch_array(myq($sqlu));
	if (!$u)
	{
		$uid = false;
		session_destroy();
	}
}
	
?>