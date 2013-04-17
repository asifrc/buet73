<?php //Bismillah
include("conn.php");
if (!isset($_POST['Email']))
{
	die("You must provide an Email address.");
}
if ($_POST['Email']=="")
{
	die("You must provide an Email address.");
}
if (!isset($_POST['Password']))
{
	die("You must provide a password");
}
if ($_POST['Password']=="")
{
	die("You must provide a password");
}

$sql = "Select Count(*) as `cnt` From `users` Where `Email`=\"".$_POST['Email']."\";";
$rsc = mysql_fetch_array(mysql_query($sql));
if ($rsc['cnt']=="0")
{
	die("You entered an invalid Email Address");
}
if ($rsc['cnt']!="1")
{
	die("An error occurred.");
}

//Now we know the user exists
$sql = "Select * From `users` Where `Email`=\"".$_POST['Email']."\";";
$rsu = mysql_fetch_array(mysql_query($sql));
if (md5(strtolower($_POST['Password']))==$rsu['Password'])
{
	$_SESSION['uid'] = $rsu['id'];
	die("Success");
}
else
{
	die("You entered an invalid password.");
}
?>